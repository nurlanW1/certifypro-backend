import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import { uzumPaymentAdapter } from "../../payments/providers/uzum/uzum-payment.adapter";
import * as uzumService from "../../services/payments/uzum.service";
import { validateBody } from "../../validation";
import { uzumCreatePaymentSchema } from "../../validation/schemas/uzum-payment.schema";
import { createModuleRouter } from "../foundation/create-router";

export const uzumPaymentsRouter = createModuleRouter();

uzumPaymentsRouter.post(
  "/create",
  requireAuth,
  validateBody(uzumCreatePaymentSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const body = req.body as { orderId: string; returnUrl?: string };
    const result = await uzumService.createUzumPayment(req.userId!, body.orderId, {
      returnUrl: body.returnUrl,
    });
    sendSuccess(res, result, 201);
  })
);

/** Uzum Merchant API — one endpoint per method (configure in Uzum Business). */
const uzumWebhookHandler = asyncHandler(async (req, res) => {
  const method = String(req.params.method ?? "").toLowerCase();
  const result = uzumService.processUzumWebhook(
    method,
    req.body,
    req.headers as Record<string, string | string[] | undefined>
  );
  res.status(result.status).json(result.body);
});

uzumPaymentsRouter.post("/webhook/:method", uzumWebhookHandler);

uzumPaymentsRouter.get(
  "/return",
  asyncHandler(async (req, res) => {
    const info = uzumService.handleUzumReturn(req.query as Record<string, unknown>);
    const target = new URL(uzumPaymentAdapter.getFrontendReturnUrl());
    if (info.orderId) target.searchParams.set("order_id", info.orderId);
    target.searchParams.set("success", info.success ? "1" : "0");
    res.redirect(302, target.toString());
  })
);
