import { z } from "zod";

export const templateListQuerySchema = z.object({
  productType: z.string().optional(),
  category: z.string().optional(),
});

export const templateCreateSchema = z.object({
  productType: z.string().min(1).max(80),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  category: z.string().max(120).optional(),
  size: z.string().max(40).optional(),
  orientation: z.string().max(40).optional(),
  defaultCanvasData: z.unknown().optional(),
  previewUrl: z.union([z.string().url(), z.null()]).optional(),
  isPremium: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string().max(60)).max(30).optional(),
});

export const templateUpdateSchema = templateCreateSchema.partial();
