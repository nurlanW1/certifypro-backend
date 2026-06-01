import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapBillingPlan } from "../../db/mappers";
import type {
  BillingEntitlementSummary,
  BillingMeResponse,
  PlanCapabilities,
  PlanLimits,
  UsageDashboardSummary,
  UsageSnapshot,
} from "../../db/models";
import { PLAN_LIMITS } from "../../config";
import { parseJson } from "../../utils/json";
import * as userService from "../auth/user.service";
import { getActiveEntitlement } from "../payments/entitlement.service";

function currentPeriodStart(): string {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function resolveLimits(planSlug: string): PlanLimits {
  const base = { ...(PLAN_LIMITS[planSlug] ?? PLAN_LIMITS.free) };
  const planRow = getDb()
    .prepare(`SELECT limits_json FROM ${Tables.BILLING_PLANS} WHERE slug = ? AND is_active = 1`)
    .get(planSlug) as { limits_json: string } | undefined;
  if (planRow?.limits_json) {
    Object.assign(base, parseJson<Partial<PlanLimits>>(planRow.limits_json, {}));
  }
  return base;
}

function mergeLimits(plan: PlanLimits, extra: Partial<PlanLimits>): PlanLimits {
  return {
    maxDesigns: Math.max(plan.maxDesigns, extra.maxDesigns ?? plan.maxDesigns),
    maxExports: Math.max(plan.maxExports, extra.maxExports ?? plan.maxExports),
    maxEvents: Math.max(plan.maxEvents, extra.maxEvents ?? plan.maxEvents),
    maxEventProductsPerEvent: Math.max(
      plan.maxEventProductsPerEvent,
      extra.maxEventProductsPerEvent ?? plan.maxEventProductsPerEvent
    ),
    watermark: plan.watermark && (extra.watermark ?? true),
    premiumTemplates: plan.premiumTemplates || Boolean(extra.premiumTemplates),
    highQualityExport: plan.highQualityExport || Boolean(extra.highQualityExport),
    eventBuilder: plan.eventBuilder || Boolean(extra.eventBuilder),
    bulkEventProducts: plan.bulkEventProducts || Boolean(extra.bulkEventProducts),
    brandKit: plan.brandKit || Boolean(extra.brandKit),
    participantLists: plan.participantLists || Boolean(extra.participantLists),
    programBook: plan.programBook || Boolean(extra.programBook),
    fullPackageExport: plan.fullPackageExport || Boolean(extra.fullPackageExport),
  };
}

function toEntitlementSummary(ent: {
  id: string;
  planId: string | null;
  sourceOrderId: string;
  status: string;
  startsAt: string;
  endsAt: string | null;
  features: string[];
}): BillingEntitlementSummary {
  return {
    id: ent.id,
    planId: ent.planId,
    sourceOrderId: ent.sourceOrderId,
    status: ent.status,
    startsAt: ent.startsAt,
    endsAt: ent.endsAt,
    features: ent.features,
  };
}

export function getUserPlan(userId: string): { slug: string; name: string; limits: PlanLimits } {
  const user = userService.getUserById(userId);
  if (!user) throw new Error("NOT_FOUND");
  const slug = user.plan || "free";
  const planRow = getDb()
    .prepare(`SELECT * FROM ${Tables.BILLING_PLANS} WHERE slug = ? AND is_active = 1`)
    .get(slug);
  const name = planRow ? (planRow as { name: string }).name : slug;
  let limits = resolveLimits(slug);
  const entitlement = getActiveEntitlement(userId);
  if (entitlement?.status === "ACTIVE") {
    limits = mergeLimits(limits, entitlement.limits);
  }
  return { slug, name, limits };
}

export function syncUsageCounts(userId: string): UsageSnapshot {
  const db = getDb();
  const designsCount = (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM ${Tables.DESIGN_DRAFTS} WHERE user_id = ? AND deleted_at IS NULL`
      )
      .get(userId) as { c: number }
  ).c;
  const exportsCount = (
    db
      .prepare(`SELECT COUNT(*) as c FROM ${Tables.EXPORT_FILES} WHERE user_id = ?`)
      .get(userId) as { c: number }
  ).c;
  const eventsCount = (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM ${Tables.EVENTS} WHERE user_id = ? AND deleted_at IS NULL`
      )
      .get(userId) as { c: number }
  ).c;

  const periodIso = currentPeriodStart();
  const ts = new Date().toISOString();
  const existing = db
    .prepare(`SELECT period_start FROM ${Tables.USER_USAGE} WHERE user_id = ?`)
    .get(userId) as { period_start: string } | undefined;

  db.prepare(
    `INSERT INTO ${Tables.USER_USAGE} (user_id, designs_count, exports_count, events_count, period_start, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       designs_count = excluded.designs_count,
       exports_count = excluded.exports_count,
       events_count = excluded.events_count,
       updated_at = excluded.updated_at`
  ).run(
    userId,
    designsCount,
    exportsCount,
    eventsCount,
    existing?.period_start ?? periodIso,
    ts
  );

  const row = db
    .prepare(`SELECT * FROM ${Tables.USER_USAGE} WHERE user_id = ?`)
    .get(userId) as Record<string, unknown>;

  return {
    designsCount,
    exportsCount,
    eventsCount,
    periodStart: (row?.period_start as string) ?? periodIso,
  };
}

function percentUsed(used: number, max: number): number {
  if (max <= 0) return 100;
  return Math.min(100, Math.round((used / max) * 100));
}

