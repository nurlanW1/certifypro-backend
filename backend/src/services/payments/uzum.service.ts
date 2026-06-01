import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { PaymentProvider } from "../../db/models/payment-transaction.model";
import { PaymentProvider as PaymentProviderEnum } from "../../db/models/payment-transaction.model";
import { uzumPaymentAdapter } from "../../payments/providers/uzum/uzum-payment.adapter";
import { findByUzumTransId } from "../../payments/providers/uzum/uzum.store";
import { parseUzumBody, type UzumWebhookMethod } from "../../payments/providers/uzum/uzum.types";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";
import * as paymentService from "./payment.service";

const UZUM_METHODS: UzumWebhookMethod[] = ["check", "create", "confirm", "reverse", "status"];

function logUzumWebhook(
  status: "processed" | "failed",
  method: string,
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
      PaymentProvider.UZUM,
      transactionRef,
      stringifyJson({ method, payload: payload ?? {} }),
      stringifyJson(headers),
      status,
      errorMessage,
      nowIso()
    );
}

function isUzumMethod(value: string): value is UzumWebhookMethod {
  return (UZUM_METHODS as string[]).includes(value);
}

function uzumErrorResponse(
  err: unknown,
  body: Record<string, unknown>
): { status: number; body: Record<string, unknown> } {
  const message = err instanceof Error ? err.message : "Error";
  const status =
    message === "WEBHOOK_INVALID_SIGNATURE"
      ? 401
      : message === "ORDER_NOT_FOUND" || message === "TRANSACTION_NOT_FOUND"
        ? 404
        : 400;

  return {
    status,
    body: {
      serviceId: Number(body.serviceId ?? 0),
      timestamp: Number(body.timestamp ?? Date.now()),
      transId: body.transId,
      status: "FAILED",
      error: { code: message, message },
    },
  };
}

export async function createUzumPayment(
  userId: string,
  orderId: string,
  options?: { returnUrl?: string }
) {
  return paymentService.initiatePayment(userId, orderId, "uzum", {
    returnUrl: options?.returnUrl ?? uzumPaymentAdapter.getShopReturnUrl(),
  });
}

export function processUzumWebhook(
  methodInput: string,
  payload: unknown,
  headers: Record<string, string | string[] | undefined>
): { status: number; body: Record<string, unknown> } {
  const method = methodInput.toLowerCase();
  const body = parseUzumBody(payload);

  if (!isUzumMethod(method)) {
    return uzumErrorResponse(new Error("UNSUPPORTED_PROVIDER"), body);
  }

  try {
    const response = uzumPaymentAdapter.dispatchWebhook(method, payload, headers);

    if (response._applyPayment === true) {
      const normalized = response._normalized as
        | { providerTransactionId: string; orderId: string; amount: number }
        | undefined;

      if (method === "confirm" && normalized) {
        paymentService.applyNormalizedPayment({
          provider: PaymentProviderEnum.UZUM,
          providerTransactionId: normalized.providerTransactionId,
          orderId: normalized.orderId,
          status: "PAID",
          amount: normalized.amount,
          currency: "UZS",
          rawPayload: { method, response },
        });
      } else if (method === "reverse") {
        const transId = String(body.transId ?? "");
        const txn = findByUzumTransId(transId);
        if (txn) {
          paymentService.applyNormalizedPayment({
            provider: PaymentProviderEnum.UZUM,
            providerTransactionId: transId,
            orderId: txn.orderId,
            status: "CANCELLED",
            amount: txn.amount,
            currency: txn.currency,
            rawPayload: { method, response },
          });
        }
      }
    }

    const { _applyPayment: _a, _normalized: _n, ...clean } = response;
    void _a;
    void _n;

    logUzumWebhook("processed", method, payload, headers, null, String(body.transId ?? null));
    return { status: 200, body: clean };
  } catch (err) {
    logUzumWebhook(
      "failed",
      method,
      payload,
      headers,
      err instanceof Error ? err.message : "Webhook failed",
      String(body.transId ?? null)
    );
    return uzumErrorResponse(err, body);
  }
}

export function handleUzumReturn(query: Record<string, unknown>) {
  const orderId = String(query.order_id ?? query.account ?? query.orderId ?? "");
  const success =
    query.success === "1" ||
    query.status === "success" ||
    query.status === "CONFIRMED";

  return {
    orderId,
    success: Boolean(success),
    redirectUrl: uzumPaymentAdapter.getFrontendReturnUrl(),
    query,
  };
}
