import type {
  BillingPlan,
  BrandKit,
  DesignDraft,
  Event,
  EventProduct,
  ExportFile,
  Template,
  TemplateSummary,
  UploadedAsset,
  User,
  UserPublic,
} from "./models";
import { parseJson } from "../utils/json";
import { mapPlan } from "./mappers/payment.mappers";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  plan: string;
  created_at: string;
  updated_at: string;
};

export function mapUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role as User["role"],
    plan: row.plan,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapUserPublic(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function mapEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    type: row.type as string,
    organizationName: (row.organization_name as string) ?? null,
    date: (row.date as string) ?? null,
    location: (row.location as string) ?? null,
    description: (row.description as string) ?? null,
    language: (row.language as string) ?? null,
    participantEstimate:
      row.participant_estimate != null ? Number(row.participant_estimate) : null,
    status: row.status as Event["status"],
    builderState: parseJson<Record<string, unknown>>(
      (row.builder_state_json as string) ?? "{}",
      {}
    ),
    deletedAt: (row.deleted_at as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapEventProduct(row: Record<string, unknown>): EventProduct {
  return {
    id: row.id as string,
    eventId: row.event_id as string,
    productType: row.product_type as string,
    enabled: Boolean(row.enabled),
    status: row.status as string,
    formData: parseJson<Record<string, unknown>>(row.form_data_json as string, {}),
    templateId: (row.template_id as string) ?? null,
    designDraftId: (row.design_draft_id as string) ?? null,
    previewThumbnailUrl: (row.preview_thumbnail_url as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapDesignDraft(row: Record<string, unknown>): DesignDraft {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    eventId: (row.event_id as string) ?? null,
    eventProductId: (row.event_product_id as string) ?? null,
    productType: row.product_type as string,
    title: row.title as string,
    canvasData: parseJson(row.canvas_data_json as string, { elements: [] }),
    thumbnailUrl: (row.thumbnail_url as string) ?? null,
    status: row.status as DesignDraft["status"],
    version: Number(row.version ?? 1),
    deletedAt: (row.deleted_at as string) ?? null,
    lastEditedAt: (row.last_edited_at as string) ?? (row.updated_at as string),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapTemplate(row: Record<string, unknown>): Template {
  return {
    id: row.id as string,
    productType: row.product_type as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    category: (row.category as string) ?? null,
    size: (row.size as string) ?? null,
    orientation: (row.orientation as string) ?? null,
    defaultCanvasData: parseJson(row.default_canvas_data_json as string, {}),
    previewUrl: (row.preview_url as string) ?? null,
    isPremium: Boolean(row.is_premium),
    isActive: Boolean(row.is_active),
    tags: parseJson<string[]>(row.tags_json as string, []),
    createdBy: (row.created_by as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapTemplateSummary(row: Record<string, unknown>): TemplateSummary {
  return {
    id: row.id as string,
    productType: row.product_type as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    category: (row.category as string) ?? null,
    size: (row.size as string) ?? null,
    orientation: (row.orientation as string) ?? null,
    previewUrl: (row.preview_url as string) ?? null,
    isPremium: Boolean(row.is_premium),
    tags: parseJson<string[]>(row.tags_json as string, []),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapUploadedAsset(row: Record<string, unknown>): UploadedAsset {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    eventId: (row.event_id as string) ?? null,
    designDraftId: (row.design_draft_id as string) ?? null,
    brandKitId: (row.brand_kit_id as string) ?? null,
    type: row.type as UploadedAsset["type"],
    fileName: row.file_name as string,
    fileUrl: row.file_url as string,
    mimeType: (row.mime_type as string) ?? null,
    size: Number(row.size),
    storageKey: (row.storage_key as string) ?? null,
    createdAt: row.created_at as string,
  };
}

export function mapBrandKit(row: Record<string, unknown>): BrandKit {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    eventId: (row.event_id as string) ?? null,
    logos: parseJson(row.logos_json as string, []),
    colors: parseJson(row.colors_json as string, []),
    fonts: parseJson(row.fonts_json as string, []),
    signatures: parseJson(row.signatures_json as string, []),
    stamps: parseJson(row.stamps_json as string, []),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapExportFile(row: Record<string, unknown>): ExportFile {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    designDraftId: row.design_draft_id as string,
    format: row.format as ExportFile["format"],
    status: (row.status as ExportFile["status"]) || "completed",
    fileUrl: row.file_url as string,
    storageKey: (row.storage_key as string) ?? null,
    errorMessage: (row.error_message as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string) ?? (row.created_at as string),
  };
}

export function mapBillingPlan(row: Record<string, unknown>): BillingPlan {
  const plan = mapPlan(row);
  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    priceMonthly: plan.price,
    currency: plan.currency,
    features: plan.features,
    limits: plan.limits,
    isActive: plan.isActive,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

