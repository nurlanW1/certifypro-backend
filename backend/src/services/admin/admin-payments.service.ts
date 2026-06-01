import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import {
  mapOrder,
  mapPaymentTransaction,
  mapPaymentWebhookLog,
} from "../../db/mappers/payment.mappers";
import type { Order, PaymentTransaction, PaymentWebhookLog } from "../../db/models";
import { newId, nowIso } from "../../utils/id";
import { parseJson, stringifyJson } from "../../utils/json";
import { parsePagination, paginationMeta } from "../../utils/pagination";
import * as orderService from "../payments/order.service";
import * as entitlementService from "../payments/entitlement.service";
import * as activity from "../activity/activity.service";
import { ActivityAction } from "../../db/models/activity.model";

export type AdminUserSummary = {
  id: string;
  name: string;
  email: string;
};

export type AdminOrderListItem = Order & {
  user: AdminUserSummary;
  paymentProvider: string | null;
  transactionStatus: string | null;
  paidAt: string | null;
};

export type AdminTransactionListItem = PaymentTransaction & {
  user: AdminUserSummary;
  orderStatus: string;
  orderDescription: string | null;
};

export type AdminWebhookListItem = PaymentWebhookLog & {
  reviewed: boolean;
};

function logAdminPaymentAudit(params: {
  adminUserId: string;
  action: string;
  reason: string;
  orderId?: string | null;
  transactionId?: string | null;
  webhookLogId?: string | null;
  metadata?: Record<string, unknown>;
}): void {
  getDb()
    .prepare(
      `INSERT INTO ${Tables.ADMIN_PAYMENT_AUDIT_LOG} (
        id, admin_user_id, action, order_id, transaction_id, webhook_log_id,
        reason, metadata_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      newId("apa"),
      params.adminUserId,
      params.action,
      params.orderId ?? null,
      params.transactionId ?? null,
      params.webhookLogId ?? null,
      params.reason,
      stringifyJson(params.metadata ?? {}),
      nowIso()
    );
}

export function listAdminOrders(query: {
  page?: string;
  limit?: string;
  status?: string;
  provider?: string;
  q?: string;
}): { items: AdminOrderListItem[]; meta: ReturnType<typeof paginationMeta> } {
  const pg = parsePagination(query);
  const conditions: string[] = ["1=1"];
  const params: unknown[] = [];

  if (query.status) {
    conditions.push("o.status = ?");
    params.push(query.status);
  }

  if (query.provider) {
    conditions.push(
      `EXISTS (
        SELECT 1 FROM ${Tables.PAYMENT_TRANSACTIONS} pt
        WHERE pt.order_id = o.id AND pt.provider = ?
      )`
    );
    params.push(query.provider.toUpperCase());
  }

  if (query.q?.trim()) {
    const term = `%${query.q.trim()}%`;
    conditions.push(
      `(o.id LIKE ? OR o.description LIKE ? OR u.email LIKE ? OR u.name LIKE ?)`
    );
    params.push(term, term, term, term);
  }

  const where = conditions.join(" AND ");
  const db = getDb();

  const total = (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM ${Tables.ORDERS} o
         INNER JOIN ${Tables.USERS} u ON u.id = o.user_id
         WHERE ${where}`
      )
      .get(...params) as { c: number }
  ).c;

  const rows = db
    .prepare(
      `SELECT o.*, u.id as u_id, u.name as u_name, u.email as u_email,
        (SELECT provider FROM ${Tables.PAYMENT_TRANSACTIONS}
         WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1) as latest_provider,
        (SELECT status FROM ${Tables.PAYMENT_TRANSACTIONS}
         WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1) as latest_txn_status,
        (SELECT paid_at FROM ${Tables.PAYMENT_TRANSACTIONS}
         WHERE order_id = o.id AND paid_at IS NOT NULL
         ORDER BY paid_at DESC LIMIT 1) as latest_paid_at
       FROM ${Tables.ORDERS} o
       INNER JOIN ${Tables.USERS} u ON u.id = o.user_id
       WHERE ${where}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, pg.limit, pg.offset) as Record<string, unknown>[];

  const items: AdminOrderListItem[] = rows.map((row) => {
    const order = mapOrder(row);
    return {
      ...order,
      user: {
        id: row.u_id as string,
        name: row.u_name as string,
        email: row.u_email as string,
      },
      paymentProvider: (row.latest_provider as string) ?? null,
      transactionStatus: (row.latest_txn_status as string) ?? null,
      paidAt: (row.latest_paid_at as string) ?? null,
    };
  });

  return { items, meta: paginationMeta(total, pg) };
}

export function getAdminOrder(orderId: string): {
  order: AdminOrderListItem;
  transactions: PaymentTransaction[];
} {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT o.*, u.id as u_id, u.name as u_name, u.email as u_email,
        (SELECT provider FROM ${Tables.PAYMENT_TRANSACTIONS}
         WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1) as latest_provider,
        (SELECT status FROM ${Tables.PAYMENT_TRANSACTIONS}
         WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1) as latest_txn_status,
        (SELECT paid_at FROM ${Tables.PAYMENT_TRANSACTIONS}
         WHERE order_id = o.id AND paid_at IS NOT NULL
         ORDER BY paid_at DESC LIMIT 1) as latest_paid_at
       FROM ${Tables.ORDERS} o
       INNER JOIN ${Tables.USERS} u ON u.id = o.user_id
       WHERE o.id = ?`
    )
    .get(orderId) as Record<string, unknown> | undefined;

  if (!row) throw new Error("NOT_FOUND");

  const order: AdminOrderListItem = {
    ...mapOrder(row),
    user: {
      id: row.u_id as string,
      name: row.u_name as string,
      email: row.u_email as string,
    },
    paymentProvider: (row.latest_provider as string) ?? null,
    transactionStatus: (row.latest_txn_status as string) ?? null,
    paidAt: (row.latest_paid_at as string) ?? null,
  };

  const txRows = db
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS} WHERE order_id = ? ORDER BY created_at DESC`
    )
    .all(orderId);

  return {
    order,
    transactions: txRows.map((r) => mapPaymentTransaction(r as Record<string, unknown>)),
  };
}

export function listAdminTransactions(query: {
  page?: string;
  limit?: string;
  status?: string;
  provider?: string;
  orderId?: string;
}): { items: AdminTransactionListItem[]; meta: ReturnType<typeof paginationMeta> } {
  const pg = parsePagination(query);
  const conditions: string[] = ["1=1"];
  const params: unknown[] = [];

  if (query.status) {
    conditions.push("pt.status = ?");
    params.push(query.status);
  }
  if (query.provider) {
    conditions.push("pt.provider = ?");
    params.push(query.provider.toUpperCase());
  }
  if (query.orderId) {
    conditions.push("pt.order_id = ?");
    params.push(query.orderId);
  }

  const where = conditions.join(" AND ");
  const db = getDb();

  const total = (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM ${Tables.PAYMENT_TRANSACTIONS} pt WHERE ${where}`
      )
      .get(...params) as { c: number }
  ).c;

  const rows = db
    .prepare(
      `SELECT pt.*, o.status as order_status, o.description as order_description,
        u.id as u_id, u.name as u_name, u.email as u_email
       FROM ${Tables.PAYMENT_TRANSACTIONS} pt
       INNER JOIN ${Tables.ORDERS} o ON o.id = pt.order_id
       INNER JOIN ${Tables.USERS} u ON u.id = pt.user_id
       WHERE ${where}
       ORDER BY pt.created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, pg.limit, pg.offset) as Record<string, unknown>[];

  const items = rows.map((row) => ({
    ...mapPaymentTransaction(row),
    orderStatus: row.order_status as string,
    orderDescription: (row.order_description as string) ?? null,
    user: {
      id: row.u_id as string,
      name: row.u_name as string,
      email: row.u_email as string,
    },
  }));

  return { items, meta: paginationMeta(total, pg) };
}

export function listAdminWebhookLogs(query: {
  page?: string;
  limit?: string;
  status?: string;
  provider?: string;
  reviewed?: string;
}): { items: AdminWebhookListItem[]; meta: ReturnType<typeof paginationMeta> } {
  const pg = parsePagination(query);
  const conditions: string[] = ["1=1"];
  const params: unknown[] = [];

  if (query.status) {
    conditions.push("w.status = ?");
    params.push(query.status);
  }
  if (query.provider) {
    conditions.push("w.provider = ?");
    params.push(query.provider.toUpperCase());
  }
  if (query.reviewed === "true") {
    conditions.push("w.reviewed_at IS NOT NULL");
  } else if (query.reviewed === "false") {
    conditions.push("w.reviewed_at IS NULL");
  }

  const where = conditions.join(" AND ");
  const db = getDb();

  const total = (
    db
      .prepare(`SELECT COUNT(*) as c FROM ${Tables.PAYMENT_WEBHOOK_LOGS} w WHERE ${where}`)
      .get(...params) as { c: number }
  ).c;

  const rows = db
    .prepare(
      `SELECT w.* FROM ${Tables.PAYMENT_WEBHOOK_LOGS} w
       WHERE ${where}
       ORDER BY w.created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, pg.limit, pg.offset);

  const items = rows.map((r) => {
    const log = mapPaymentWebhookLog(r as Record<string, unknown>);
    return { ...log, reviewed: Boolean(log.reviewedAt) };
  });

  return { items, meta: paginationMeta(total, pg) };
}

