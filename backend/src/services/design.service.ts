import { getDb } from "../db/client";
import { mapDesignDraft } from "../db/mappers";
import type { DesignDraft, DesignDraftStatus } from "../types/entities";
import { newId, nowIso } from "../utils/id";
import { stringifyJson } from "../utils/json";
import { parsePagination, paginationMeta } from "../utils/pagination";
import * as billingLimits from "./billing-limits.service";
import * as activity from "./activity/activity.service";

export type DesignListItem = {
  id: string;
  userId: string;
  eventId: string | null;
  eventProductId: string | null;
  productType: string;
  title: string;
  thumbnailUrl: string | null;
  status: DesignDraftStatus;
  version: number;
  lastEditedAt: string;
  updatedAt: string;
  createdAt: string;
};

function getOwnedDraft(id: string, userId: string, includeDeleted = false): DesignDraft {
  const row = getDb().prepare("SELECT * FROM design_drafts WHERE id = ?").get(id);
  if (!row) throw new Error("NOT_FOUND");
  const draft = mapDesignDraft(row as Record<string, unknown>);
  if (draft.userId !== userId) throw new Error("FORBIDDEN");
  if (!includeDeleted && draft.deletedAt) throw new Error("NOT_FOUND");
  return draft;
}

function mapListItem(row: Record<string, unknown>): DesignListItem {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    eventId: (row.event_id as string) ?? null,
    eventProductId: (row.event_product_id as string) ?? null,
    productType: row.product_type as string,
    title: row.title as string,
    thumbnailUrl: (row.thumbnail_url as string) ?? null,
    status: row.status as DesignDraftStatus,
    version: Number(row.version ?? 1),
    lastEditedAt: (row.last_edited_at as string) ?? (row.updated_at as string),
    updatedAt: row.updated_at as string,
    createdAt: row.created_at as string,
  };
}

export function listDesigns(
  userId: string,
  query: { page?: string; limit?: string; includeCanvas?: string }
): { items: DesignListItem[]; meta: ReturnType<typeof paginationMeta> } {
  const pg = parsePagination(query);
  const total = (
    getDb()
      .prepare(
        "SELECT COUNT(*) as c FROM design_drafts WHERE user_id = ? AND deleted_at IS NULL"
      )
      .get(userId) as { c: number }
  ).c;

  if (query.includeCanvas === "true") {
    const rows = getDb()
      .prepare(
        `SELECT * FROM design_drafts WHERE user_id = ? AND deleted_at IS NULL
         ORDER BY last_edited_at DESC LIMIT ? OFFSET ?`
      )
      .all(userId, pg.limit, pg.offset);
    return {
      items: rows.map((r) => mapDesignDraft(r as Record<string, unknown>)) as unknown as DesignListItem[],
      meta: paginationMeta(total, pg),
    };
  }

  const rows = getDb()
    .prepare(
      `SELECT id, user_id, event_id, event_product_id, product_type, title, thumbnail_url,
              status, version, last_edited_at, updated_at, created_at
       FROM design_drafts WHERE user_id = ? AND deleted_at IS NULL
       ORDER BY last_edited_at DESC LIMIT ? OFFSET ?`
    )
    .all(userId, pg.limit, pg.offset);
  return { items: rows.map((r) => mapListItem(r as Record<string, unknown>)), meta: paginationMeta(total, pg) };
}

export function getDesign(id: string, userId: string): DesignDraft {
  return getOwnedDraft(id, userId);
}

function saveVersionSnapshot(draft: DesignDraft): void {
  getDb()
    .prepare(
      `INSERT INTO design_draft_versions (id, design_draft_id, version, canvas_data_json, thumbnail_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      newId("dsv"),
      draft.id,
      draft.version,
      stringifyJson(draft.canvasData),
      draft.thumbnailUrl,
      nowIso()
    );
}

export function createDesign(
  userId: string,
  data: {
    productType: string;
    title: string;
    canvasData?: unknown;
    thumbnailUrl?: string;
    status?: DesignDraftStatus;
    eventId?: string;
    eventProductId?: string;
  }
): DesignDraft {
  billingLimits.assertCanCreateDesign(userId);
  const id = newId("dsn");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO design_drafts (
        id, user_id, event_id, event_product_id, product_type, title,
        canvas_data_json, thumbnail_url, status, version, last_edited_at,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`
    )
    .run(
      id,
      userId,
      data.eventId ?? null,
      data.eventProductId ?? null,
      data.productType,
      data.title,
      stringifyJson(data.canvasData ?? { elements: [] }),
      data.thumbnailUrl ?? null,
      data.status ?? "draft",
      ts,
      ts,
      ts
    );
  billingLimits.syncUsageCounts(userId);
  const draft = getDesign(id, userId);
  saveVersionSnapshot(draft);
  activity.logDesignCreated(userId, draft.id, {
    title: draft.title,
    productType: draft.productType,
  });
  return draft;
}

