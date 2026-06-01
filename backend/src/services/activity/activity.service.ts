import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import type { ActivityLog, ActivityLogWithUser } from "../../db/models";
import { ActivityAction } from "../../db/models";
import { newId, nowIso } from "../../utils/id";
import { parseJson, stringifyJson } from "../../utils/json";
import { parsePagination, paginationMeta } from "../../utils/pagination";

const ACTION_TITLES: Record<string, string> = {
  [ActivityAction.EVENT_CREATED]: "Event created",
  [ActivityAction.EVENT_UPDATED]: "Event updated",
  [ActivityAction.PRODUCT_ENABLED]: "Product enabled",
  [ActivityAction.PRODUCT_UPDATED]: "Product updated",
  [ActivityAction.DESIGN_CREATED]: "Design created",
  [ActivityAction.DESIGN_SAVED]: "Design saved",
  [ActivityAction.DESIGN_DELETED]: "Design moved to trash",
  [ActivityAction.ASSET_UPLOADED]: "Asset uploaded",
  [ActivityAction.EXPORT_CREATED]: "Export created",
  [ActivityAction.EXPORT_COMPLETED]: "Export completed",
  [ActivityAction.TEMPLATE_USED]: "Template applied",
  [ActivityAction.PLAN_CHANGED]: "Plan changed",
  [ActivityAction.PAYMENT_WEBHOOK_REVIEWED]: "Payment webhook reviewed",
  [ActivityAction.PAYMENT_ADMIN_OVERRIDE]: "Payment admin override",
};

function mapActivity(row: Record<string, unknown>): ActivityLog {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    action: row.action as string,
    resourceType: (row.resource_type as string) ?? null,
    resourceId: (row.resource_id as string) ?? null,
    title: row.title as string,
    metadata: parseJson<Record<string, unknown>>(row.metadata_json as string, {}),
    createdAt: row.created_at as string,
  };
}

function mapActivityWithUser(row: Record<string, unknown>): ActivityLogWithUser {
  return {
    ...mapActivity(row),
    userName: (row.user_name as string) ?? null,
  };
}

export function logActivity(params: {
  userId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  title?: string;
  metadata?: Record<string, unknown>;
}): void {
  const id = newId("act");
  const title = params.title ?? ACTION_TITLES[params.action] ?? params.action;
  getDb()
    .prepare(
      `INSERT INTO ${Tables.ACTIVITY_LOGS} (
        id, user_id, action, resource_type, resource_id, title, metadata_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      params.userId,
      params.action,
      params.resourceType ?? null,
      params.resourceId ?? null,
      title,
      stringifyJson(params.metadata ?? {}),
      nowIso()
    );
}

export function logEventCreated(
  userId: string,
  eventId: string,
  metadata?: Record<string, unknown>
): void {
  logActivity({
    userId,
    action: ActivityAction.EVENT_CREATED,
    resourceType: "event",
    resourceId: eventId,
    metadata,
  });
}

export function logDesignSaved(
  userId: string,
  designId: string,
  metadata?: Record<string, unknown>
): void {
  logActivity({
    userId,
    action: ActivityAction.DESIGN_SAVED,
    resourceType: "design",
    resourceId: designId,
    metadata,
  });
}

export function logDesignCreated(
  userId: string,
  designId: string,
  metadata?: Record<string, unknown>
): void {
  logActivity({
    userId,
    action: ActivityAction.DESIGN_CREATED,
    resourceType: "design",
    resourceId: designId,
    metadata,
  });
}

export function logAssetUploaded(
  userId: string,
  assetId: string,
  metadata?: Record<string, unknown>
): void {
  logActivity({
    userId,
    action: ActivityAction.ASSET_UPLOADED,
    resourceType: "upload",
    resourceId: assetId,
    metadata,
  });
}

export function logExportCreated(
  userId: string,
  exportId: string,
  metadata?: Record<string, unknown>
): void {
  logActivity({
    userId,
    action: ActivityAction.EXPORT_CREATED,
    resourceType: "export",
    resourceId: exportId,
    metadata,
  });
}

export function logExportCompleted(
  userId: string,
  exportId: string,
  metadata?: Record<string, unknown>
): void {
  logActivity({
    userId,
    action: ActivityAction.EXPORT_COMPLETED,
    resourceType: "export",
    resourceId: exportId,
    metadata,
  });
}

export function logTemplateUsed(
  userId: string,
  templateId: string,
  metadata?: Record<string, unknown>
): void {
  logActivity({
    userId,
    action: ActivityAction.TEMPLATE_USED,
    resourceType: "template",
    resourceId: templateId,
    metadata,
  });
}

export function listActivity(
  userId: string,
  query?: { page?: string; limit?: string }
): { items: ActivityLog[]; meta?: ReturnType<typeof paginationMeta> } {
  if (!query?.page && !query?.limit) {
    const limit = Math.min(50, Number(query?.limit) || 20);
    const rows = getDb()
      .prepare(
        `SELECT * FROM ${Tables.ACTIVITY_LOGS} WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
      )
      .all(userId, limit);
    return { items: rows.map((r) => mapActivity(r as Record<string, unknown>)) };
  }

  const pg = parsePagination(query);
  const total = (
    getDb()
      .prepare(`SELECT COUNT(*) as c FROM ${Tables.ACTIVITY_LOGS} WHERE user_id = ?`)
      .get(userId) as { c: number }
  ).c;
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.ACTIVITY_LOGS} WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
    )
    .all(userId, pg.limit, pg.offset);
  return {
    items: rows.map((r) => mapActivity(r as Record<string, unknown>)),
    meta: paginationMeta(total, pg),
  };
}

export function listRecentActivity(userId: string, limit = 10): ActivityLog[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.ACTIVITY_LOGS} WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
    )
    .all(userId, limit);
  return rows.map((r) => mapActivity(r as Record<string, unknown>));
}

export function listRecentActivityGlobal(limit = 30): ActivityLogWithUser[] {
  const rows = getDb()
    .prepare(
      `SELECT a.*, u.name as user_name
       FROM ${Tables.ACTIVITY_LOGS} a
       LEFT JOIN ${Tables.USERS} u ON u.id = a.user_id
       ORDER BY a.created_at DESC
       LIMIT ?`
    )
    .all(limit);
  return rows.map((r) => mapActivityWithUser(r as Record<string, unknown>));
}

export function getActivityCountsByAction(sinceIso?: string): Record<string, number> {
  const sql = sinceIso
    ? `SELECT action, COUNT(*) as c FROM ${Tables.ACTIVITY_LOGS} WHERE created_at >= ? GROUP BY action`
    : `SELECT action, COUNT(*) as c FROM ${Tables.ACTIVITY_LOGS} GROUP BY action`;
  const rows = sinceIso
    ? (getDb().prepare(sql).all(sinceIso) as { action: string; c: number }[])
    : (getDb().prepare(sql).all() as { action: string; c: number }[]);
  const out: Record<string, number> = {};
  for (const row of rows) {
    out[row.action] = row.c;
  }
  return out;
}

export function countActivitySince(sinceIso: string): number {
  return (
    getDb()
      .prepare(`SELECT COUNT(*) as c FROM ${Tables.ACTIVITY_LOGS} WHERE created_at >= ?`)
      .get(sinceIso) as { c: number }
  ).c;
}
