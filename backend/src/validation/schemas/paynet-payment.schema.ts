import { z } from "zod";

export const paynetCreatePaymentSchema = z.object({
  orderId: z.string().min(1),
  returnUrl: z.string().url().optional(),
});