export function updateDesign(
  id: string,
  userId: string,
  patch: Partial<{
    title: string;
    canvasData: unknown;
    thumbnailUrl: string | null;
    status: DesignDraftStatus;
    productType: string;
    eventId: string | null;
    eventProductId: string | null;
    autosave: boolean;
  }>
): DesignDraft {
  const current = getOwnedDraft(id, userId);
  const ts = nowIso();
  const nextVersion =
    patch.canvasData !== undefined ? current.version + 1 : current.version;

  if (patch.canvasData !== undefined) {
    saveVersionSnapshot(current);
  }

  getDb()
    .prepare(
      `UPDATE design_drafts SET
        title = ?, canvas_data_json = ?, thumbnail_url = ?, status = ?,
        product_type = ?, event_id = ?, event_product_id = ?,
        version = ?, last_edited_at = ?, updated_at = ?
      WHERE id = ?`
    )
    .run(
      patch.title ?? current.title,
      patch.canvasData !== undefined ? stringifyJson(patch.canvasData) : stringifyJson(current.canvasData),
      patch.thumbnailUrl !== undefined ? patch.thumbnailUrl : current.thumbnailUrl,
      patch.status ?? current.status,
      patch.productType ?? current.productType,
      patch.eventId !== undefined ? patch.eventId : current.eventId,
      patch.eventProductId !== undefined ? patch.eventProductId : current.eventProductId,
      nextVersion,
      ts,
      ts,
      id
    );
  const draft = getDesign(id, userId);
  if (patch.canvasData !== undefined || patch.title !== undefined || patch.thumbnailUrl !== undefined) {
    activity.logDesignSaved(userId, draft.id, {
      version: draft.version,
      autosave: patch.autosave ?? false,
    });
  }
  return draft;
}

export function softDeleteDesign(id: string, userId: string): void {
  getOwnedDraft(id, userId);
  const ts = nowIso();
  getDb()
    .prepare("UPDATE design_drafts SET deleted_at = ?, updated_at = ? WHERE id = ?")
    .run(ts, ts, id);
  billingLimits.syncUsageCounts(userId);
}

export function restoreDesign(id: string, userId: string): DesignDraft {
  const row = getDb().prepare("SELECT * FROM design_drafts WHERE id = ?").get(id);
  if (!row) throw new Error("NOT_FOUND");
  const draft = mapDesignDraft(row as Record<string, unknown>);
  if (draft.userId !== userId) throw new Error("FORBIDDEN");
  const ts = nowIso();
  getDb()
    .prepare("UPDATE design_drafts SET deleted_at = NULL, updated_at = ? WHERE id = ?")
    .run(ts, id);
  billingLimits.syncUsageCounts(userId);
  return getDesign(id, userId);
}

export function listDesignVersions(designId: string, userId: string) {
  getOwnedDraft(designId, userId);
  const rows = getDb()
    .prepare(
      `SELECT id, design_draft_id, version, thumbnail_url, created_at
       FROM design_draft_versions WHERE design_draft_id = ? ORDER BY version DESC LIMIT 20`
    )
    .all(designId);
  return rows;
}

export function duplicateDesign(id: string, userId: string): DesignDraft {
  billingLimits.assertCanCreateDesign(userId);
  const source = getOwnedDraft(id, userId);
  return createDesign(userId, {
    productType: source.productType,
    title: `${source.title} (copy)`,
    canvasData: source.canvasData,
    thumbnailUrl: source.thumbnailUrl ?? undefined,
    status: "draft",
    eventId: source.eventId ?? undefined,
    eventProductId: source.eventProductId ?? undefined,
  });
}

/** Hard delete — admin or cleanup only */
export function deleteDesignPermanent(id: string, userId: string): void {
  getOwnedDraft(id, userId, true);
  getDb().prepare("DELETE FROM design_drafts WHERE id = ?").run(id);
  billingLimits.syncUsageCounts(userId);
}
