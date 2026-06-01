import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapOrder, mapPaymentTransaction } from "../../db/mappers/payment.mappers";
import type { Order } from "../../db/models/order.model";
import type { PaymentTransaction } from "../../db/models/payment-transaction.model";

export function assertOrderOwner(orderId: string, userId: string): Order {
  const row = getDb().prepare(`SELECT * FROM ${Tables.ORDERS} WHERE id = ?`).get(orderId);
  if (!row) throw new Error("NOT_FOUND");
  const order = mapOrder(row as Record<string, unknown>);
  if (order.userId !== userId) throw new Error("FORBIDDEN");
  return order;
}

export function assertPaymentTransactionOwner(
  transactionId: string,
  userId: string
): PaymentTransaction {
  const row = getDb()
    .prepare(`SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE id = ?`)
    .get(transactionId);
  if (!row) throw new Error("NOT_FOUND");
  const txn = mapPaymentTransaction(row as Record<string, unknown>);
  if (txn.userId !== userId) throw new Error("FORBIDDEN");
  return txn;
}

export function assertEntitlementOwner(entitlementId: string, userId: string): void {
  const row = getDb()
    .prepare(`SELECT user_id FROM ${Tables.USER_ENTITLEMENTS} WHERE id = ?`)
    .get(entitlementId) as { user_id: string } | undefined;
  if (!row) throw new Error("NOT_FOUND");
  if (row.user_id !== userId) throw new Error("FORBIDDEN");
}
