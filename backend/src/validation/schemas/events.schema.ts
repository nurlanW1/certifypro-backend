import { z } from "zod";

export const eventCreateSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().optional(),
  organizationName: z.string().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  language: z.string().optional(),
  participantEstimate: z.number().int().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
});

export const eventUpdateSchema = eventCreateSchema
  .partial()
  .extend({ builderState: z.record(z.unknown()).optional() });

export const eventBuilderStateSchema = z.object({
  builderState: z.record(z.unknown()),
});

export const eventProductCreateSchema = z.object({
  productType: z.string().min(1),
  enabled: z.boolean().optional(),
  status: z.string().optional(),
  formData: z.record(z.unknown()).optional(),
  templateId: z.string().optional(),
  designDraftId: z.string().optional(),
  previewThumbnailUrl: z.string().optional(),
});

export const eventProductUpdateSchema = eventProductCreateSchema.partial();

export const eventProductFormDataSchema = z.object({
  formData: z.record(z.unknown()),
});

export const eventProductsQuerySchema = z.object({
  eventId: z.string().min(1),
});