function buildAccessFlags(limits: PlanLimits, remaining: BillingMeResponse["remaining"]) {
  return {
    canCreateDesign: remaining.designs > 0,
    canCreateEvent: remaining.events > 0,
    canExport: remaining.exports > 0,
    canUsePremiumTemplate: limits.premiumTemplates,
    watermarkRequired: limits.watermark,
    canUseEventBuilder: limits.eventBuilder,
    canUseBulkEventProducts: limits.bulkEventProducts,
    canUseBrandKit: limits.brandKit,
    canUseParticipantLists: limits.participantLists,
    canUseProgramBook: limits.programBook,
    canUseFullPackageExport: limits.fullPackageExport,
    highQualityExport: limits.highQualityExport,
  };
}

export function getBillingMe(userId: string): BillingMeResponse {
  const { slug, name, limits } = getUserPlan(userId);
  const usage = syncUsageCounts(userId);
  const entitlement = getActiveEntitlement(userId);

  const remaining = {
    designs: Math.max(0, limits.maxDesigns - usage.designsCount),
    exports: Math.max(0, limits.maxExports - usage.exportsCount),
    events: Math.max(0, limits.maxEvents - usage.eventsCount),
  };

  return {
    currentPlan: { slug, name },
    activeEntitlement:
      entitlement?.status === "ACTIVE" ? toEntitlementSummary(entitlement) : null,
    limits,
    usage,
    remaining,
    ...buildAccessFlags(limits, remaining),
  };
}

export function getCapabilities(userId: string): PlanCapabilities {
  const me = getBillingMe(userId);
  return {
    plan: me.currentPlan.slug,
    planName: me.currentPlan.name,
    limits: me.limits,
    usage: me.usage,
    remaining: me.remaining,
    canCreateDesign: me.canCreateDesign,
    canCreateEvent: me.canCreateEvent,
    canExport: me.canExport,
    canAccessPremiumTemplates: me.canUsePremiumTemplate,
    requiresWatermark: me.watermarkRequired,
    premiumTemplates: me.canUsePremiumTemplate,
    watermark: me.watermarkRequired,
  };
}

export function getUsageSummary(userId: string): UsageDashboardSummary {
  const me = getBillingMe(userId);
  return {
    plan: me.currentPlan.slug,
    planName: me.currentPlan.name,
    usage: me.usage,
    limits: me.limits,
    remaining: me.remaining,
    percentUsed: {
      designs: percentUsed(me.usage.designsCount, me.limits.maxDesigns),
      exports: percentUsed(me.usage.exportsCount, me.limits.maxExports),
      events: percentUsed(me.usage.eventsCount, me.limits.maxEvents),
    },
    capabilities: {
      canCreateDesign: me.canCreateDesign,
      canCreateEvent: me.canCreateEvent,
      canExport: me.canExport,
      canAccessPremiumTemplates: me.canUsePremiumTemplate,
      requiresWatermark: me.watermarkRequired,
    },
  };
}

export function canAccessPremiumTemplate(userId: string): boolean {
  return getBillingMe(userId).canUsePremiumTemplate;
}

export function assertCanAccessPremiumTemplate(userId: string): void {
  if (!canAccessPremiumTemplate(userId)) {
    throw new Error("PLAN_PREMIUM_REQUIRED");
  }
}

export function checkExportAllowed(userId: string): {
  allowed: boolean;
  code?: string;
  message?: string;
} {
  const me = getBillingMe(userId);
  if (!me.canExport) {
    return {
      allowed: false,
      code: "PLAN_LIMIT_EXPORTS",
      message: "Export limit reached for your plan. Upgrade to export more.",
    };
  }
  return { allowed: true };
}

export function assertCanExport(userId: string): void {
  const check = checkExportAllowed(userId);
  if (!check.allowed) throw new Error("PLAN_LIMIT_EXPORTS");
}

export function assertCanCreateDesign(userId: string): void {
  if (!getBillingMe(userId).canCreateDesign) {
    throw new Error("PLAN_LIMIT_DESIGNS");
  }
}

export function assertCanCreateEvent(userId: string): void {
  if (!getBillingMe(userId).canCreateEvent) {
    throw new Error("PLAN_LIMIT_EVENTS");
  }
}

export function assertCanUseEventBuilder(userId: string): void {
  if (!getBillingMe(userId).canUseEventBuilder) {
    throw new Error("PLAN_EVENT_BUILDER_REQUIRED");
  }
}

export function assertCanAddEventProduct(userId: string, eventId: string): void {
  const me = getBillingMe(userId);
  if (me.limits.bulkEventProducts) return;
  const count = (
    getDb()
      .prepare(`SELECT COUNT(*) as c FROM ${Tables.EVENT_PRODUCTS} WHERE event_id = ?`)
      .get(eventId) as { c: number }
  ).c;
  if (count >= me.limits.maxEventProductsPerEvent) {
    throw new Error("PLAN_LIMIT_EVENT_PRODUCTS");
  }
}

export function assertCanUseBrandKit(userId: string): void {
  if (!getBillingMe(userId).canUseBrandKit) {
    throw new Error("PLAN_BRAND_KIT_REQUIRED");
  }
}

export function assertCanUseFullPackageExport(userId: string): void {
  if (!getBillingMe(userId).canUseFullPackageExport) {
    throw new Error("PLAN_FULL_PACKAGE_EXPORT_REQUIRED");
  }
}

export function listPlansFromDb() {
  const rows = getDb()
    .prepare(`SELECT * FROM ${Tables.BILLING_PLANS} WHERE is_active = 1 ORDER BY price_monthly ASC`)
    .all();
  return rows.map((r) => mapBillingPlan(r as Record<string, unknown>));
}
