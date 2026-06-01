import { z } from "zod";

export const uploadCreateFieldsSchema = z.object({
  type: z.string().min(1),
  eventId: z.string().optional(),
  designDraftId: z.string().optional(),
  brandKitId: z.string().optional(),
});

export const uploadListQuerySchema = z.object({
  eventId: z.string().optional(),
  designDraftId: z.string().optional(),
  brandKitId: z.string().optional(),
  type: z.string().optional(),
});
