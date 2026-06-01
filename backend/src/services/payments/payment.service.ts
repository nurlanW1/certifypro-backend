import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapOrder, mapPaymentTransaction } from "../../db/mappers/payment.mappers";
import type { Order } from "../../db/models/order.model";
import type { PaymentProvider } from "../../db/models/payment-transaction.model";
import { PaymentTransactionStatus } from "../../db/models/payment-transaction.model";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";
import { getPaymentGateway } from "../../payments/gateway-registry";
import { clickPaymentAdapter } from "../../payments/providers/click/click-payment.adapter";
import { PaymentProvider as PaymentProviderEnum } from "../../db/models/payment-transaction.model";
import {
  mapNormalizedToOrderStatus,
  mapNormalizedToTransactionStatus,
  parseProviderParam,
} from "../../payments/utils";
import type { NormalizedPaymentResult } from "../../payments/types";
import { assertOrderOwner } from "./ownership";
import * as orderService from "./order.service";
import * as entitlementService from "./entitlement.service";

export type PaymentHistoryItem = {
  order: Order;
  transactions: ReturnType<typeof mapPaymentTransaction>[];
};

function getLatestTransaction(orderId: string) {
  const row = getDb()
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
       WHERE order_id = ? ORDER BY created_at DESC LIMIT 1`
    )
    .get(orderId);
  return row ? mapPaymentTransaction(row as Record<string, unknown>) : null;
}

function listTransactionsForOrder(orderId: string) {
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE order_id = ? ORDER BY created_at DESC`
    )
    .all(orderId);
  return rows.map((r) => mapPaymentTransaction(r as Record<string, unknown>));
}

export async function initiatePayment(
  userId: string,
  orderId: string,
  providerInput: string,
  options?: { returnUrl?: string }
) {
  const order = assertOrderOwner(orderId, userId);
  if (order.status === "PAID") throw new Error("ORDER_ALREADY_PAID");
  if (order.status === "CANCELLED" || order.status === "EXPIRED") {
    throw new Error("ORDER_NOT_PAYABLE");
  }

  const provider = parseProviderParam(providerInput);
  const gateway = getPaymentGateway(provider);
  const txnId = newId("ptx");
  const ts = nowIso();

  getDb()
    .prepare(
      `INSERT INTO ${Tables.PAYMENT_TRANSACTIONS} (
        id, order_id, user_id, provider, provider_transaction_id, status,
        amount, currency, request_payload_json, response_payload_json, paid_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, NULL, 'CREATED', ?, ?, '{}', '{}', NULL, ?, ?)`
    )
    .run(txnId, orderId, userId, provider, order.amount, order.currency, ts, ts);

  let transaction = mapPaymentTransaction(
    getDb().prepare(`SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE id = ?`).get(txnId) as Record<
      string,
      unknown
    >
  );

  const session = await gateway.createPayment({ order, transaction, returnUrl: options?.returnUrl });

  const pendingTs = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.PAYMENT_TRANSACTIONS} SET
        status = 'PENDING', provider_transaction_id = ?,
        request_payload_json = ?, response_payload_json = ?, updated_at = ?
      WHERE id = ?`
    )
    .run(
      session.providerTransactionId,
      stringifyJson({ returnUrl: options?.returnUrl }),
      stringifyJson(session.rawResponse),
      pendingTs,
      txnId
    );

  transaction = mapPaymentTransaction(
    getDb().prepare(`SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE id = ?`).get(txnId) as Record<
      string,
      unknown
    >
  );

  return {
    order,
    transaction,
    paymentUrl: session.paymentUrl,
    instructions: session.instructions,
    provider,
  };
}

export function getOrderPaymentStatus(userId: string, orderId: string) {
  const order = assertOrderOwner(orderId, userId);
  const transactions = listTransactionsForOrder(orderId);
  const latest = transactions[0] ?? null;
  return { order, transactions, latest };
}

export function getPaymentHistory(
  userId: string,
  query?: { page?: string; limit?: string }
): { items: PaymentHistoryItem[]; meta?: ReturnType<typeof orderService.listOrders>["meta"] } {
  const { items: orders, meta } = orderService.listOrders(userId, query);
  const items = orders.map((order) => ({
    order,
    transactions: listTransactionsForOrder(order.id),
  }));
  return { items, meta };
}

function findTransactionForWebhook(
  result: NormalizedPaymentResult,
  provider: PaymentProvider
) {
  const db = getDb();
  if (result.providerTransactionId) {
    const row = db
      .prepare(
        `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
         WHERE provider = ? AND provider_transaction_id = ?`
      )
      .get(provider, result.providerTransactionId);
    if (row) return mapPaymentTransaction(row as Record<string, unknown>);
  }
  const latest = db
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
       WHERE order_id = ? AND provider = ?
       ORDER BY created_at DESC LIMIT 1`
    )
    .get(result.orderId, provider);
  return latest ? mapPaymentTransaction(latest as Record<string, unknown>) : null;
}

