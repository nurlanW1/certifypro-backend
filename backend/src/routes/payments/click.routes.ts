import express from "express";
import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import * as clickService from "../../services/payments/click.service";
import { clickPaymentAdapter } from "../../payments/providers/click/click-payment.adapter";
import { validateBody } from "../../validation";
import { clickCreatePaymentSchema } from "../../validation/schemas/click-payment.schema";
import { createModuleRouter } from "../foundation/create-router";

export const clickPaymentsRouter = createModuleRouter();

const clickFormParser = express.urlencoded({ extended: true });

clickPaymentsRouter.post(
  "/create",
  requireAuth,
  validateBody(clickCreatePaymentSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const body = req.body as { orderId: string; returnUrl?: string };
    const result = await clickService.createClickPayment(req.userId!, body.orderId, {
      returnUrl: body.returnUrl,
    });
    sendSuccess(res, result, 201);
  })
);

clickPaymentsRouter.post(
  "/webhook",
  clickFormParser,
  asyncHandler(async (req, res) => {
    const payload = Object.keys(req.body ?? {}).length > 0 ? req.body : req.query;
    const response = clickService.processClickShopWebhook(
      payload,
      req.headers as Record<string, string | string[] | undefined>
    );
    res.json(response);
  })
);

clickPaymentsRouter.get(
  "/return",
  asyncHandler(async (req, res) => {
    const info = clickService.handleClickReturn(req.query as Record<string, unknown>);
    const target = new URL(clickPaymentAdapter.getFrontendReturnUrl());
    if (info.orderId) target.searchParams.set("order_id", info.orderId);
    target.searchParams.set("success", info.success ? "1" : "0");
    if (info.clickTransId) target.searchParams.set("click_trans_id", info.clickTransId);
    res.redirect(302, target.toString());
  })
);
