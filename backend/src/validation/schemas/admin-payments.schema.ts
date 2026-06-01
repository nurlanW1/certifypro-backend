import { z } from "zod";

const providerEnum = z.enum(["CLICK", "PAYME", "UZUM", "PAYNET"]);

export const adminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED", "EXPIRED"]).optional(),
  provider: providerEnum.optional(),
  q: z.string().max(200).optional(),
});

export const adminTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  status: z
    .enum(["CREATED", "PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"])
    .optional(),
  provider: providerEnum.optional(),
  orderId: z.string().optional(),
});

export const adminWebhooksQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  status: z.string().max(64).optional(),
  provider: providerEnum.optional(),
  reviewed: z.enum(["true", "false"]).optional(),
});

export const markWebhookReviewedSchema = z.object({
  note: z.string().max(500).optional(),
});

export const adminForcePaidSchema = z.object({
  confirm: z.literal(true, {
    errorMap: () => ({ message: "confirm must be true to override payment" }),
  }),
  reason: z.string().min(10).max(2000),
  confirmRepeat: z.boolean().optional(),
});
