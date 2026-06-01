import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapExportFile } from "../../db/mappers";
import type { ExportFile, ExportJobStatus } from "../../db/models";
import { getStorage } from "../../storage";
import { userDesignExportKey } from "../../storage/paths";
import { newId, nowIso } from "../../utils/id";
import { parsePagination, paginationMeta } from "../../utils/pagination";
import { getDesign } from "../design.service";
import * as billingLimits from "../billing-limits.service";
import * as activity from "../activity/activity.service";
import {
  assertMimeMatchesFormat,
  defaultMimeForFormat,
  normalizeExportFormat,
} from "./export-formats";

function getOwnedExport(exportId: string, userId: string): ExportFile {
  const row = getDb()
    .prepare(`SELECT * FROM ${Tables.EXPORT_FILES} WHERE id = ?`)
    .get(exportId);
  if (!row) throw new Error("NOT_FOUND");
  const file = mapExportFile(row as Record<string, unknown>);
  if (file.userId !== userId) throw new Error("FORBIDDEN");
  return file;
}

export function toJobStatus(file: ExportFile): ExportJobStatus {
  return {
    id: file.id,
    designDraftId: file.designDraftId,
    format: file.format,
    status: file.status,
    fileUrl: file.status === "completed" ? file.fileUrl : null,
    errorMessage: file.errorMessage,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}

export function getExport(exportId: string, userId: string): ExportFile {
  return getOwnedExport(exportId, userId);
}

export function getExportStatus(exportId: string, userId: string): ExportJobStatus {
  return toJobStatus(getOwnedExport(exportId, userId));
}

export function listExportHistory(
  userId: string,
  query?: { page?: string; limit?: string; designDraftId?: string }
): { items: ExportFile[]; meta?: ReturnType<typeof paginationMeta> } {
  const conditions = ["user_id = ?"];
  const params: unknown[] = [userId];

  if (query?.designDraftId) {
    conditions.push("design_draft_id = ?");
    params.push(query.designDraftId);
  }

  const where = conditions.join(" AND ");

  if (!query?.page && !query?.limit) {
    const rows = getDb()
      .prepare(
        `SELECT * FROM ${Tables.EXPORT_FILES} WHERE ${where} ORDER BY created_at DESC`
      )
      .all(...params);
    return { items: rows.map((r) => mapExportFile(r as Record<string, unknown>)) };
  }

  const pg = parsePagination(query);
  const total = (
    getDb()
      .prepare(`SELECT COUNT(*) as c FROM ${Tables.EXPORT_FILES} WHERE ${where}`)
      .get(...params) as { c: number }
  ).c;
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.EXPORT_FILES} WHERE ${where}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`
    )
    .all(...params, pg.limit, pg.offset);

  return {
    items: rows.map((r) => mapExportFile(r as Record<string, unknown>)),
    meta: paginationMeta(total, pg),
  };
}

/** @deprecated alias */
export const listExports = listExportHistory;

/**
 * Create a pending export job. Renderer (future worker or client) completes via
 * `completeExportJob` or `createExportWithFile`.
 */
export function createExportJob(
  userId: string,
  designDraftId: string,
  formatInput: string
): ExportFile {
  billingLimits.assertCanExport(userId);
  const format = normalizeExportFormat(formatInput);
  getDesign(designDraftId, userId);

  const id = newId("exp");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO ${Tables.EXPORT_FILES} (
        id, user_id, design_draft_id, format, status, file_url, storage_key, error_message, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'pending', '', NULL, NULL, ?, ?)`
    )
    .run(id, userId, designDraftId, format, ts, ts);

  const job = getExport(id, userId);
  activity.logExportCreated(userId, job.id, { format: job.format, designDraftId });
  return job;
}

/** Mark job as processing — hook for future background renderer. */
export function markExportProcessing(exportId: string, userId: string): ExportFile {
  const job = getOwnedExport(exportId, userId);
  if (job.status === "completed") throw new Error("EXPORT_JOB_ALREADY_COMPLETED");
  if (job.status === "failed") throw new Error("EXPORT_JOB_FAILED");
  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.EXPORT_FILES} SET status = 'processing', error_message = NULL, updated_at = ? WHERE id = ?`
    )
    .run(ts, exportId);
  return getExport(exportId, userId);
}

export function failExportJob(exportId: string, userId: string, errorMessage: string): ExportFile {
  const job = getOwnedExport(exportId, userId);
  if (job.status === "completed") throw new Error("EXPORT_JOB_ALREADY_COMPLETED");
  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.EXPORT_FILES} SET status = 'failed', error_message = ?, updated_at = ? WHERE id = ?`
    )
    .run(errorMessage, ts, exportId);
  return getExport(exportId, userId);
}

/** Save rendered file and mark job completed (client-side render or future worker). */
export async function completeExportJob(params: {
  userId: string;
  exportId: string;
  buffer: Buffer;
  mimeType: string;
}): Promise<ExportFile> {
  billingLimits.assertCanExport(params.userId);
  const current = getOwnedExport(params.exportId, params.userId);

  if (current.status === "completed") throw new Error("EXPORT_JOB_ALREADY_COMPLETED");
  if (current.status === "failed") throw new Error("EXPORT_JOB_FAILED");

  assertMimeMatchesFormat(current.format, params.mimeType);

  const storageKey = userDesignExportKey(
    params.userId,
    current.designDraftId,
    `export-${params.exportId}.${current.format}`
  );

  const processingTs = nowIso();
  getDb()
    .prepare(`UPDATE ${Tables.EXPORT_FILES} SET status = 'processing', updated_at = ? WHERE id = ?`)
    .run(processingTs, params.exportId);

  try {
    const stored = await getStorage().save({
      userId: params.userId,
      fileName: `export.${current.format}`,
      mimeType: params.mimeType,
      buffer: params.buffer,
      storageKey,
    });
    const ts = nowIso();
    getDb()
      .prepare(
        `UPDATE ${Tables.EXPORT_FILES} SET status = 'completed', file_url = ?, storage_key = ?, error_message = NULL, updated_at = ? WHERE id = ?`
      )
      .run(stored.fileUrl, stored.storageKey, ts, params.exportId);
    billingLimits.syncUsageCounts(params.userId);
    activity.logExportCompleted(params.userId, params.exportId, { format: current.format });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Export storage failed";
    failExportJob(params.exportId, params.userId, msg);
    throw new Error("EXPORT_STORAGE_FAILED");
  }

  return getExport(params.exportId, params.userId);
}

/** One-step: create job + upload file (editor client render flow). */
export async function createExportWithFile(params: {
  userId: string;
  designDraftId: string;
  format: string;
  buffer: Buffer;
  mimeType?: string;
}): Promise<ExportFile> {
  const format = normalizeExportFormat(params.format);
  const mime = params.mimeType ?? defaultMimeForFormat(format);
  const job = createExportJob(params.userId, params.designDraftId, format);
  return completeExportJob({
    userId: params.userId,
    exportId: job.id,
    buffer: params.buffer,
    mimeType: mime,
  });
}

export async function deleteExport(exportId: string, userId: string): Promise<void> {
  const asset = getOwnedExport(exportId, userId);
  if (asset.storageKey) {
    try {
      await getStorage().delete(asset.storageKey);
    } catch (err) {
      console.warn("[export] storage delete failed:", (err as Error).message);
    }
  }
  getDb().prepare(`DELETE FROM ${Tables.EXPORT_FILES} WHERE id = ?`).run(exportId);
}