export function getAdminWebhookLog(id: string): AdminWebhookListItem {
  const row = getDb()
    .prepare(`SELECT * FROM ${Tables.PAYMENT_WEBHOOK_LOGS} WHERE id = ?`)
    .get(id);
  if (!row) throw new Error("NOT_FOUND");
  const log = mapPaymentWebhookLog(row as Record<string, unknown>);
  return { ...log, reviewed: Boolean(log.reviewedAt) };
}

export function markWebhookReviewed(
  adminUserId: string,
  webhookLogId: string,
  note?: string
): AdminWebhookListItem {
  const existing = getAdminWebhookLog(webhookLogId);
  if (existing.reviewedAt) return existing;

  const ts = nowIso();
  getDb()
    .prepare(
      `UPDATE ${Tables.PAYMENT_WEBHOOK_LOGS}
       SET reviewed_at = ?, reviewed_by_admin_id = ?, review_note = ?
       WHERE id = ?`
    )
    .run(ts, adminUserId, note ?? null, webhookLogId);

  logAdminPaymentAudit({
    adminUserId,
    action: "WEBHOOK_MARK_REVIEWED",
    reason: note?.trim() || "Webhook log marked as reviewed by admin",
    webhookLogId,
    metadata: { provider: existing.provider, status: existing.status },
  });

  activity.logActivity({
    userId: adminUserId,
    action: ActivityAction.PAYMENT_WEBHOOK_REVIEWED,
    resourceType: "payment_webhook_log",
    resourceId: webhookLogId,
    metadata: { provider: existing.provider, note: note ?? null },
  });

  return getAdminWebhookLog(webhookLogId);
}

