import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapEvent, mapEventProduct } from "../../db/mappers";
import type { Event, EventProduct, EventStatus } from "../../db/models";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";
import { parsePagination, paginationMeta } from "../../utils/pagination";
import * as billingLimits from "../billing-limits.service";
import * as activity from "../activity/activity.service";
import { ActivityAction } from "../../db/models";

const NOT_DELETED = "deleted_at IS NULL";

function mapEventRow(row: Record<string, unknown>): Event {
  return mapEvent(row);
}

function assertEventOwner(
  eventId: string,
  userId: string,
  opts?: { includeDeleted?: boolean }
): Event {
  const row = getDb()
    .prepare(`SELECT * FROM ${Tables.EVENTS} WHERE id = ?`)
    .get(eventId);
  if (!row) throw new Error("NOT_FOUND");
  const event = mapEventRow(row as Record<string, unknown>);
  if (event.userId !== userId) throw new Error("FORBIDDEN");
  if (!opts?.includeDeleted && event.deletedAt) throw new Error("NOT_FOUND");
  return event;
}

export function listEvents(
  userId: string,
  query?: { page?: string; limit?: string; includeDeleted?: string }
): { items: Event[]; meta?: ReturnType<typeof paginationMeta> } {
  const includeDeleted = query?.includeDeleted === "true";
  const deletedFilter = includeDeleted ? "1=1" : NOT_DELETED;

  if (!query?.page && !query?.limit) {
    const rows = getDb()
      .prepare(
        `SELECT * FROM ${Tables.EVENTS} WHERE user_id = ? AND ${deletedFilter} ORDER BY updated_at DESC`
      )
      .all(userId);
    return { items: rows.map((r) => mapEventRow(r as Record<string, unknown>)) };
  }

  const pg = parsePagination(query);
  const total = (
    getDb()
      .prepare(
        `SELECT COUNT(*) as c FROM ${Tables.EVENTS} WHERE user_id = ? AND ${deletedFilter}`
      )
      .get(userId) as { c: number }
  ).c;
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.EVENTS} WHERE user_id = ? AND ${deletedFilter}
       ORDER BY updated_at DESC LIMIT ? OFFSET ?`
    )
    .all(userId, pg.limit, pg.offset);
  return {
    items: rows.map((r) => mapEventRow(r as Record<string, unknown>)),
    meta: paginationMeta(total, pg),
  };
}

export function getEvent(eventId: string, userId: string): Event {
  return assertEventOwner(eventId, userId);
}

export function createEvent(
  userId: string,
  data: {
    name: string;
    type?: string;
    organizationName?: string;
    date?: string;
    location?: string;
    description?: string;
    language?: string;
    participantEstimate?: number;
    status?: EventStatus;
  }
): Event {
  billingLimits.assertCanCreateEvent(userId);
  const id = newId("evt");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO ${Tables.EVENTS} (
        id, user_id, name, type, organization_name, date, location, description,
        language, participant_estimate, status, builder_state_json, deleted_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`
    )
    .run(
      id,
      userId,
      data.name,
      data.type ?? "conference",
      data.organizationName ?? null,
      data.date ?? null,
      data.location ?? null,
      data.description ?? null,
      data.language ?? "uz",
      data.participantEstimate ?? null,
      data.status ?? "draft",
      "{}",
      ts,
      ts
    );
  billingLimits.syncUsageCounts(userId);
  const event = getEvent(id, userId);
  activity.logEventCreated(userId, event.id, { name: event.name, type: event.type });
  return event;
}

