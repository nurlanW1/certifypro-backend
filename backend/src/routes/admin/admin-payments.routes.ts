import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendList, sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import * as adminPayments from "../../services/admin/admin-payments.service";
import { validateBody, validateParams, validateQuery } from "../../validation";
import {
  adminForcePaidSchema,
  adminOrdersQuerySchema,
  adminTransactionsQuerySchema,
  adminWebhooksQuerySchema,
  markWebhookReviewedSchema,
} from "../../validation/schemas/admin-payments.schema";
import { z } from "zod";
import { createModuleRouter } from "../foundation/create-router";

export const adminPaymentsRouter = createModuleRouter();

const idParamSchema = z.object({ id: z.string().min(1) });

adminPaymentsRouter.get(
  "/orders",
  validateQuery(adminOrdersQuerySchema),
  asyncHandler(async (req, res) => {
    const result = adminPayments.listAdminOrders(req.query as Record<string, string>);
    sendList(res, result.items, result.meta);
  })
);

adminPaymentsRouter.get(
  "/orders/:id",
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    sendSuccess(res, adminPayments.getAdminOrder(req.params.id));
  })
);

adminPaymentsRouter.post(
  "/orders/:id/force-paid",
  validateParams(idParamSchema),
  validateBody(adminForcePaidSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const order = adminPayments.adminForceOrderPaid(
      req.userId!,
      req.params.id,
      req.body as { confirm: true; reason: string; confirmRepeat?: boolean }
    );
    sendSuccess(res, { order, message: "Order marked PAID with admin override (audit logged)" });
  })
);

adminPaymentsRouter.get(
  "/transactions",
  validateQuery(adminTransactionsQuerySchema),
  asyncHandler(async (req, res) => {
    const result = adminPayments.listAdminTransactions(req.query as Record<string, string>);
    sendList(res, result.items, result.meta);
  })
);

adminPaymentsRouter.get(
  "/webhooks",
  validateQuery(adminWebhooksQuerySchema),
  asyncHandler(async (req, res) => {
    const result = adminPayments.listAdminWebhookLogs(req.query as Record<string, string>);
    sendList(res, result.items, result.meta);
  })
);

adminPaymentsRouter.get(
  "/webhooks/:id",
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    sendSuccess(res, adminPayments.getAdminWebhookLog(req.params.id));
  })
);

adminPaymentsRouter.patch(
  "/webhooks/:id/reviewed",
  validateParams(idParamSchema),
  validateBody(markWebhookReviewedSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const log = adminPayments.markWebhookReviewed(
      req.userId!,
      req.params.id,
      (req.body as { note?: string }).note
    );
    sendSuccess(res, log);
  })
);

adminPaymentsRouter.get(
  "/audit",
  asyncHandler(async (_req, res) => {
    sendList(res, adminPayments.listAdminPaymentAudit(100));
  })
);
