"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminForceOrderPaid,
  getAdminWebhook,
  listAdminOrders,
  listAdminTransactions,
  listAdminWebhooks,
  markWebhookReviewed,
  type AdminOrder,
  type AdminTransaction,
  type AdminWebhookLog,
  type ListMeta,
} from "@/lib/api/admin-payments";
import { getErrorMessage } from "@/lib/api/errors";
import { formatUzs } from "@/lib/billing/catalog";

type Tab = "orders" | "transactions" | "webhooks";

const PROVIDERS = ["", "CLICK", "PAYME", "UZUM", "PAYNET"] as const;
const ORDER_STATUSES = ["", "PENDING", "PAID", "FAILED", "CANCELLED", "EXPIRED"] as const;
const TXN_STATUSES = ["", "CREATED", "PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"] as const;

function formatDt(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("uz-UZ");
}

function StatusPill({ value }: { value: string }) {
  const tone =
    value === "PAID"
      ? "bg-emerald-100 text-emerald-800"
      : value === "PENDING" || value === "CREATED"
        ? "bg-amber-100 text-amber-800"
        : value === "FAILED" || value === "CANCELLED"
          ? "bg-red-100 text-red-800"
          : "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${tone}`}>
      {value}
    </span>
  );
}

export function AdminPaymentsPanel() {
  const [tab, setTab] = useState<Tab>("orders");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ListMeta | undefined>();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [webhooks, setWebhooks] = useState<AdminWebhookLog[]>([]);

  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState("");
  const [reviewed, setReviewed] = useState("");
  const [page, setPage] = useState(1);

  const [selectedWebhook, setSelectedWebhook] = useState<AdminWebhookLog | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [forceOrderId, setForceOrderId] = useState("");
  const [forceReason, setForceReason] = useState("");
  const [forceConfirm, setForceConfirm] = useState(false);
  const [forceRepeat, setForceRepeat] = useState(false);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (tab === "orders") {
        const res = await listAdminOrders({
          page,
          limit: 20,
          q: search || undefined,
          provider: provider || undefined,
          status: status || undefined,
        });
        setOrders(res.items);
        setMeta(res.meta);
      } else if (tab === "transactions") {
        const res = await listAdminTransactions({
          page,
          limit: 20,
          provider: provider || undefined,
          status: status || undefined,
        });
        setTransactions(res.items);
        setMeta(res.meta);
      } else {
        const res = await listAdminWebhooks({
          page,
          limit: 20,
          provider: provider || undefined,
          status: status || undefined,
          reviewed: (reviewed as "true" | "false") || undefined,
        });
        setWebhooks(res.items);
        setMeta(res.meta);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [tab, page, search, provider, status, reviewed]);

  useEffect(() => {
    void load();
  }, [load]);

  const openWebhook = async (id: string) => {
    try {
      const log = await getAdminWebhook(id);
      setSelectedWebhook(log);
      setReviewNote(log.reviewNote ?? "");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleMarkReviewed = async () => {
    if (!selectedWebhook) return;
    setActing(true);
    try {
      const updated = await markWebhookReviewed(selectedWebhook.id, reviewNote || undefined);
      setSelectedWebhook(updated);
      toast.success("Webhook ko‘rib chiqilgan deb belgilandi");
      void load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActing(false);
    }
  };

  const handleForcePaid = async () => {
    if (!forceOrderId.trim()) {
      toast.error("Buyurtma ID kiriting");
      return;
    }
    if (!forceConfirm) {
      toast.error("Tasdiqlash belgisini yoqing");
      return;
    }
    if (forceReason.trim().length < 10) {
      toast.error("Sabab kamida 10 belgidan iborat bo‘lishi kerak");
      return;
    }
    setActing(true);
    try {
      await adminForceOrderPaid(forceOrderId.trim(), {
        confirm: true,
        reason: forceReason.trim(),
        confirmRepeat: forceRepeat,
      });
      toast.success("Buyurtma PAID qilindi (audit jurnalga yozildi)");
      setForceOrderId("");
      setForceReason("");
      setForceConfirm(false);
      void load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActing(false);
    }
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    setPage(1);
    setStatus("");
    setProvider("");
    setReviewed("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {(["orders", "transactions", "webhooks"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {t === "orders" ? "Buyurtmalar" : t === "transactions" ? "Tranzaksiyalar" : "Webhooklar"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {tab === "orders" ? (
          <div className="min-w-[200px] flex-1">
            <label className="text-xs font-medium text-muted-foreground">Qidiruv</label>
            <div className="relative mt-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="ID, email, nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (setPage(1), void load())}
              />
            </div>
          </div>
        ) : null}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Provider</label>
          <select
            className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              setPage(1);
            }}
          >
            {PROVIDERS.map((p) => (
              <option key={p || "all"} value={p}>
                {p || "Barchasi"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <select
            className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {(tab === "transactions" ? TXN_STATUSES : ORDER_STATUSES).map((s) => (
              <option key={s || "all"} value={s}>
                {s || "Barchasi"}
              </option>
            ))}
          </select>
        </div>
        {tab === "webhooks" ? (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Reviewed</label>
            <select
              className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={reviewed}
              onChange={(e) => {
                setReviewed(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Barchasi</option>
              <option value="false">Ko‘rib chiqilmagan</option>
              <option value="true">Ko‘rib chiqilgan</option>
            </select>
          </div>
        ) : null}
        <Button size="sm" onClick={() => void load()}>
          Qo‘llash
        </Button>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          {tab === "orders" ? (
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Provider</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Paid</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/60 hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                    <td className="px-3 py-2">
                      <p className="font-medium">{o.user.name}</p>
                      <p className="text-xs text-muted-foreground">{o.user.email}</p>
                    </td>
                    <td className="px-3 py-2">{o.paymentProvider ?? "—"}</td>
                    <td className="px-3 py-2">
                      <StatusPill value={o.status} />
                      {o.transactionStatus ? (
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{o.transactionStatus}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">{formatUzs(o.amount)}</td>
                    <td className="px-3 py-2 text-xs">{formatDt(o.createdAt)}</td>
                    <td className="px-3 py-2 text-xs">{formatDt(o.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === "transactions" ? (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Txn</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Provider</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Paid</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono text-xs">{t.id}</td>
                    <td className="px-3 py-2 font-mono text-xs">{t.orderId}</td>
                    <td className="px-3 py-2">
                      <p className="font-medium">{t.user.name}</p>
                      <p className="text-xs text-muted-foreground">{t.user.email}</p>
                    </td>
                    <td className="px-3 py-2">{t.provider}</td>
                    <td className="px-3 py-2">
                      <StatusPill value={t.status} />
                    </td>
                    <td className="px-3 py-2">{formatUzs(t.amount)}</td>
                    <td className="px-3 py-2 text-xs">{formatDt(t.createdAt)}</td>
                    <td className="px-3 py-2 text-xs">{formatDt(t.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === "webhooks" ? (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Provider</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Reviewed</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {webhooks.map((w) => (
                  <tr key={w.id} className="border-b border-border/60 hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono text-xs">{w.id}</td>
                    <td className="px-3 py-2">{w.provider}</td>
                    <td className="px-3 py-2">
                      <StatusPill value={w.status} />
                    </td>
                    <td className="px-3 py-2">{w.reviewed ? "Ha" : "Yo‘q"}</td>
                    <td className="px-3 py-2 text-xs">{formatDt(w.createdAt)}</td>
                    <td className="px-3 py-2">
                      <Button size="sm" variant="outline" onClick={() => void openWebhook(w.id)}>
                        Raw
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      )}

      {meta && meta.totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {meta.page} / {meta.totalPages} · {meta.total} ta
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Oldingi
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Keyingi
            </Button>
          </div>
        </div>
      ) : null}

      {selectedWebhook ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Webhook log — {selectedWebhook.id}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedWebhook.provider} · {selectedWebhook.status} · {formatDt(selectedWebhook.createdAt)}
            </p>
            {selectedWebhook.errorMessage ? (
              <p className="mt-2 text-sm text-red-600">{selectedWebhook.errorMessage}</p>
            ) : null}
            <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(selectedWebhook.rawPayload, null, 2)}
            </pre>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">Headers</summary>
              <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs">
                {JSON.stringify(selectedWebhook.headers, null, 2)}
              </pre>
            </details>
            <label className="mt-4 block text-xs font-medium text-muted-foreground">Review note</label>
            <Input
              className="mt-1"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              disabled={Boolean(selectedWebhook.reviewedAt)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {!selectedWebhook.reviewedAt ? (
                <Button size="sm" disabled={acting} onClick={() => void handleMarkReviewed()}>
                  Ko‘rib chiqilgan deb belgilash
                </Button>
              ) : (
                <p className="text-sm text-emerald-600">
                  Ko‘rib chiqilgan: {formatDt(selectedWebhook.reviewedAt)}
                </p>
              )}
              <Button size="sm" variant="outline" onClick={() => setSelectedWebhook(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
        <h3 className="text-sm font-semibold text-amber-900">Admin override (faqat zaruratda)</h3>
        <p className="mt-1 text-xs text-amber-800">
          To‘lovni qo‘lda PAID qilish faqat tasdiqlangan holda va sabab bilan. Har bir harakat audit jurnaliga yoziladi.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <Input
            placeholder="Order ID"
            value={forceOrderId}
            onChange={(e) => setForceOrderId(e.target.value)}
          />
          <Input
            placeholder="Sabab (min 10 belgi)"
            value={forceReason}
            onChange={(e) => setForceReason(e.target.value)}
          />
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={forceConfirm}
            onChange={(e) => setForceConfirm(e.target.checked)}
          />
          Men tasdiqlayman — bu qo‘lda to‘lovni faollashtirish
        </label>
        <label className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={forceRepeat}
            onChange={(e) => setForceRepeat(e.target.checked)}
          />
          Allaqachon PAID bo‘lsa ham qayta yozish (confirmRepeat)
        </label>
        <Button
          className="mt-3"
          size="sm"
          variant="destructive"
          disabled={acting || !forceConfirm}
          onClick={() => void handleForcePaid()}
        >
          Force PAID (audit)
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        <Link href="/admin" className="text-primary hover:underline">
          Admin bosh sahifa
        </Link>
      </p>
    </div>
  );
}
