import { apiRequest } from "./client";
import { authHeaders } from "@/lib/auth/session";

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminUserSummary = {
  id: string;
  name: string;
  email: string;
};

export type AdminOrder = {
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
  user: AdminUserSummary;
  paymentProvider: string | null;
  transactionStatus: string | null;
  paidAt: string | null;
};

export type AdminTransaction = {
  id: string;
  orderId: string;
  userId: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  providerTransactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: AdminUserSummary;
  orderStatus: string;
  orderDescription: string | null;
};

export type AdminWebhookLog = {
  id: string;
  provider: string;
  transactionId: string | null;
  rawPayload: Record<string, unknown>;
  headers: Record<string, unknown>;
  status: string;
  errorMessage: string | null;
  reviewedAt: string | null;
  reviewedByAdminId: string | null;
  reviewNote: string | null;
  createdAt: string;
  reviewed: boolean;
};

function authJson<T>(path: string, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers as Record<string, string>) },
  });
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function listAdminOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  provider?: string;
  q?: string;
}): Promise<{ items: AdminOrder[]; meta?: ListMeta }> {
  const raw = await authJson<{ items: AdminOrder[]; meta?: ListMeta }>(
    `/api/admin/payments/orders${toQuery(params ?? {})}`
  );
  return { items: raw.items ?? [], meta: raw.meta };
}

export async function getAdminOrder(id: string): Promise<{
  order: AdminOrder;
  transactions: AdminTransaction[];
}> {
  return authJson(`/api/admin/payments/orders/${encodeURIComponent(id)}`);
}

export async function listAdminTransactions(params?: {
  page?: number;
  limit?: number;
  status?: string;
  provider?: string;
}): Promise<{ items: AdminTransaction[]; meta?: ListMeta }> {
  const raw = await authJson<{ items: AdminTransaction[]; meta?: ListMeta }>(
    `/api/admin/payments/transactions${toQuery(params ?? {})}`
  );
  return { items: raw.items ?? [], meta: raw.meta };
}

export async function listAdminWebhooks(params?: {
  page?: number;
  limit?: number;
  status?: string;
  provider?: string;
  reviewed?: "true" | "false";
}): Promise<{ items: AdminWebhookLog[]; meta?: ListMeta }> {
  const raw = await authJson<{ items: AdminWebhookLog[]; meta?: ListMeta }>(
    `/api/admin/payments/webhooks${toQuery(params ?? {})}`
  );
  return { items: raw.items ?? [], meta: raw.meta };
}

export async function getAdminWebhook(id: string): Promise<AdminWebhookLog> {
  return authJson(`/api/admin/payments/webhooks/${encodeURIComponent(id)}`);
}

export async function markWebhookReviewed(
  id: string,
  note?: string
): Promise<AdminWebhookLog> {
  return authJson(`/api/admin/payments/webhooks/${encodeURIComponent(id)}/reviewed`, {
    method: "PATCH",
    body: JSON.stringify({ note }),
  });
}

export async function adminForceOrderPaid(
  orderId: string,
  input: { confirm: true; reason: string; confirmRepeat?: boolean }
): Promise<{ order: AdminOrder; message: string }> {
  return authJson(`/api/admin/payments/orders/${encodeURIComponent(orderId)}/force-paid`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
