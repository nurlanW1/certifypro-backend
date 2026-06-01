import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapUploadedAsset } from "../../db/mappers";
import type { AssetType, UploadedAsset } from "../../db/models";
import { getStorage } from "../../storage";
import {
  userBrandKitAssetKey,
  userDesignAssetKey,
  userEventAssetKey,
  userGeneralUploadKey,
} from "../../storage/paths";
import { newId, nowIso } from "../../utils/id";
import { assertMimeForAssetType, normalizeAssetType } from "./asset-types";
import * as activity from "../activity/activity.service";
import * as billingLimits from "../billing/billing-limits.service";

function assertEventOwned(eventId: string, userId: string): void {
  const row = getDb()
    .prepare(`SELECT user_id, deleted_at FROM ${Tables.EVENTS} WHERE id = ?`)
    .get(eventId) as { user_id: string; deleted_at: string | null } | undefined;
  if (!row || row.deleted_at) throw new Error("NOT_FOUND");
  if (row.user_id !== userId) throw new Error("FORBIDDEN");
}

function assertDesignOwned(designDraftId: string, userId: string): void {
  const row = getDb()
    .prepare(`SELECT user_id, deleted_at FROM ${Tables.DESIGN_DRAFTS} WHERE id = ?`)
    .get(designDraftId) as { user_id: string; deleted_at: string | null } | undefined;
  if (!row || row.deleted_at) throw new Error("NOT_FOUND");
  if (row.user_id !== userId) throw new Error("FORBIDDEN");
}

function assertBrandKitOwned(brandKitId: string, userId: string): void {
  const row = getDb()
    .prepare(`SELECT user_id FROM ${Tables.BRAND_KITS} WHERE id = ?`)
    .get(brandKitId) as { user_id: string } | undefined;
  if (!row) throw new Error("NOT_FOUND");
  if (row.user_id !== userId) throw new Error("FORBIDDEN");
}

function resolveStorageKey(params: {
  userId: string;
  fileName: string;
  assetId: string;
  eventId?: string;
  designDraftId?: string;
  brandKitId?: string;
}): string {
  const filePart = `${params.assetId}-${params.fileName}`;
  if (params.eventId) {
    return userEventAssetKey(params.userId, params.eventId, filePart);
  }
  if (params.designDraftId) {
    return userDesignAssetKey(params.userId, params.designDraftId, filePart);
  }
  if (params.brandKitId) {
    return userBrandKitAssetKey(params.userId, params.brandKitId, filePart);
  }
  return userGeneralUploadKey(params.userId, filePart);
}

function validateLinks(
  userId: string,
  links: { eventId?: string; designDraftId?: string; brandKitId?: string }
): void {
  if (links.eventId) assertEventOwned(links.eventId, userId);
  if (links.designDraftId) assertDesignOwned(links.designDraftId, userId);
  if (links.brandKitId) {
    billingLimits.assertCanUseBrandKit(userId);
    assertBrandKitOwned(links.brandKitId, userId);
  }
}

export async function createUpload(params: {
  userId: string;
  type: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  eventId?: string;
  designDraftId?: string;
  brandKitId?: string;
}): Promise<UploadedAsset> {
  const type: AssetType = normalizeAssetType(params.type);
  assertMimeForAssetType(type, params.mimeType);
  validateLinks(params.userId, params);

  const assetId = newId("upl");
  const storageKey = resolveStorageKey({
    userId: params.userId,
    fileName: params.fileName,
    assetId,
    eventId: params.eventId,
    designDraftId: params.designDraftId,
    brandKitId: params.brandKitId,
  });

  const stored = await getStorage().save({
    userId: params.userId,
    fileName: params.fileName,
    mimeType: params.mimeType,
    buffer: params.buffer,
    storageKey,
  });

  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO ${Tables.UPLOADED_ASSETS} (
        id, user_id, event_id, design_draft_id, brand_kit_id, type, file_name,
        file_url, mime_type, size, storage_key, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      assetId,
      params.userId,
      params.eventId ?? null,
      params.designDraftId ?? null,
      params.brandKitId ?? null,
      type,
      params.fileName,
      stored.fileUrl,
      params.mimeType,
      stored.size,
      stored.storageKey,
      ts
    );

  const asset = getUpload(assetId, params.userId);
  activity.logAssetUploaded(params.userId, asset.id, {
    type: asset.type,
    eventId: asset.eventId,
    designDraftId: asset.designDraftId,
    brandKitId: asset.brandKitId,
  });
  return asset;
}

export function getUpload(id: string, userId: string): UploadedAsset {
  const row = getDb()
    .prepare(`SELECT * FROM ${Tables.UPLOADED_ASSETS} WHERE id = ?`)
    .get(id);
  if (!row) throw new Error("NOT_FOUND");
  const asset = mapUploadedAsset(row as Record<string, unknown>);
  if (asset.userId !== userId) throw new Error("FORBIDDEN");
  return asset;
}

export function listUploads(
  userId: string,
  query?: {
    eventId?: string;
    designDraftId?: string;
    brandKitId?: string;
    type?: string;
  }
): UploadedAsset[] {
  if (query?.eventId) assertEventOwned(query.eventId, userId);
  if (query?.designDraftId) assertDesignOwned(query.designDraftId, userId);
  if (query?.brandKitId) assertBrandKitOwned(query.brandKitId, userId);

  const conditions = ["user_id = ?"];
  const params: unknown[] = [userId];

  if (query?.eventId) {
    conditions.push("event_id = ?");
    params.push(query.eventId);
  }
  if (query?.designDraftId) {
    conditions.push("design_draft_id = ?");
    params.push(query.designDraftId);
  }
  if (query?.brandKitId) {
    conditions.push("brand_kit_id = ?");
    params.push(query.brandKitId);
  }
  if (query?.type) {
    const normalized = normalizeAssetType(query.type);
    conditions.push("type = ?");
    params.push(normalized);
  }

  const sql = `SELECT * FROM ${Tables.UPLOADED_ASSETS} WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC`;
  const rows = getDb().prepare(sql).all(...params);
  return rows.map((r) => mapUploadedAsset(r as Record<string, unknown>));
}

export async function deleteUpload(id: string, userId: string): Promise<void> {
  const asset = getUpload(id, userId);
  if (asset.storageKey) {
    try {
      await getStorage().delete(asset.storageKey);
    } catch (err) {
      console.warn("[upload] storage delete failed:", (err as Error).message);
    }
  }
  getDb().prepare(`DELETE FROM ${Tables.UPLOADED_ASSETS} WHERE id = ?`).run(id);
}

export { ASSET_TYPES, normalizeAssetType } from "./asset-types";
