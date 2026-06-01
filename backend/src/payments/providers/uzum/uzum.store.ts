import { getDb } from "../../../db/client";
import { mapOrder, mapPaymentTransaction } from "../../../db/mappers/payment.mappers";
import type { Order } from "../../../db/models/order.model";
import type { PaymentTransaction } from "../../../db/models/payment-transaction.model";
import { PaymentProvider } from "../../../db/models/payment-transaction.model";
import { Tables } from "../../../db/schema";
import { newId, nowIso } from "../../../utils/id";
import { parseJson, stringifyJson } from "../../../utils/json";
import { UzumStatus, type UzumTxnMeta } from "./uzum.types";

const CREATE_TIMEOUT_MS = 30 * 60 * 1000;

export function loadOrder(orderId: string): Order | null {
  const row = getDb().prepare(`SELECT * FROM ${Tables.ORDERS} WHERE id = ?`).get(orderId);
  return row ? mapOrder(row as Record<string, unknown>) : null;
}

export function getUzumMeta(txn: PaymentTransaction): UzumTxnMeta {
  const uzum = txn.responsePayload?.uzum as Partial<UzumTxnMeta> | undefined;
  return {
    uzumStatus: (uzum?.uzumStatus as UzumTxnMeta["uzumStatus"]) ?? UzumStatus.CREATED,
    transTime: Number(uzum?.transTime ?? (Date.parse(txn.createdAt) || Date.now())),
    confirmTime: uzum?.confirmTime ?? null,
    reverseTime: uzum?.reverseTime ?? null,
    account: String(uzum?.account ?? txn.orderId),
    amountTiyin: Number(uzum?.amountTiyin ?? 0),
  };
}

export function saveUzumMeta(txnId: string, meta: UzumTxnMeta): void {
  const row = getDb()
    .prepare(`SELECT response_payload_json FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE id = ?`)
    .get(txnId) as { response_payload_json: string } | undefined;
  const current = parseJson<Record<string, unknown>>(row?.response_payload_json, {});
  getDb()
    .prepare(
      `UPDATE ${Tables.PAYMENT_TRANSACTIONS}
       SET response_payload_json = ?, updated_at = ? WHERE id = ?`
    )
    .run(stringifyJson({ ...current, uzum: meta }), nowIso(), txnId);
}

export function findByUzumTransId(transId: string): PaymentTransaction | null {
  const row = getDb()
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
       WHERE provider = ? AND provider_transaction_id = ?`
    )
    .get(PaymentProvider.UZUM, transId);
  return row ? mapPaymentTransaction(row as Record<string, unknown>) : null;
}

export function findLatestOpenUzumForOrder(orderId: string): PaymentTransaction | null {
  const row = getDb()
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
       WHERE order_id = ? AND provider = ?
         AND status IN ('CREATED', 'PENDING')
       ORDER BY created_at DESC LIMIT 1`
    )
    .get(orderId, PaymentProvider.UZUM);
  return row ? mapPaymentTransaction(row as Record<string, unknown>) : null;
}

export function createUzumTransaction(
  order: Order,
  transId: string,
  amountTiyin: number,
  transTime: number,
  account: string
): PaymentTransaction {
  const existing = findLatestOpenUzumForOrder(order.id);
  const meta: UzumTxnMeta = {
    uzumStatus: UzumStatus.CREATED,
    transTime,
    confirmTime: null,
    reverseTime: null,
    account,
    amountTiyin,
  };
  const ts = nowIso();

  if (existing && !existing.providerTransactionId) {
    getDb()
      .prepare(
        `UPDATE ${Tables.PAYMENT_TRANSACTIONS} SET
          provider_transaction_id = ?, status = 'PENDING', amount = ?, updated_at = ?,
          response_payload_json = ?
        WHERE id = ?`
      )
      .run(transId, order.amount, ts, stringifyJson({ uzum: meta }), existing.id);
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
      PaymentProvider.UZUM,
      transId,
      order.amount,
      order.currency,
      stringifyJson({ uzum: meta }),
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

export function markUzumFailedIfExpired(txn: PaymentTransaction): UzumTxnMeta {
  const meta = getUzumMeta(txn);
  if (meta.uzumStatus !== UzumStatus.CREATED || meta.confirmTime) return meta;

  if (Date.now() - meta.transTime > CREATE_TIMEOUT_MS) {
    const failed: UzumTxnMeta = { ...meta, uzumStatus: UzumStatus.FAILED };
    saveUzumMeta(txn.id, failed);
    return failed;
  }
  return meta;
}

export function accountData(account: string) {
  return {
    account: { value: account },
    fio: { value: "Customer" },
  };
}
