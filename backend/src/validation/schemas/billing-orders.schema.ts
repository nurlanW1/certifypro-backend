import { z } from "zod";

const orderTypeEnum = z.enum(["PLAN", "EVENT_PACKAGE", "EXPORT", "TEMPLATE_PURCHASE"]);

export const createOrderSchema = z.object({
  type: orderTypeEnum,
  planId: z.string().optional(),
  planSlug: z.string().optional(),
  eventId: z.string().optional(),
  designDraftId: z.string().optional(),
  description: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const orderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED", "EXPIRED"]).optional(),
});

export const initiatePaymentSchema = z.object({
  orderId: z.string().min(1),
  returnUrl: z.string().url().optional(),
});
