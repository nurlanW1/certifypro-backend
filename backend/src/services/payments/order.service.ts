import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapOrder, mapPlan } from "../../db/mappers/payment.mappers";
import type { Order, OrderStatus, OrderType } from "../../db/models/order.model";
import { OrderType as OrderTypeEnum } from "../../db/models/order.model";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";
import { parsePagination, paginationMeta } from "../../utils/pagination";
import { assertOrderOwner } from "./ownership";
import { paymentConfig } from "../../payments/config";

export type CreateOrderInput = {
  type: OrderType;
  planId?: string;
  planSlug?: string;
  eventId?: string;
  designDraftId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

function resolvePlan(planId?: string, planSlug?: string) {
  const db = getDb();
  if (planId) {
    const row = db.prepare(`SELECT * FROM ${Tables.BILLING_PLANS} WHERE id = ?`).get(planId);
    if (!row) throw new Error("PLAN_NOT_FOUND");
    return mapPlan(row as Record<string, unknown>);
  }
  if (planSlug) {
    const row = db
      .prepare(`SELECT * FROM ${Tables.BILLING_PLANS} WHERE slug = ? AND is_active = 1`)
      .get(planSlug);
    if (!row) throw new Error("PLAN_NOT_FOUND");
    return mapPlan(row as Record<string, unknown>);
  }
  return null;
}

function assertResourceOwnership(userId: string, input: CreateOrderInput): void {
  const db = getDb();
  if (input.eventId) {
    const row = db
      .prepare(`SELECT user_id FROM ${Tables.EVENTS} WHERE id = ? AND deleted_at IS NULL`)
      .get(input.eventId) as { user_id: string } | undefined;
    if (!row || row.user_id !== userId) throw new Error("FORBIDDEN");
  }
  if (input.designDraftId) {
    const row = db
      .prepare(`SELECT user_id FROM ${Tables.DESIGN_DRAFTS} WHERE id = ? AND deleted_at IS NULL`)
      .get(input.designDraftId) as { user_id: string } | undefined;
    if (!row || row.user_id !== userId) throw new Error("FORBIDDEN");
  }
}

function resolveAmountAndDescription(
  userId: string,
  input: CreateOrderInput
): { amount: number; currency: string; description: string; planId: string | null } {
  assertResourceOwnership(userId, input);

  if (input.type === OrderTypeEnum.PLAN || input.type === OrderTypeEnum.EVENT_PACKAGE) {
    const plan = resolvePlan(input.planId, input.planSlug ?? (input.type === OrderTypeEnum.EVENT_PACKAGE ? "event_package" : undefined));
    if (!plan) throw new Error("PLAN_REQUIRED");
    if (!plan.isActive) throw new Error("PLAN_INACTIVE");
    return {
      amount: plan.price,
      currency: plan.currency,
      description: input.description ?? `${plan.name} subscription`,
      planId: plan.id,
    };
  }

  if (input.type === OrderTypeEnum.EXPORT) {
    const meta = input.metadata ?? {};
    const amount = Number(meta.amount ?? meta.price ?? 0);
    if (!amount || amount <= 0) throw new Error("INVALID_AMOUNT");
    return {
      amount: Math.round(amount),
      currency: paymentConfig.currency,
      description: input.description ?? "Export purchase",
      planId: null,
    };
  }

  if (input.type === OrderTypeEnum.TEMPLATE_PURCHASE) {
    const amount = Number(input.metadata?.amount ?? 0);
    if (!amount || amount <= 0) throw new Error("INVALID_AMOUNT");
    return {
      amount: Math.round(amount),
      currency: paymentConfig.currency,
      description: input.description ?? "Template purchase",
      planId: null,
    };
  }

  throw new Error("INVALID_ORDER_TYPE");
}

export function createOrder(userId: string, input: CreateOrderInput): Order {
  const { amount, currency, description, planId } = resolveAmountAndDescription(userId, input);
  const id = newId("ord");
  const ts = nowIso();

  getDb()
    .prepare(
      `INSERT INTO ${Tables.ORDERS} (
        id, user_id, type, status, amount, currency, description,
        plan_id, event_id, design_draft_id, metadata_json, created_at, updated_at
      ) VALUES (?, ?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      userId,
      input.type,
      amount,
      currency,
      description,
      planId,
      input.eventId ?? null,
      input.designDraftId ?? null,
      stringifyJson(input.metadata ?? {}),
      ts,
      ts
    );

  return getOrderById(userId, id);
}

export function getOrderById(userId: string, orderId: string): Order {
  return assertOrderOwner(orderId, userId);
}

export function listOrders(
  userId: string,
  query?: { page?: string; limit?: string; status?: string }
): { items: Order[]; meta?: ReturnType<typeof paginationMeta> } {
  const conditions = ["user_id = ?"];
  const params: unknown[] = [userId];
  if (query?.status) {
    conditions.push("status = ?");
    params.push(query.status);
  }
  const where = conditions.join(" AND ");

  if (!query?.page && !query?.limit) {
    const rows = getDb()
      .prepare(`SELECT * FROM ${Tables.ORDERS} WHERE ${where} ORDER BY created_at DESC LIMIT 50`)
      .all(...params);
    return { items: rows.map((r) => mapOrder(r as Record<string, unknown>)) };
  }

  const pg = parsePagination(query);
  const total = (
    getDb().prepare(`SELECT COUNT(*) as c FROM ${Tables.ORDERS} WHERE ${where}`).get(...params) as {
      c: number;
    }
  ).c;
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.ORDERS} WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    )
    .all(...params, pg.limit, pg.offset);
  return {
    items: rows.map((r) => mapOrder(r as Record<string, unknown>)),
    meta: paginationMeta(total, pg),
  };
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order {
  const ts = nowIso();
  getDb()
    .prepare(`UPDATE ${Tables.ORDERS} SET status = ?, updated_at = ? WHERE id = ?`)
    .run(status, ts, orderId);
  const row = getDb().prepare(`SELECT * FROM ${Tables.ORDERS} WHERE id = ?`).get(orderId);
  return mapOrder(row as Record<string, unknown>);
}
