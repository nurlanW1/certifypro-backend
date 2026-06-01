import { getDb } from "../../../db/client";
import { mapOrder, mapPaymentTransaction } from "../../../db/mappers/payment.mappers";
import type { Order } from "../../../db/models/order.model";
import type { PaymentTransaction } from "../../../db/models/payment-transaction.model";
import { PaymentProvider } from "../../../db/models/payment-transaction.model";
import { Tables } from "../../../db/schema";
import { newId, nowIso } from "../../../utils/id";
import { parseJson, stringifyJson } from "../../../utils/json";
import { PaymeState, type PaymeAccount, type PaymeTxnMeta } from "./payme.types";

const PAYME_ACCOUNT_ORDER_KEY = "order_id";

export function extractOrderIdFromAccount(account: PaymeAccount | undefined): string {
  if (!account) return "";
  return String(account[PAYME_ACCOUNT_ORDER_KEY] ?? account.orderId ?? "").trim();
}

export function loadOrder(orderId: string): Order | null {
  const row = getDb().prepare(`SELECT * FROM ${Tables.ORDERS} WHERE id = ?`).get(orderId);
  return row ? mapOrder(row as Record<string, unknown>) : null;
}

export function getPaymeMeta(txn: PaymentTransaction): PaymeTxnMeta {
  const payme = txn.responsePayload?.payme as Partial<PaymeTxnMeta> | undefined;
  return {
    paymeState: (payme?.paymeState as PaymeTxnMeta["paymeState"]) ?? PaymeState.CREATED,
    createTime: Number(payme?.createTime ?? (Date.parse(txn.createdAt) || Date.now())),
    performTime: Number(payme?.performTime ?? 0),
    cancelTime: Number(payme?.cancelTime ?? 0),
    reason: payme?.reason ?? null,
  };
}

export function savePaymeMeta(txnId: string, meta: PaymeTxnMeta, extra?: Record<string, unknown>): void {
  const row = getDb()
    .prepare(`SELECT response_payload_json FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE id = ?`)
    .get(txnId) as { response_payload_json: string } | undefined;
  const current = parseJson<Record<string, unknown>>(row?.response_payload_json, {});
  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.PAYMENT_TRANSACTIONS}
       SET response_payload_json = ?, updated_at = ? WHERE id = ?`
    )
    .run(stringifyJson({ ...current, ...extra, payme: meta }), ts, txnId);
}

export function findTransactionByInternalId(txnId: string): PaymentTransaction | null {
  const row = getDb()
    .prepare(`SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE id = ?`)
    .get(txnId);
  return row ? mapPaymentTransaction(row as Record<string, unknown>) : null;
}

export function findByPaymeId(paymeId: string): PaymentTransaction | null {
  const row = getDb()
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
       WHERE provider = ? AND provider_transaction_id = ?`
    )
    .get(PaymentProvider.PAYME, paymeId);
  return row ? mapPaymentTransaction(row as Record<string, unknown>) : null;
}

export function findLatestOpenPaymeForOrder(orderId: string): PaymentTransaction | null {
  const row = getDb()
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
       WHERE order_id = ? AND provider = ?
         AND status IN ('CREATED', 'PENDING')
       ORDER BY created_at DESC LIMIT 1`
    )
    .get(orderId, PaymentProvider.PAYME);
  return row ? mapPaymentTransaction(row as Record<string, unknown>) : null;
}

export function createPaymeTransaction(
  order: Order,
  paymeId: string,
  createTime: number
): PaymentTransaction {
  const existing = findLatestOpenPaymeForOrder(order.id);
  const ts = nowIso();
  const meta: PaymeTxnMeta = {
    paymeState: PaymeState.CREATED,
    createTime,
    performTime: 0,
    cancelTime: 0,
    reason: null,
  };

  if (existing && !existing.providerTransactionId) {
    getDb()
      .prepare(
        `UPDATE ${Tables.PAYMENT_TRANSACTIONS} SET
          provider_transaction_id = ?, status = 'PENDING', updated_at = ?,
          response_payload_json = ?
        WHERE id = ?`
      )
      .run(paymeId, ts, stringifyJson({ payme: meta }), existing.id);
    savePaymeMeta(existing.id, meta);
    return mapPaymentTransaction(
      getDb().prepare(`SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE id = ?`).get(existing.id) as Record<
        string,
        unknown
      >
    );
  }

  const id = newId("ptx");
  getDb()
    .prepare(
      `INSERT INTO ${Tables.PAYMENT_TRANSACTIONS} (
        id, order_id, user_id, provider, provider_transaction_id, status,
        amount, currency, request_payload_json, response_payload_json, paid_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'PENDING', ?, ?, '{}', ?, NULL, ?, ?)`
    )
    .run(
      id,
      order.id,
      order.userId,
      PaymentProvider.PAYME,
      paymeId,
      order.amount,
      order.currency,
      stringifyJson({ payme: meta }),
      ts,
      ts
    );

  return mapPaymentTransaction(
    getDb().prepare(`SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE id = ?`).get(id) as Record<
      string,
      unknown
    >
  );
}

export function listPaymeStatement(fromMs: number, toMs: number): PaymentTransaction[] {
  const fromIso = new Date(fromMs).toISOString();
  const toIso = new Date(toMs).toISOString();
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
       WHERE provider = ? AND created_at >= ? AND created_at <= ?
       ORDER BY created_at ASC`
    )
    .all(PaymentProvider.PAYME, fromIso, toIso);
  return rows.map((r) => mapPaymentTransaction(r as Record<string, unknown>));
}

export function toCheckTransactionResult(txn: PaymentTransaction) {
  const meta = getPaymeMeta(txn);
  return {
    create_time: meta.createTime,
    perform_time: meta.performTime,
    cancel_time: meta.cancelTime,
    transaction: txn.id,
    state: meta.paymeState,
    reason: meta.reason,
  };
}
