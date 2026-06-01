import { z } from "zod";

export const uzumCreatePaymentSchema = z.object({
  orderId: z.string().min(1),
  returnUrl: z.string().url().optional(),
});