export function updateEvent(
  eventId: string,
  userId: string,
  patch: Partial<{
    name: string;
    type: string;
    organizationName: string | null;
    date: string | null;
    location: string | null;
    description: string | null;
    language: string | null;
    participantEstimate: number | null;
    status: EventStatus;
    builderState: Record<string, unknown>;
  }>
): Event {
  const current = assertEventOwner(eventId, userId);
  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.EVENTS} SET
        name = ?, type = ?, organization_name = ?, date = ?, location = ?,
        description = ?, language = ?, participant_estimate = ?, status = ?,
        builder_state_json = ?, updated_at = ?
      WHERE id = ?`
    )
    .run(
      patch.name ?? current.name,
      patch.type ?? current.type,
      patch.organizationName !== undefined ? patch.organizationName : current.organizationName,
      patch.date !== undefined ? patch.date : current.date,
      patch.location !== undefined ? patch.location : current.location,
      patch.description !== undefined ? patch.description : current.description,
      patch.language !== undefined ? patch.language : current.language,
      patch.participantEstimate !== undefined
        ? patch.participantEstimate
        : current.participantEstimate,
      patch.status ?? current.status,
      patch.builderState !== undefined
        ? stringifyJson(patch.builderState)
        : stringifyJson(current.builderState),
      ts,
      eventId
    );
  return getEvent(eventId, userId);
}

export function softDeleteEvent(eventId: string, userId: string): Event {
  assertEventOwner(eventId, userId);
  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.EVENTS} SET deleted_at = ?, status = 'archived', updated_at = ? WHERE id = ?`
    )
    .run(ts, ts, eventId);
  billingLimits.syncUsageCounts(userId);
  return assertEventOwner(eventId, userId, { includeDeleted: true });
}

export function restoreEvent(eventId: string, userId: string): Event {
  const event = assertEventOwner(eventId, userId, { includeDeleted: true });
  if (!event.deletedAt) return event;
  const ts = nowIso();
  getDb()
    .prepare(`UPDATE ${Tables.EVENTS} SET deleted_at = NULL, updated_at = ? WHERE id = ?`)
    .run(ts, eventId);
  billingLimits.syncUsageCounts(userId);
  return getEvent(eventId, userId);
}

export function getEventProgress(eventId: string, userId: string) {
  const event = assertEventOwner(eventId, userId);
  const products = listEventProducts(eventId, userId);
  const enabled = products.filter((p) => p.enabled);
  const ready = products.filter((p) => p.status === "ready");
  const withDesign = products.filter((p) => p.designDraftId);
  const withTemplate = products.filter((p) => p.templateId);
  const total = products.length || 1;
  const progressPercent = Math.round(
    ((ready.length + withDesign.length * 0.5) / total) * 100
  );

  return {
    eventId: event.id,
    eventName: event.name,
    status: event.status,
    builderState: event.builderState,
    summary: {
      totalProducts: products.length,
      enabledProducts: enabled.length,
      readyProducts: ready.length,
      withDesignDraft: withDesign.length,
      withTemplate: withTemplate.length,
      progressPercent: Math.min(100, progressPercent),
    },
    products: products.map((p) => ({
      id: p.id,
      productType: p.productType,
      enabled: p.enabled,
      status: p.status,
      hasFormData: Object.keys(p.formData).length > 0,
      templateId: p.templateId,
      designDraftId: p.designDraftId,
      previewThumbnailUrl: p.previewThumbnailUrl,
    })),
  };
}

export function saveEventBuilderState(
  eventId: string,
  userId: string,
  builderState: Record<string, unknown>
): Event {
  billingLimits.assertCanUseEventBuilder(userId);
  return updateEvent(eventId, userId, { builderState });
}

