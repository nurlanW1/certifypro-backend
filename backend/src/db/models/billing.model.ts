export interface PlanLimits {
  maxDesigns: number;
  maxExports: number;
  maxEvents: number;
  /** Max enabled products per event (when bulkEventProducts is false). */
  maxEventProductsPerEvent: number;
  watermark: boolean;
  premiumTemplates: boolean;
  highQualityExport: boolean;
  eventBuilder: boolean;
  bulkEventProducts: boolean;
  brandKit: boolean;
  participantLists: boolean;
  programBook: boolean;
  fullPackageExport: boolean;
}

export interface BillingPlan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  currency: string;
  features: string[];
  limits: PlanLimits;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsageSnapshot {
  designsCount: number;
  exportsCount: number;
  eventsCount: number;
  periodStart: string;
}

export type BillingEntitlementSummary = {
  id: string;
  planId: string | null;
  sourceOrderId: string;
  status: string;
  startsAt: string;
  endsAt: string | null;
  features: string[];
};

export interface BillingMeResponse {
  currentPlan: {
    slug: string;
    name: string;
  };
  activeEntitlement: BillingEntitlementSummary | null;
  limits: PlanLimits;
  usage: UsageSnapshot;
  remaining: {
    designs: number;
    exports: number;
    events: number;
  };
  canCreateDesign: boolean;
  canCreateEvent: boolean;
  canExport: boolean;
  canUsePremiumTemplate: boolean;
  watermarkRequired: boolean;
  canUseEventBuilder: boolean;
  canUseBulkEventProducts: boolean;
  canUseBrandKit: boolean;
  canUseParticipantLists: boolean;
  canUseProgramBook: boolean;
  canUseFullPackageExport: boolean;
  highQualityExport: boolean;
}

/** @deprecated Use BillingMeResponse — kept for internal helpers */
export interface PlanCapabilities {
  plan: string;
  planName: string;
  limits: PlanLimits;
  usage: UsageSnapshot;
  remaining: {
    designs: number;
    exports: number;
    events: number;
  };
  canCreateDesign: boolean;
  canCreateEvent: boolean;
  canExport: boolean;
  canAccessPremiumTemplates: boolean;
  requiresWatermark: boolean;
  premiumTemplates: boolean;
  watermark: boolean;
}

export interface UsageDashboardSummary {
  plan: string;
  planName: string;
  usage: UsageSnapshot;
  limits: PlanLimits;
  remaining: {
    designs: number;
    exports: number;
    events: number;
  };
  percentUsed: {
    designs: number;
    exports: number;
    events: number;
  };
  capabilities: {
    canCreateDesign: boolean;
    canCreateEvent: boolean;
    canExport: boolean;
    canAccessPremiumTemplates: boolean;
    requiresWatermark: boolean;
  };
}
