import { z } from "zod";

export const designCreateSchema = z.object({
  productType: z.string().min(1),
  title: z.string().min(1).max(200),
  canvasData: z.unknown().optional(),
  thumbnailUrl: z.string().optional(),
  status: z.enum(["draft", "saved", "archived"]).optional(),
  eventId: z.string().optional(),
  eventProductId: z.string().optional(),
});

export const designUpdateSchema = designCreateSchema.partial();
