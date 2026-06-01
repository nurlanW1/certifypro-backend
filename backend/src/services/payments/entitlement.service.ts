import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapPlan, mapUserEntitlement } from "../../db/mappers/payment.mappers";
import type { Order } from "../../db/models/order.model";
import { OrderType } from "../../db/models/order.model";
import { EntitlementStatus } from "../../db/models/user-entitlement.model";
import { newId, nowIso } from "../../utils/id";
import { stringifyJson } from "../../utils/json";
import * as billingLimits from "../billing/billing-limits.service";
import * as activity from "../activity/activity.service";
import { ActivityAction } from "../../db/models/activity.model";

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export function grantEntitlementFromOrder(order: Order): void {
  if (order.status !== "PAID") return;

  const db = getDb();
  const ts = nowIso();
  let planId = order.planId;
  let features: string[] = [];
  let limits = { ...billingLimits.getCapabilities(order.userId).limits };
  let endsAt: string | null = null;

  if (order.type === OrderType.PLAN || order.type === OrderType.EVENT_PACKAGE) {
    if (!planId && order.metadata?.planSlug) {
      const row = db
        .prepare(`SELECT id FROM ${Tables.BILLING_PLANS} WHERE slug = ?`)
        .get(String(order.metadata.planSlug));
      planId = row ? (row as { id: string }).id : null;
    }
    if (planId) {
      const planRow = db.prepare(`SELECT * FROM ${Tables.BILLING_PLANS} WHERE id = ?`).get(planId);
      if (planRow) {
        const plan = mapPlan(planRow as Record<string, unknown>);
        features = plan.features;
        limits = plan.limits;
        endsAt = plan.durationDays ? addDays(ts, plan.durationDays) : null;
        db.prepare(`UPDATE ${Tables.USERS} SET plan = ?, updated_at = ? WHERE id = ?`).run(
          plan.slug,
          ts,
          order.userId
        );
        activity.logActivity({
          userId: order.userId,
          action: ActivityAction.PLAN_CHANGED,
          resourceType: "plan",
          resourceId: plan.id,
          metadata: { planSlug: plan.slug, orderId: order.id },
        });
      }
    }
  }

  if (order.type === OrderType.EXPORT) {
    const extra = Number(order.metadata.exportCredits ?? order.metadata.quantity ?? 0);
    if (extra > 0) {
      limits = {
        ...limits,
        maxExports: limits.maxExports + extra,
      };
    }
  }

  const entitlementId = newId("ent");
  db.prepare(
    `INSERT INTO ${Tables.USER_ENTITLEMENTS} (
      id, user_id, plan_id, source_order_id, starts_at, ends_at, status,
      features_json, limits_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, ?)`
  ).run(
    entitlementId,
    order.userId,
    planId,
    order.id,
    ts,
    endsAt,
    stringifyJson(features),
    stringifyJson(limits),
    ts,
    ts
  );

  billingLimits.syncUsageCounts(order.userId);
}

export function listEntitlements(userId: string) {
  const rows = getDb()
    .prepare(
      `SELECT * FROM ${Tables.USER_ENTITLEMENTS} WHERE user_id = ? ORDER BY created_at DESC`
    )
    .all(userId);
  return rows.map((r) => mapUserEntitlement(r as Record<string, unknown>));
}

export function getActiveEntitlement(userId: string) {
  const row = getDb()
    .prepare(
      `SELECT * FROM ${Tables.USER_ENTITLEMENTS}
       WHERE user_id = ? AND status = 'ACTIVE'
       ORDER BY created_at DESC LIMIT 1`
    )
    .get(userId);
  return row ? mapUserEntitlement(row as Record<string, unknown>) : null;
}
