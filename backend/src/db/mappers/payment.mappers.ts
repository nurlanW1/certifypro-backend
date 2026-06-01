import type { PlanLimits, BillingPlan } from "../models/billing.model";
import type { Plan } from "../models/plan.model";
import type { Order } from "../models/order.model";
import type { PaymentTransaction } from "../models/payment-transaction.model";
import type { UserEntitlement } from "../models/user-entitlement.model";
import type { PaymentWebhookLog } from "../models/payment-webhook-log.model";
import { PLAN_LIMITS } from "../../config";
import { parseJson } from "../../utils/json";

export function mapPlan(row: Record<string, unknown>): Plan {
  const slug = row.slug as string;
  const defaults = PLAN_LIMITS[slug] ?? PLAN_LIMITS.free;
  const dbLimits = parseJson<Partial<PlanLimits>>((row.limits_json as string) ?? "{}", {});
  return {
    id: row.id as string,
    name: row.name as string,
    slug,
    description: (row.description as string) ?? null,
    price: Number(row.price_monthly ?? row.price ?? 0),
    currency: row.currency as string,
    durationDays: row.duration_days != null ? Number(row.duration_days) : null,
    features: parseJson<string[]>(row.features_json as string, []),
    limits: { ...defaults, ...dbLimits },
    isActive: Boolean(row.is_active),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/** @deprecated Use mapPlan — kept for billing module compatibility */
export function mapBillingPlanToPlan(plan: BillingPlan): Plan {
  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    description: null,
    price: plan.priceMonthly,
    currency: plan.currency,
    durationDays: null,
    features: plan.features,
    limits: plan.limits,
    isActive: plan.isActive,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

export function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as Order["type"],
    status: row.status as Order["status"],
    amount: Number(row.amount),
    currency: row.currency as string,
    description: (row.description as string) ?? null,
    planId: (row.plan_id as string) ?? null,
    eventId: (row.event_id as string) ?? null,
    designDraftId: (row.design_draft_id as string) ?? null,
    metadata: parseJson<Record<string, unknown>>(row.metadata_json as string, {}),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapPaymentTransaction(row: Record<string, unknown>): PaymentTransaction {
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    userId: row.user_id as string,
    provider: row.provider as PaymentTransaction["provider"],
    providerTransactionId: (row.provider_transaction_id as string) ?? null,
    status: row.status as PaymentTransaction["status"],
    amount: Number(row.amount),
    currency: row.currency as string,
    requestPayload: parseJson<Record<string, unknown>>(row.request_payload_json as string, {}),
    responsePayload: parseJson<Record<string, unknown>>(row.response_payload_json as string, {}),
    paidAt: (row.paid_at as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapUserEntitlement(row: Record<string, unknown>): UserEntitlement {
  const dbLimits = parseJson<Partial<PlanLimits>>((row.limits_json as string) ?? "{}", {});
  const defaults: PlanLimits = { ...PLAN_LIMITS.free, ...dbLimits };
  return {
    id: row.id as string,
    userId: row.user_id as string,
    planId: (row.plan_id as string) ?? null,
    sourceOrderId: row.source_order_id as string,
    startsAt: row.starts_at as string,
    endsAt: (row.ends_at as string) ?? null,
    status: row.status as UserEntitlement["status"],
    features: parseJson<string[]>(row.features_json as string, []),
    limits: defaults,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapPaymentWebhookLog(row: Record<string, unknown>): PaymentWebhookLog {
  return {
    id: row.id as string,
    provider: row.provider as PaymentWebhookLog["provider"],
    transactionId: (row.transaction_id as string) ?? null,
    rawPayload: parseJson<Record<string, unknown>>(row.raw_payload_json as string, {}),
    headers: parseJson<Record<string, unknown>>(row.headers_json as string, {}),
    status: row.status as string,
    errorMessage: (row.error_message as string) ?? null,
    reviewedAt: (row.reviewed_at as string) ?? null,
    reviewedByAdminId: (row.reviewed_by_admin_id as string) ?? null,
    reviewNote: (row.review_note as string) ?? null,
    createdAt: row.created_at as string,
  };
}