/**
 * Manual order activation — requires explicit confirmation + reason; fully audit-logged.
 * Does not run when order is already PAID unless confirmRepeat is true.
 */
export function adminForceOrderPaid(
  adminUserId: string,
  orderId: string,
  input: { confirm: boolean; reason: string; confirmRepeat?: boolean }
): Order {
  if (!input.confirm) {
    throw new Error("ADMIN_PAYMENT_CONFIRM_REQUIRED");
  }
  const reason = input.reason?.trim();
  if (!reason || reason.length < 10) {
    throw new Error("ADMIN_PAYMENT_REASON_REQUIRED");
  }

  const db = getDb();
  const orderRow = db.prepare(`SELECT * FROM ${Tables.ORDERS} WHERE id = ?`).get(orderId);
  if (!orderRow) throw new Error("NOT_FOUND");
  const orderBefore = mapOrder(orderRow as Record<string, unknown>);

  if (orderBefore.status === "PAID" && !input.confirmRepeat) {
    throw new Error("ORDER_ALREADY_PAID");
  }

  const txnRow = db
    .prepare(
      `SELECT * FROM ${Tables.PAYMENT_TRANSACTIONS}
       WHERE order_id = ? ORDER BY created_at DESC LIMIT 1`
    )
    .get(orderId) as Record<string, unknown> | undefined;

  const ts = nowIso();

  if (txnRow) {
    const txn = mapPaymentTransaction(txnRow);
    const responsePayload = {
      ...parseJson<Record<string, unknown>>(txnRow.response_payload_json as string, {}),
      adminOverride: {
        byAdminId: adminUserId,
        reason,
        at: ts,
      },
    };
    db.prepare(
      `UPDATE ${Tables.PAYMENT_TRANSACTIONS}
       SET status = 'PAID', paid_at = ?, updated_at = ?, response_payload_json = ?
       WHERE id = ?`
    ).run(ts, ts, stringifyJson(responsePayload), txn.id);

    logAdminPaymentAudit({
      adminUserId,
      action: "FORCE_ORDER_PAID",
      reason,
      orderId,
      transactionId: txn.id,
      metadata: {
        previousOrderStatus: orderBefore.status,
        previousTxnStatus: txn.status,
        provider: txn.provider,
        confirmRepeat: Boolean(input.confirmRepeat),
      },
    });
  } else {
    logAdminPaymentAudit({
      adminUserId,
      action: "FORCE_ORDER_PAID",
      reason,
      orderId,
      metadata: {
        previousOrderStatus: orderBefore.status,
        noTransaction: true,
        confirmRepeat: Boolean(input.confirmRepeat),
      },
    });
  }

  const order = orderService.updateOrderStatus(orderId, "PAID");
  entitlementService.grantEntitlementFromOrder(order);

  activity.logActivity({
    userId: adminUserId,
    action: ActivityAction.PAYMENT_ADMIN_OVERRIDE,
    resourceType: "order",
    resourceId: orderId,
    metadata: {
      reason,
      targetUserId: order.userId,
      confirmRepeat: Boolean(input.confirmRepeat),
    },
  });

  return order;
}

export function listAdminPaymentAudit(limit = 50) {
  const rows = getDb()
    .prepare(
      `SELECT a.*, u.name as admin_name, u.email as admin_email
       FROM ${Tables.ADMIN_PAYMENT_AUDIT_LOG} a
       INNER JOIN ${Tables.USERS} u ON u.id = a.admin_user_id
       ORDER BY a.created_at DESC
       LIMIT ?`
    )
    .all(limit) as Record<string, unknown>[];

  return rows.map((row) => ({
    id: row.id as string,
    adminUserId: row.admin_user_id as string,
    adminName: row.admin_name as string,
    adminEmail: row.admin_email as string,
    action: row.action as string,
    orderId: (row.order_id as string) ?? null,
    transactionId: (row.transaction_id as string) ?? null,
    webhookLogId: (row.webhook_log_id as string) ?? null,
    reason: row.reason as string,
    metadata: JSON.parse((row.metadata_json as string) || "{}") as Record<string, unknown>,
    createdAt: row.created_at as string,
  }));
}
