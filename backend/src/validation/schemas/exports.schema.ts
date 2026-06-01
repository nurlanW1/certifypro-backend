import { z } from "zod";

export const exportJobCreateSchema = z.object({
  designDraftId: z.string().min(1),
  format: z.enum(["png", "jpg", "pdf", "svg"]),
});

export const exportHistoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  designDraftId: z.string().optional(),
});

export const exportFailBodySchema = z.object({
  errorMessage: z.string().min(1).max(500),
});