export function listEventProducts(eventId: string, userId: string): EventProduct[] {
  assertEventOwner(eventId, userId);
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.EVENT_PRODUCTS} WHERE event_id = ? ORDER BY created_at ASC`
    )
    .all(eventId);
  return rows.map((r) => mapEventProduct(r as Record<string, unknown>));
}

export function createEventProduct(
  eventId: string,
  userId: string,
  data: {
    productType: string;
    enabled?: boolean;
    status?: string;
    formData?: Record<string, unknown>;
    templateId?: string;
    designDraftId?: string;
    previewThumbnailUrl?: string;
  }
): EventProduct {
  assertEventOwner(eventId, userId);
  billingLimits.assertCanAddEventProduct(userId, eventId);
  const id = newId("ep");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO ${Tables.EVENT_PRODUCTS} (
        id, event_id, product_type, enabled, status, form_data_json,
        template_id, design_draft_id, preview_thumbnail_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      eventId,
      data.productType,
      data.enabled === false ? 0 : 1,
      data.status ?? "draft",
      stringifyJson(data.formData ?? {}),
      data.templateId ?? null,
      data.designDraftId ?? null,
      data.previewThumbnailUrl ?? null,
      ts,
      ts
    );
  const product = mapEventProduct(
    getDb()
      .prepare(`SELECT * FROM ${Tables.EVENT_PRODUCTS} WHERE id = ?`)
      .get(id) as Record<string, unknown>
  );
  activity.logActivity({
    userId,
    action: ActivityAction.PRODUCT_ENABLED,
    resourceType: "event_product",
    resourceId: product.id,
    metadata: { productType: product.productType, eventId },
  });
  if (data.templateId) {
    activity.logTemplateUsed(userId, data.templateId, {
      eventId,
      eventProductId: product.id,
      productType: product.productType,
    });
  }
  return product;
}

export function updateEventProduct(
  eventId: string,
  productId: string,
  userId: string,
  patch: Partial<{
    productType: string;
    enabled: boolean;
    status: string;
    formData: Record<string, unknown>;
    templateId: string | null;
    designDraftId: string | null;
    previewThumbnailUrl: string | null;
  }>
): EventProduct {
  assertEventOwner(eventId, userId);
  const row = getDb()
    .prepare(`SELECT * FROM ${Tables.EVENT_PRODUCTS} WHERE id = ? AND event_id = ?`)
    .get(productId, eventId);
  if (!row) throw new Error("NOT_FOUND");
  const current = mapEventProduct(row as Record<string, unknown>);
  if (patch.enabled === true && !current.enabled) {
    billingLimits.assertCanAddEventProduct(userId, eventId);
  }
  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.EVENT_PRODUCTS} SET
        product_type = ?, enabled = ?, status = ?, form_data_json = ?,
        template_id = ?, design_draft_id = ?, preview_thumbnail_url = ?, updated_at = ?
      WHERE id = ?`
    )
    .run(
      patch.productType ?? current.productType,
      patch.enabled !== undefined ? (patch.enabled ? 1 : 0) : current.enabled ? 1 : 0,
      patch.status ?? current.status,
      patch.formData !== undefined ? stringifyJson(patch.formData) : stringifyJson(current.formData),
      patch.templateId !== undefined ? patch.templateId : current.templateId,
      patch.designDraftId !== undefined ? patch.designDraftId : current.designDraftId,
      patch.previewThumbnailUrl !== undefined
        ? patch.previewThumbnailUrl
        : current.previewThumbnailUrl,
      ts,
      productId
    );
  const product = mapEventProduct(
    getDb()
      .prepare(`SELECT * FROM ${Tables.EVENT_PRODUCTS} WHERE id = ?`)
      .get(productId) as Record<string, unknown>
  );
  if (patch.templateId !== undefined && patch.templateId) {
    activity.logTemplateUsed(userId, patch.templateId, {
      eventId,
      eventProductId: productId,
      productType: product.productType,
    });
  }
  return product;
}

export function setEventProductEnabled(
  eventId: string,
  productId: string,
  userId: string,
  enabled: boolean
): EventProduct {
  return updateEventProduct(eventId, productId, userId, { enabled });
}

export function updateEventProductFormData(
  eventId: string,
  productId: string,
  userId: string,
  formData: Record<string, unknown>
): EventProduct {
  return updateEventProduct(eventId, productId, userId, { formData });
}

export function deleteEventProduct(eventId: string, productId: string, userId: string): void {
  assertEventOwner(eventId, userId);
  const result = getDb()
    .prepare(`DELETE FROM ${Tables.EVENT_PRODUCTS} WHERE id = ? AND event_id = ?`)
    .run(productId, eventId);
  if (result.changes === 0) throw new Error("NOT_FOUND");
}

export function listEventProductsForUser(
  userId: string,
  eventId: string
): EventProduct[] {
  return listEventProducts(eventId, userId);
}
