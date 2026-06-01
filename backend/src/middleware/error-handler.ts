import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../core/http";

const PLAN_MESSAGES: Record<string, string> = {
  PLAN_LIMIT_DESIGNS: "Design limit reached for your plan. Upgrade to create more.",
  PLAN_LIMIT_EXPORTS: "Export limit reached for your plan. Upgrade to export more.",
  PLAN_LIMIT_EVENTS: "Event limit reached for your plan. Upgrade to create more events.",
  PLAN_LIMIT_EVENT_PRODUCTS: "Event product limit reached for your plan. Upgrade for more products.",
  PLAN_PREMIUM_REQUIRED: "Premium templates require a Pro or Event package plan.",
  PLAN_EVENT_BUILDER_REQUIRED: "Event builder requires an Event package plan.",
  PLAN_BRAND_KIT_REQUIRED: "Brand kit requires an Event package plan.",
  PLAN_FULL_PACKAGE_EXPORT_REQUIRED: "Full package export requires an Event package plan.",
  ADMIN_PAYMENT_CONFIRM_REQUIRED:
    "Admin payment override requires confirm: true in the request body.",
  ADMIN_PAYMENT_REASON_REQUIRED:
    "Admin payment override requires a reason of at least 10 characters.",
};

const ADMIN_PAYMENT_ERRORS = new Set([
  "ADMIN_PAYMENT_CONFIRM_REQUIRED",
  "ADMIN_PAYMENT_REASON_REQUIRED",
]);

const PAYMENT_MESSAGES: Record<string, string> = {
  UNSUPPORTED_PROVIDER: "Payment provider is not supported.",
  PLAN_NOT_FOUND: "Billing plan not found.",
  PLAN_REQUIRED: "A plan is required for this order type.",
  PLAN_INACTIVE: "This plan is not available for purchase.",
  INVALID_AMOUNT: "Order amount must be greater than zero.",
  INVALID_ORDER_TYPE: "Invalid order type.",
  ORDER_ALREADY_PAID: "This order has already been paid.",
  ORDER_NOT_PAYABLE: "This order cannot be paid.",
  WEBHOOK_INVALID_SIGNATURE: "Invalid payment webhook signature.",
  WEBHOOK_MISSING_ORDER_ID: "Payment webhook missing order identifier.",
  TRANSACTION_NOT_FOUND: "Payment transaction not found.",
  ORDER_NOT_FOUND: "Order not found.",
  PAYMENT_AMOUNT_MISMATCH: "Payment amount does not match the order.",
  CLICK_NOT_CONFIGURED: "Click payment is not configured on the server.",
  PAYME_NOT_CONFIGURED: "Payme payment is not configured on the server.",
  UZUM_NOT_CONFIGURED: "Uzum payment is not configured on the server.",
  PAYNET_NOT_CONFIGURED: "Paynet payment is not configured on the server.",
  PAYNET_NOT_READY: "Paynet payment protocol is not implemented yet.",
  PAYNET_WEBHOOK_NOT_IMPLEMENTED: "Paynet webhook handler is not implemented yet.",
};

const EXPORT_MESSAGES: Record<string, string> = {
  EXPORT_INVALID_FORMAT: "Invalid export format. Allowed: png, jpg, pdf, svg.",
  EXPORT_MIME_MISMATCH: "Uploaded file type does not match the export format.",
  EXPORT_JOB_NOT_PENDING: "Export job is not in a pending state.",
  EXPORT_JOB_ALREADY_COMPLETED: "Export job is already completed.",
  EXPORT_JOB_FAILED: "Export job has failed and cannot be completed.",
  EXPORT_STORAGE_FAILED: "Failed to store the exported file. Try again later.",
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    return sendError(res, 400, "VALIDATION_ERROR", message);
  }
  if (err instanceof Error) {
    if (err.message === "NOT_FOUND") {
      return sendError(res, 404, "NOT_FOUND", "Resource not found");
    }
    if (err.message === "FORBIDDEN") {
      return sendError(res, 403, "FORBIDDEN", "Access denied");
    }
    if (ADMIN_PAYMENT_ERRORS.has(err.message)) {
      return sendError(res, 400, err.message, PLAN_MESSAGES[err.message]);
    }
    if (PLAN_MESSAGES[err.message]) {
      const status =
        err.message === "PLAN_PREMIUM_REQUIRED" ||
        err.message === "PLAN_EVENT_BUILDER_REQUIRED" ||
        err.message === "PLAN_BRAND_KIT_REQUIRED" ||
        err.message === "PLAN_FULL_PACKAGE_EXPORT_REQUIRED"
          ? 403
          : 402;
      return sendError(res, status, err.message, PLAN_MESSAGES[err.message]);
    }
    if (PAYMENT_MESSAGES[err.message]) {
      let status = 400;
      if (err.message === "WEBHOOK_INVALID_SIGNATURE") status = 401;
      if (
        err.message === "PAYNET_NOT_READY" ||
        err.message === "PAYNET_WEBHOOK_NOT_IMPLEMENTED"
      ) {
        status = 501;
      }
      return sendError(res, status, err.message, PAYMENT_MESSAGES[err.message]);
    }
    if (EXPORT_MESSAGES[err.message]) {
      const status = err.message === "EXPORT_STORAGE_FAILED" ? 500 : 400;
      return sendError(res, status, err.message, EXPORT_MESSAGES[err.message]);
    }
    if (err.message.startsWith("Invalid asset type")) {
      return sendError(res, 400, "INVALID_ASSET_TYPE", err.message);
    }
    if (err.message.startsWith("Invalid file type for")) {
      return sendError(res, 400, "INVALID_FILE", err.message);
    }
    if (err.message.startsWith("Invalid file type for template preview")) {
      return sendError(res, 400, "INVALID_FILE", err.message);
    }
    if (err.message === "NOT_IMPLEMENTED") {
      return sendError(res, 501, "NOT_IMPLEMENTED", "Feature not implemented yet");
    }
    console.error("[api]", err);
    return sendError(res, 500, "INTERNAL_ERROR", "Internal server error");
  }
  return sendError(res, 500, "INTERNAL_ERROR", "Internal server error");
}
