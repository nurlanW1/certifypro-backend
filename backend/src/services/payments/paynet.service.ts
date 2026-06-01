import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { PaymentProvider } from "../../db/models/payment-transaction.model";
import { paynetPaymentAdapter } from "../../payments/providers/paynet/paynet-payment.adapter";
import { parsePaynetBody } from "../../payments/providers/paynet/paynet.types";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";
import * as paymentService from "./payment.service";

function logPaynetWebhook(
  status: "processed" | "failed",
  payload: unknown,
  headers: Record<string, string | string[] | undefined>,
  errorMessage: string | null
): void {
  getDb()
    .prepare(
      `INSERT INTO ${Tables.PAYMENT_WEBHOOK_LOGS} (
        id, provider, transaction_id, raw_payload_json, headers_json, status, error_message, created_at
      ) VALUES (?, ?, NULL, ?, ?, ?, ?, ?)`
    )
    .run(
      newId("whl"),
      PaymentProvider.PAYNET,
      stringifyJson(payload ?? {}),
      stringifyJson(headers),
      status,
      errorMessage,
      nowIso()
    );
}

export async function createPaynetPayment(
  userId: string,
  orderId: string,
  options?: { returnUrl?: string }
) {
  const session = await paymentService.initiatePayment(userId, orderId, "paynet", {
    returnUrl: options?.returnUrl ?? paynetPaymentAdapter.getShopReturnUrl(),
  });

  return {
    ...session,
    providerReady: paynetPaymentAdapter.isProtocolImplemented(),
    integrationStatus: paynetPaymentAdapter.isProtocolImplemented() ? "live" : "placeholder",
  };
}

/**
 * Paynet merchant webhook — placeholder only.
 *
 * TODO(paynet): Route by official method (path segment or body field), verify signature/auth,
 * normalize to NormalizedPaymentResult, and call paymentService.applyNormalizedPayment on confirm.
 */
export function processPaynetWebhook(
  payload: unknown,
  headers: Record<string, string | string[] | undefined>
): { status: number; body: Record<string, unknown> } {
  const body = parsePaynetBody(payload);

  logPaynetWebhook("failed", payload, headers, "PAYNET_WEBHOOK_NOT_IMPLEMENTED");

  return {
    status: 501,
    body: {
      success: false,
      error: {
        code: "PAYNET_WEBHOOK_NOT_IMPLEMENTED",
        message:
          "Paynet merchant webhook handler is not implemented yet. Awaiting official Paynet API protocol documentation.",
      },
      received: {
        // Echo minimal fields for debugging without pretending to validate them
        keys: Object.keys(body),
      },
      todo: [
        "Obtain official Paynet merchant API documentation and credentials",
        "Implement signature/auth verification (PAYNET_SECRET_KEY or dedicated webhook secret)",
        "Implement check / create / confirm / reverse / status handlers",
        "Call applyNormalizedPayment only after confirmed payment",
      ],
    },
  };
}

export function handlePaynetReturn(query: Record<string, unknown>) {
  const orderId = String(query.order_id ?? query.orderId ?? query.merchant_order_id ?? "");

  return {
    orderId,
    success: query.success === "1" || query.status === "success",
    redirectUrl: paynetPaymentAdapter.getFrontendReturnUrl(),
    query,
  };
}
