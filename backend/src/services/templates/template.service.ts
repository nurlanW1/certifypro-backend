import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapTemplate, mapTemplateSummary } from "../../db/mappers";
import type { Template, TemplateCatalogItem } from "../../db/models";
import { canAccessPremiumTemplate } from "../billing/billing-limits.service";
import { getStorage } from "../../storage";
import { templatePreviewKey } from "../../storage/paths";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";

const SUMMARY_COLUMNS = `
  id, product_type, name, description, category, size, orientation,
  preview_url, is_premium, is_active, tags_json, created_by, created_at, updated_at
`;

export function listPublicTemplates(
  filters?: { productType?: string; category?: string },
  userId?: string
): TemplateCatalogItem[] {
  const conditions = ["is_active = 1"];
  const params: unknown[] = [];

  if (filters?.productType) {
    conditions.push("product_type = ?");
    params.push(filters.productType);
  }
  if (filters?.category) {
    conditions.push("category = ?");
    params.push(filters.category);
  }

  const canPremium = userId ? canAccessPremiumTemplate(userId) : false;

  const sql = `SELECT ${SUMMARY_COLUMNS} FROM ${Tables.TEMPLATES}
    WHERE ${conditions.join(" AND ")} ORDER BY name ASC`;
  const rows = getDb().prepare(sql).all(...params);
  return rows.map((r) => {
    const summary = mapTemplateSummary(r as Record<string, unknown>);
    const locked = summary.isPremium && !canPremium;
    return { ...summary, locked, canUse: !locked };
  });
}

export function getPublicTemplate(id: string, userId?: string): Template {
  const row = getDb().prepare(`SELECT * FROM ${Tables.TEMPLATES} WHERE id = ?`).get(id);
  if (!row) throw new Error("NOT_FOUND");
  const template = mapTemplate(row as Record<string, unknown>);
  if (!template.isActive) throw new Error("NOT_FOUND");
  if (template.isPremium) {
    if (!userId) throw new Error("PLAN_PREMIUM_REQUIRED");
    if (!canAccessPremiumTemplate(userId)) throw new Error("PLAN_PREMIUM_REQUIRED");
  }
  return template;
}

export function getTemplateAdmin(id: string): Template {
  const row = getDb().prepare(`SELECT * FROM ${Tables.TEMPLATES} WHERE id = ?`).get(id);
  if (!row) throw new Error("NOT_FOUND");
  return mapTemplate(row as Record<string, unknown>);
}

export function listTemplatesAdmin(filters?: {
  productType?: string;
  activeOnly?: boolean;
}): Template[] {
  const conditions: string[] = ["1=1"];
  const params: unknown[] = [];
  if (filters?.activeOnly) {
    conditions.push("is_active = 1");
  }
  if (filters?.productType) {
    conditions.push("product_type = ?");
    params.push(filters.productType);
  }
  const sql = `SELECT * FROM ${Tables.TEMPLATES} WHERE ${conditions.join(" AND ")} ORDER BY updated_at DESC`;
  const rows = getDb().prepare(sql).all(...params);
  return rows.map((r) => mapTemplate(r as Record<string, unknown>));
}

export function createTemplate(
  data: {
    productType: string;
    name: string;
    description?: string;
    category?: string;
    size?: string;
    orientation?: string;
    defaultCanvasData?: unknown;
    previewUrl?: string;
    isPremium?: boolean;
    isActive?: boolean;
    tags?: string[];
  },
  createdBy?: string
): Template {
  const id = newId("tpl");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO ${Tables.TEMPLATES} (
        id, product_type, name, description, category, size, orientation,
        default_canvas_data_json, preview_url, is_premium, is_active, tags_json, created_by,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      data.productType,
      data.name,
      data.description ?? null,
      data.category ?? null,
      data.size ?? null,
      data.orientation ?? null,
      stringifyJson(data.defaultCanvasData ?? { elements: [] }),
      data.previewUrl ?? null,
      data.isPremium ? 1 : 0,
      data.isActive === false ? 0 : 1,
      stringifyJson(data.tags ?? []),
      createdBy ?? null,
      ts,
      ts
    );
  return getTemplateAdmin(id);
}

export function updateTemplate(
  id: string,
  patch: Partial<{
    productType: string;
    name: string;
    description: string | null;
    category: string | null;
    size: string | null;
    orientation: string | null;
    defaultCanvasData: unknown;
    previewUrl: string | null;
    isPremium: boolean;
    isActive: boolean;
    tags: string[];
  }>
): Template {
  const current = getTemplateAdmin(id);
  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.TEMPLATES} SET
        product_type = ?, name = ?, description = ?, category = ?, size = ?, orientation = ?,
        default_canvas_data_json = ?, preview_url = ?, is_premium = ?, is_active = ?,
        tags_json = ?, updated_at = ?
      WHERE id = ?`
    )
    .run(
      patch.productType ?? current.productType,
      patch.name ?? current.name,
      patch.description !== undefined ? patch.description : current.description,
      patch.category !== undefined ? patch.category : current.category,
      patch.size !== undefined ? patch.size : current.size,
      patch.orientation !== undefined ? patch.orientation : current.orientation,
      patch.defaultCanvasData !== undefined
        ? stringifyJson(patch.defaultCanvasData)
        : stringifyJson(current.defaultCanvasData),
      patch.previewUrl !== undefined ? patch.previewUrl : current.previewUrl,
      patch.isPremium !== undefined ? (patch.isPremium ? 1 : 0) : current.isPremium ? 1 : 0,
      patch.isActive !== undefined ? (patch.isActive ? 1 : 0) : current.isActive ? 1 : 0,
      patch.tags !== undefined ? stringifyJson(patch.tags) : stringifyJson(current.tags),
      ts,
      id
    );
  return getTemplateAdmin(id);
}

export function disableTemplate(id: string): Template {
  return updateTemplate(id, { isActive: false });
}

export function deleteTemplate(id: string): void {
  const template = getTemplateAdmin(id);
  if (template.previewUrl && template.previewUrl.includes("/api/files/")) {
    const keyMatch = template.previewUrl.split("/api/files/")[1];
    if (keyMatch) {
      const storageKey = decodeURIComponent(keyMatch);
      getStorage()
        .delete(storageKey)
        .catch((err) => console.warn("[template] preview delete:", (err as Error).message));
    }
  }
  const result = getDb().prepare(`DELETE FROM ${Tables.TEMPLATES} WHERE id = ?`).run(id);
  if (result.changes === 0) throw new Error("NOT_FOUND");
}

export async function uploadTemplatePreview(
  id: string,
  params: { fileName: string; mimeType: string; buffer: Buffer }
): Promise<Template> {
  const template = getTemplateAdmin(id);
  if (!params.mimeType.startsWith("image/")) {
    throw new Error("Invalid file type for template preview. Use an image file.");
  }

  const storageKey = templatePreviewKey(
    template.productType,
    `${id}-preview-${params.fileName}`
  );

  const stored = await getStorage().save({
    userId: "system",
    fileName: params.fileName,
    mimeType: params.mimeType,
    buffer: params.buffer,
    storageKey,
  });

  return updateTemplate(id, { previewUrl: stored.fileUrl });
}
