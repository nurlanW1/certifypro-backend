import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import { paymePaymentAdapter } from "../../payments/providers/payme/payme-payment.adapter";
import * as paymeService from "../../services/payments/payme.service";
import { validateBody } from "../../validation";
import { paymeCreatePaymentSchema } from "../../validation/schemas/payme-payment.schema";
import { createModuleRouter } from "../foundation/create-router";

export const paymePaymentsRouter = createModuleRouter();

paymePaymentsRouter.post(
  "/create",
  requireAuth,
  validateBody(paymeCreatePaymentSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const body = req.body as { orderId: string; returnUrl?: string };
    const result = await paymeService.createPaymePayment(req.userId!, body.orderId, {
      returnUrl: body.returnUrl,
    });
    sendSuccess(res, result, 201);
  })
);

/** Payme Merchant API JSON-RPC (server-to-server) */
paymePaymentsRouter.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    const response = paymeService.processPaymeWebhook(
      req.body,
      req.headers as Record<string, string | string[] | undefined>
    );
    res.json(response);
  })
);

paymePaymentsRouter.get(
  "/return",
  asyncHandler(async (req, res) => {
    const info = paymeService.handlePaymeReturn(req.query as Record<string, unknown>);
    const target = new URL(paymePaymentAdapter.getFrontendReturnUrl());
    if (info.orderId) target.searchParams.set("order_id", info.orderId);
    target.searchParams.set("success", info.success ? "1" : "0");
    res.redirect(302, target.toString());
  })
);
