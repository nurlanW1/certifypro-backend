import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { PaymentProvider } from "../../db/models/payment-transaction.model";
import { PaymentProvider as PaymentProviderEnum } from "../../db/models/payment-transaction.model";
import { paymePaymentAdapter } from "../../payments/providers/payme/payme-payment.adapter";
import { findTransactionByInternalId } from "../../payments/providers/payme/payme.store";
import { parsePaymeRpcRequest, type PaymeRpcResponse } from "../../payments/providers/payme/payme.types";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";
import * as paymentService from "./payment.service";

function logPaymeWebhook(
  status: "processed" | "failed",
  payload: unknown,
  headers: Record<string, string | string[] | undefined>,
  errorMessage: string | null,
  transactionRef: string | null
): void {
  getDb()
    .prepare(
      `INSERT INTO ${Tables.PAYMENT_WEBHOOK_LOGS} (
        id, provider, transaction_id, raw_payload_json, headers_json, status, error_message, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      newId("whl"),
      PaymentProvider.PAYME,
      transactionRef,
      stringifyJson(payload ?? {}),
      stringifyJson(headers),
      status,
      errorMessage,
      nowIso()
    );
}

export async function createPaymePayment(
  userId: string,
  orderId: string,
  options?: { returnUrl?: string }
) {
  return paymentService.initiatePayment(userId, orderId, "payme", {
    returnUrl: options?.returnUrl ?? paymePaymentAdapter.getShopReturnUrl(),
  });
}

export function processPaymeWebhook(
  payload: unknown,
  headers: Record<string, string | string[] | undefined>
): PaymeRpcResponse {
  const request = parsePaymeRpcRequest(payload);
  const method = String(request.method ?? "");
  const auth = headers.authorization;

  try {
    const response = paymePaymentAdapter.dispatchJsonRpc(request, auth);

    if (paymePaymentAdapter.shouldApplyEntitlement(method, response)) {
      const normalized = response.result?._normalized as
        | { providerTransactionId: string; orderId: string; amount: number }
        | undefined;
      if (normalized) {
        paymentService.applyNormalizedPayment({
          provider: PaymentProviderEnum.PAYME,
          providerTransactionId: normalized.providerTransactionId,
          orderId: normalized.orderId,
          status: "PAID",
          amount: normalized.amount,
          currency: "UZS",
          rawPayload: { method, result: response.result },
        });
      }
    } else if (method === "CancelTransaction" && !response.error) {
      const txnId = String(response.result?.transaction ?? "");
      const paymeId = String(request.params?.id ?? "");
      if (txnId && paymeId) {
        const txn = findTransactionByInternalId(txnId);
        if (txn) {
          paymentService.applyNormalizedPayment({
            provider: PaymentProviderEnum.PAYME,
            providerTransactionId: paymeId,
            orderId: txn.orderId,
            status: "CANCELLED",
            amount: txn.amount,
            currency: txn.currency,
            rawPayload: { method, result: response.result },
          });
        }
      }
    }

    if (response.result && "_normalized" in response.result) {
      const { _normalized: _, ...clean } = response.result;
      response.result = clean;
    }

    logPaymeWebhook("processed", payload, headers, null, String(request.params?.id ?? null));
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook failed";
    logPaymeWebhook("failed", payload, headers, message, String(request.params?.id ?? null));
    throw err;
  }
}

export function handlePaymeReturn(query: Record<string, unknown>) {
  const orderId = String(query.order_id ?? query.account ?? "");
  const success = query.success === "1" || query.status === "success";

  return {
    orderId,
    success: Boolean(success),
    redirectUrl: paymePaymentAdapter.getFrontendReturnUrl(),
    query,
  };
}
