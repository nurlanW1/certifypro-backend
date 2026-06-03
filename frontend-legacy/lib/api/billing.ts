import { apiRequest } from "./client";
import { authHeaders } from "@/lib/auth/session";
import type { PaymentProviderId } from "@/lib/billing/catalog";

export type BillingPlan = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  description: string | null;
  features: string[];
  isActive: boolean;
};

export type PlanLimits = {
  maxDesigns: number;
  maxExports: number;
  maxEvents: number;
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
};

export type UsageSnapshot = {
  designsCount: number;
  exportsCount: number;
  eventsCount: number;
  periodStart: string;
};

export type BillingEntitlementSummary = {
  id: string;
  planId: string | null;
  sourceOrderId: string;
  status: string;
  startsAt: string;
  endsAt: string | null;
  features: string[];
};

export type BillingMe = {
  currentPlan: { slug: string; name: string };
  activeEntitlement: BillingEntitlementSummary | null;
  limits: PlanLimits;
  usage: UsageSnapshot;
  remaining: { designs: number; exports: number; events: number };
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
};

/** @deprecated Use BillingMe */
export type Capabilities = {
  plan: { slug: string; name: string };
  canCreateDesign: boolean;
  canCreateEvent: boolean;
  canExport: boolean;
  canAccessPremiumTemplates: boolean;
  requiresWatermark: boolean;
};

export type CreateOrderInput = {
  type: "PLAN" | "EVENT_PACKAGE";
  planSlug?: string;
  planId?: string;
  description?: string;
};

export type InitiatePaymentResult = {
  order: Order;
  transaction: PaymentTransaction;
  paymentUrl: string | null;
  instructions: string;
  provider: string;
  providerReady?: boolean;
  integrationStatus?: string;
};

export type Order = {
  id: string;
  userId: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  description: string | null;
  planId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentTransaction = {
  id: string;
  orderId: string;
  provider: string;
  status: string;
  providerTransactionId: string | null;
  amount: number;
  currency: string;
  paidAt: string | null;
  createdAt: string;
};

export type OrderStatusResult = {
  order: Order;
  transactions: PaymentTransaction[];
  latest: PaymentTransaction | null;
};

export type PaymentHistoryItem = {
  order: Order;
  transactions: PaymentTransaction[];
};

type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function authJson<T>(path: string, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers as Record<string, string>) },
  });
}

export async function listBillingPlans(): Promise<BillingPlan[]> {
  const data = await apiRequest<{ items: BillingPlan[] }>("/api/billing/plans");
  return data.items ?? [];
}

export async function getBillingMe(): Promise<BillingMe> {
  return authJson<BillingMe>("/api/billing/me");
}

/** @deprecated Use getBillingMe */
export async function getBillingCapabilities(): Promise<Capabilities> {
  const me = await getBillingMe();
  return {
    plan: me.currentPlan,
    canCreateDesign: me.canCreateDesign,
    canCreateEvent: me.canCreateEvent,
    canExport: me.canExport,
    canAccessPremiumTemplates: me.canUsePremiumTemplate,
    requiresWatermark: me.watermarkRequired,
  };
}

export async function createBillingOrder(input: CreateOrderInput): Promise<Order> {
  return authJson<Order>("/api/billing/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getOrderStatus(orderId: string): Promise<OrderStatusResult> {
  return authJson<OrderStatusResult>(`/api/billing/status/${encodeURIComponent(orderId)}`);
}

export async function getPaymentHistory(params?: {
  page?: number;
  limit?: number;
}): Promise<{ items: PaymentHistoryItem[]; meta?: ListMeta }> {
  const query: Record<string, string | number> = {};
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  const raw = await apiRequest<{
    items?: PaymentHistoryItem[];
    meta?: ListMeta;
  }>("/api/billing/history", {
    headers: authHeaders(),
    query,
  });

  const items = raw.items ?? [];
  return { items, meta: raw.meta };
}

export async function initiateProviderPayment(
  provider: PaymentProviderId,
  orderId: string,
  returnUrl: string
): Promise<InitiatePaymentResult> {
  const path = `/api/payments/${provider}/create`;
  return authJson<InitiatePaymentResult>(path, {
    method: "POST",
    body: JSON.stringify({ orderId, returnUrl }),
  });
}
