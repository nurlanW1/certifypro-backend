import { getDb } from "../db/client";
import { mapBrandKit } from "../db/mappers";
import type { BrandKit } from "../types/entities";
import { newId, nowIso } from "../utils/id";
import { stringifyJson } from "../utils/json";

function getOwned(id: string, userId: string): BrandKit {
  const row = getDb().prepare("SELECT * FROM brand_kits WHERE id = ?").get(id);
  if (!row) throw new Error("NOT_FOUND");
  const kit = mapBrandKit(row as Record<string, unknown>);
  if (kit.userId !== userId) throw new Error("FORBIDDEN");
  return kit;
}

export function listBrandKits(userId: string): BrandKit[] {
  const rows = getDb()
    .prepare("SELECT * FROM brand_kits WHERE user_id = ? ORDER BY updated_at DESC")
    .all(userId);
  return rows.map((r) => mapBrandKit(r as Record<string, unknown>));
}

export function createBrandKit(
  userId: string,
  data: {
    eventId?: string;
    logos?: unknown[];
    colors?: unknown[];
    fonts?: unknown[];
    signatures?: unknown[];
    stamps?: unknown[];
  }
): BrandKit {
  const id = newId("bk");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO brand_kits (
        id, user_id, event_id, logos_json, colors_json, fonts_json,
        signatures_json, stamps_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      userId,
      data.eventId ?? null,
      stringifyJson(data.logos ?? []),
      stringifyJson(data.colors ?? []),
      stringifyJson(data.fonts ?? []),
      stringifyJson(data.signatures ?? []),
      stringifyJson(data.stamps ?? []),
      ts,
      ts
    );
  return mapBrandKit(
    getDb().prepare("SELECT * FROM brand_kits WHERE id = ?").get(id) as Record<string, unknown>
  );
}

export function updateBrandKit(
  id: string,
  userId: string,
  patch: Partial<{
    eventId: string | null;
    logos: unknown[];
    colors: unknown[];
    fonts: unknown[];
    signatures: unknown[];
    stamps: unknown[];
  }>
): BrandKit {
  const current = getOwned(id, userId);
  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE brand_kits SET
        event_id = ?, logos_json = ?, colors_json = ?, fonts_json = ?,
        signatures_json = ?, stamps_json = ?, updated_at = ?
      WHERE id = ?`
    )
    .run(
      patch.eventId !== undefined ? patch.eventId : current.eventId,
      patch.logos !== undefined ? stringifyJson(patch.logos) : stringifyJson(current.logos),
      patch.colors !== undefined ? stringifyJson(patch.colors) : stringifyJson(current.colors),
      patch.fonts !== undefined ? stringifyJson(patch.fonts) : stringifyJson(current.fonts),
      patch.signatures !== undefined
        ? stringifyJson(patch.signatures)
        : stringifyJson(current.signatures),
      patch.stamps !== undefined ? stringifyJson(patch.stamps) : stringifyJson(current.stamps),
      ts,
      id
    );
  return getOwned(id, userId);
}
