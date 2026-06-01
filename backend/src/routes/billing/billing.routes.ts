import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendList, sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import * as billingLimits from "../../services/billing/billing-limits.service";
import * as billingService from "../../services/billing/billing.service";
import * as orderService from "../../services/payments/order.service";
import * as paymentService from "../../services/payments/payment.service";
import { listPaymentProviders } from "../../payments/gateway-registry";
import { validateBody, validateQuery } from "../../validation";
import {
  createOrderSchema,
  initiatePaymentSchema,
  orderListQuerySchema,
} from "../../validation/schemas/billing-orders.schema";
import { createModuleRouter } from "../foundation/create-router";

export const billingRouter = createModuleRouter();

billingRouter.get(
  "/plans",
  asyncHandler(async (_req, res) => {
    sendList(res, billingService.listBillingPlans());
  })
);

billingRouter.get(
  "/providers",
  asyncHandler(async (_req, res) => {
    sendSuccess(res, { providers: listPaymentProviders() });
  })
);

billingRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, billingLimits.getBillingMe(req.userId!));
  })
);

billingRouter.get(
  "/usage",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, billingLimits.getUsageSummary(req.userId!));
  })
);

billingRouter.get(
  "/capabilities",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const me = billingLimits.getBillingMe(req.userId!);
    sendSuccess(res, {
      plan: me.currentPlan.slug,
      currentPlan: me.currentPlan,
      canCreateDesign: me.canCreateDesign,
      canCreateEvent: me.canCreateEvent,
      canExport: me.canExport,
      exportCheck: billingLimits.checkExportAllowed(req.userId!),
      canAccessPremiumTemplates: me.canUsePremiumTemplate,
      canUsePremiumTemplate: me.canUsePremiumTemplate,
      requiresWatermark: me.watermarkRequired,
      watermarkRequired: me.watermarkRequired,
    });
  })
);

/** POST /api/billing/orders — create checkout order */
billingRouter.post(
  "/orders",
  requireAuth,
  validateBody(createOrderSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const order = orderService.createOrder(req.userId!, req.body);
    sendSuccess(res, order, 201);
  })
);

/** GET /api/billing/orders — list my orders */
billingRouter.get(
  "/orders",
  requireAuth,
  validateQuery(orderListQuerySchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = orderService.listOrders(req.userId!, req.query as Record<string, string>);
    if (result.meta) sendList(res, result.items, result.meta);
    else sendList(res, result.items);
  })
);

/** GET /api/billing/orders/:id */
billingRouter.get(
  "/orders/:id",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, orderService.getOrderById(req.userId!, req.params.id));
  })
);

/** POST /api/billing/pay/:provider — start provider checkout (server-side only) */
billingRouter.post(
  "/pay/:provider",
  requireAuth,
  validateBody(initiatePaymentSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const body = req.body as { orderId: string; returnUrl?: string };
    const result = await paymentService.initiatePayment(
      req.userId!,
      body.orderId,
      req.params.provider,
      { returnUrl: body.returnUrl }
    );
    sendSuccess(res, result, 201);
  })
);

/** GET /api/billing/status/:orderId */
billingRouter.get(
  "/status/:orderId",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const status = await paymentService.checkPaymentStatus(req.userId!, req.params.orderId);
    sendSuccess(res, status);
  })
);

/** GET /api/billing/history */
billingRouter.get(
  "/history",
  requireAuth,
  validateQuery(orderListQuerySchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = paymentService.getPaymentHistory(req.userId!, req.query as Record<string, string>);
    if (result.meta) sendList(res, result.items, result.meta);
    else sendList(res, result.items);
  })
);

/** Provider webhooks (server-to-server, not frontend) */
billingRouter.post(
  "/webhooks/:provider",
  asyncHandler(async (req, res) => {
    const result = await paymentService.handleProviderWebhook(
      req.params.provider,
      req.body,
      req.headers as Record<string, string | string[] | undefined>
    );
    sendSuccess(res, result);
  })
);