function verifyPaymentAgainstOrder(order: Order, result: NormalizedPaymentResult): void {
  if (result.amount > 0 && Math.round(result.amount * 100) !== Math.round(order.amount * 100)) {
    throw new Error("PAYMENT_AMOUNT_MISMATCH");
  }
}

export function normalizeClickComplete(body: Record<string, unknown>): NormalizedPaymentResult {
  const normalized = {
    provider: PaymentProviderEnum.CLICK,
    providerTransactionId: String(body.click_trans_id ?? ""),
    orderId: String(body.merchant_trans_id ?? ""),
    status: Number(body.error) === 0 ? ("PAID" as const) : ("CANCELLED" as const),
    amount: Number(body.amount ?? 0),
    currency: "UZS",
    rawPayload: { body, source: "click_shop_complete" },
  };
  return normalized;
}

export function applyNormalizedPayment(result: NormalizedPaymentResult): Order {
  const txn = findTransactionForWebhook(result, result.provider);
  if (!txn) throw new Error("TRANSACTION_NOT_FOUND");

  const orderRow = getDb().prepare(`SELECT * FROM ${Tables.ORDERS} WHERE id = ?`).get(txn.orderId);
  if (!orderRow) throw new Error("ORDER_NOT_FOUND");
  const orderBefore = mapOrder(orderRow as Record<string, unknown>);
  verifyPaymentAgainstOrder(orderBefore, result);

  if (orderBefore.status === "PAID" && result.status === "PAID") {
    return orderBefore;
  }

  if (txn.status === PaymentTransactionStatus.PAID && result.status === "PAID") {
    return mapOrder(
      getDb().prepare(`SELECT * FROM ${Tables.ORDERS} WHERE id = ?`).get(txn.orderId) as Record<
        string,
        unknown
      >
    );
  }

  const ts = nowIso();
  const txnStatus = mapNormalizedToTransactionStatus(result.status);
  const paidAt = result.status === "PAID" ? ts : null;

  getDb()
    .prepare(
      `UPDATE ${Tables.PAYMENT_TRANSACTIONS} SET
        status = ?, provider_transaction_id = ?, response_payload_json = ?,
        paid_at = ?, updated_at = ?
      WHERE id = ?`
    )
    .run(
      txnStatus,
      result.providerTransactionId,
      stringifyJson(result.rawPayload),
      paidAt,
      ts,
      txn.id
    );

  const orderStatus = mapNormalizedToOrderStatus(result.status);
  const order = orderService.updateOrderStatus(txn.orderId, orderStatus);

  if (result.status === "PAID") {
    entitlementService.grantEntitlementFromOrder(order);
  }

  return order;
}

export function getClickAdapter() {
  return clickPaymentAdapter;
}

export async function handleProviderWebhook(
  providerInput: string,
  payload: unknown,
  headers: Record<string, string | string[] | undefined>
) {
  const provider = parseProviderParam(providerInput);
  const gateway = getPaymentGateway(provider);
  const logId = newId("whl");
  const ts = nowIso();

  try {
    const normalized = await gateway.handleWebhook(payload, headers);
    normalized.provider = provider;
    normalized.rawPayload = {
      ...(normalized.rawPayload ?? {}),
      inbound: payload,
    };

    getDb()
      .prepare(
        `INSERT INTO ${Tables.PAYMENT_WEBHOOK_LOGS} (
          id, provider, transaction_id, raw_payload_json, headers_json, status, error_message, created_at
        ) VALUES (?, ?, NULL, ?, ?, 'processed', NULL, ?)`
      )
      .run(
        logId,
        provider,
        stringifyJson(normalized.rawPayload),
        stringifyJson(headers),
        ts
      );

    const order = applyNormalizedPayment(normalized);

    const txn = findTransactionForWebhook(normalized, provider);
    if (txn) {
      getDb()
        .prepare(`UPDATE ${Tables.PAYMENT_WEBHOOK_LOGS} SET transaction_id = ? WHERE id = ?`)
        .run(txn.id, logId);
    }

    return { normalized, order };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook failed";
    getDb()
      .prepare(
        `INSERT INTO ${Tables.PAYMENT_WEBHOOK_LOGS} (
          id, provider, transaction_id, raw_payload_json, headers_json, status, error_message, created_at
        ) VALUES (?, ?, NULL, ?, ?, 'failed', ?, ?)`
      )
      .run(logId, provider, stringifyJson(payload ?? {}), stringifyJson(headers), message, ts);
    throw err;
  }
}

export async function checkPaymentStatus(userId: string, orderId: string) {
  const order = assertOrderOwner(orderId, userId);
  const txn = getLatestTransaction(orderId);
  if (!txn) {
    return getOrderPaymentStatus(userId, orderId);
  }
  const gateway = getPaymentGateway(txn.provider);
  const normalized = await gateway.checkStatus(txn, order);
  if (normalized.status === "PAID" && order.status !== "PAID") {
    applyNormalizedPayment({ ...normalized, orderId: order.id });
  }
  return getOrderPaymentStatus(userId, orderId);
}
