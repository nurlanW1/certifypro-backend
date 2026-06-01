import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import { paynetPaymentAdapter } from "../../payments/providers/paynet/paynet-payment.adapter";
import * as paynetService from "../../services/payments/paynet.service";
import { validateBody } from "../../validation";
import { paynetCreatePaymentSchema } from "../../validation/schemas/paynet-payment.schema";
import { createModuleRouter } from "../foundation/create-router";

export const paynetPaymentsRouter = createModuleRouter();

paynetPaymentsRouter.post(
  "/create",
  requireAuth,
  validateBody(paynetCreatePaymentSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const body = req.body as { orderId: string; returnUrl?: string };
    const result = await paynetService.createPaynetPayment(req.userId!, body.orderId, {
      returnUrl: body.returnUrl,
    });
    sendSuccess(res, result, 201);
  })
);

/** Paynet merchant webhook — placeholder until official protocol is integrated. */
paynetPaymentsRouter.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    const result = paynetService.processPaynetWebhook(
      req.body,
      req.headers as Record<string, string | string[] | undefined>
    );
    res.status(result.status).json(result.body);
  })
);

paynetPaymentsRouter.get(
  "/return",
  asyncHandler(async (req, res) => {
    const info = paynetService.handlePaynetReturn(req.query as Record<string, unknown>);
    const target = new URL(paynetPaymentAdapter.getFrontendReturnUrl());
    if (info.orderId) target.searchParams.set("order_id", info.orderId);
    target.searchParams.set("success", info.success ? "1" : "0");
    res.redirect(302, target.toString());
  })
);
