import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { PaymentProvider } from "../../db/models/payment-transaction.model";
import { clickPaymentAdapter } from "../../payments/providers/click/click-payment.adapter";
import {
  parseClickShopBody,
  toClickShopRequest,
  type ClickShopResponse,
} from "../../payments/providers/click/click.types";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";
import * as paymentService from "./payment.service";
import { assertOrderOwner } from "./ownership";

function logClickWebhook(
  status: "processed" | "failed",
  payload: unknown,
  headers: Record<string, string | string[] | undefined>,
  errorMessage: string | null,
  transactionId: string | null
): string {
  const logId = newId("whl");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO ${Tables.PAYMENT_WEBHOOK_LOGS} (
        id, provider, transaction_id, raw_payload_json, headers_json, status, error_message, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      logId,
      PaymentProvider.CLICK,
      transactionId,
      stringifyJson(payload ?? {}),
      stringifyJson(headers),
      status,
      errorMessage,
      ts
    );
  return logId;
}

export async function createClickPayment(
  userId: string,
  orderId: string,
  options?: { returnUrl?: string }
) {
  return paymentService.initiatePayment(userId, orderId, "click", options);
}

export function processClickShopWebhook(
  payload: unknown,
  headers: Record<string, string | string[] | undefined>
): ClickShopResponse {
  const body = parseClickShopBody(payload);
  const req = toClickShopRequest(body);
  let logId: string | null = null;

  try {
    const response = clickPaymentAdapter.processShopWebhook(payload);

    if (clickPaymentAdapter.shouldApplyPaymentOnComplete(payload)) {
      const normalized = paymentService.normalizeClickComplete(body);
      paymentService.applyNormalizedPayment(normalized);
    }

    logId = logClickWebhook("processed", payload, headers, null, req.merchantTransId || null);
    void logId;
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook failed";
    logClickWebhook("failed", payload, headers, message, req.merchantTransId || null);
    throw err;
  }
}

export function handleClickReturn(query: Record<string, unknown>) {
  const orderId = String(
    query.merchant_trans_id ?? query.transaction_param ?? query.order_id ?? ""
  );
  const clickError = Number(query.error ?? 0);
  const clickTransId = query.click_trans_id;

  return {
    orderId,
    success: clickError === 0,
    clickTransId: clickTransId !== undefined ? String(clickTransId) : null,
    redirectUrl: clickPaymentAdapter.getFrontendReturnUrl(),
    query,
  };
}

export function getClickPaymentStatus(userId: string, orderId: string) {
  assertOrderOwner(orderId, userId);
  return paymentService.getOrderPaymentStatus(userId, orderId);
}
