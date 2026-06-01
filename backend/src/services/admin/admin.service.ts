import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapEvent, mapUser, mapUserPublic } from "../../db/mappers";
import * as activityService from "../activity/activity.service";

export function getPlatformStats() {
  const db = getDb();
  const users = (db.prepare(`SELECT COUNT(*) as c FROM ${Tables.USERS}`).get() as { c: number }).c;
  const events = (
    db
      .prepare(`SELECT COUNT(*) as c FROM ${Tables.EVENTS} WHERE deleted_at IS NULL`)
      .get() as { c: number }
  ).c;
  const designs = (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM ${Tables.DESIGN_DRAFTS} WHERE deleted_at IS NULL`
      )
      .get() as { c: number }
  ).c;
  const exportsTotal = (
    db.prepare(`SELECT COUNT(*) as c FROM ${Tables.EXPORT_FILES}`).get() as { c: number }
  ).c;
  const templates = (
    db
      .prepare(`SELECT COUNT(*) as c FROM ${Tables.TEMPLATES} WHERE is_active = 1`)
      .get() as { c: number }
  ).c;
  const uploads = (
    db.prepare(`SELECT COUNT(*) as c FROM ${Tables.UPLOADED_ASSETS}`).get() as { c: number }
  ).c;
  return { users, events, designs, exports: exportsTotal, templates, uploads };
}

export function getUsersByPlan(): Record<string, number> {
  const rows = getDb()
    .prepare(`SELECT plan, COUNT(*) as c FROM ${Tables.USERS} GROUP BY plan`)
    .all() as { plan: string; c: number }[];
  const out: Record<string, number> = {};
  for (const row of rows) {
    out[row.plan || "free"] = row.c;
  }
  return out;
}

export function getExportsByStatus(): Record<string, number> {
  const rows = getDb()
    .prepare(`SELECT status, COUNT(*) as c FROM ${Tables.EXPORT_FILES} GROUP BY status`)
    .all() as { status: string; c: number }[];
  const out: Record<string, number> = {};
  for (const row of rows) {
    out[row.status || "unknown"] = row.c;
  }
  return out;
}

/** Admin usage & activity overview */
export function getAdminUsageSummary() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 7);
  const sinceIso = since.toISOString();

  return {
    stats: getPlatformStats(),
    usersByPlan: getUsersByPlan(),
    exportsByStatus: getExportsByStatus(),
    activity: {
      last7DaysTotal: activityService.countActivitySince(sinceIso),
      byAction: activityService.getActivityCountsByAction(),
      byActionLast7Days: activityService.getActivityCountsByAction(sinceIso),
      recent: activityService.listRecentActivityGlobal(25),
    },
  };
}

export function listUsersAdmin(limit = 50) {
  const rows = getDb()
    .prepare(`SELECT * FROM ${Tables.USERS} ORDER BY created_at DESC LIMIT ?`)
    .all(limit);
  return rows.map((r) =>
    mapUserPublic(mapUser(r as Parameters<typeof mapUser>[0]))
  );
}

export function listEventsAdmin(limit = 50) {
  const rows = getDb()
    .prepare(`SELECT * FROM ${Tables.EVENTS} ORDER BY updated_at DESC LIMIT ?`)
    .all(limit);
  return rows.map((r) => mapEvent(r as Record<string, unknown>));
}
