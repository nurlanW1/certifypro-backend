"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { BillingStatusBadge } from "@/components/billing/billing-status-badge";
import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { LinkButton } from "@/components/ui/button";
import { getPaymentHistory, type PaymentHistoryItem } from "@/lib/api/billing";
import { getErrorMessage } from "@/lib/api/errors";
import { formatUzs } from "@/lib/billing/catalog";

export function BillingHistoryTable() {
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getPaymentHistory({ limit: 50 });
        if (!cancelled) setItems(res.items);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <AuthStatusAlert
        variant="error"
        title="Tarix yuklanmadi"
        message={error}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">Hali to‘lovlar yo‘q.</p>
        <LinkButton href="/pricing" className="mt-4" variant="brand" size="sm">
          Tarif tanlash
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-semibold">Sana</th>
            <th className="px-4 py-3 font-semibold">Tavsif</th>
            <th className="px-4 py-3 font-semibold">Summa</th>
            <th className="px-4 py-3 font-semibold">Holat</th>
            <th className="px-4 py-3 font-semibold">Provayder</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ order, transactions }) => {
            const latest = transactions[0];
            return (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("uz-UZ")}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">
                    {order.description ?? order.type}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                </td>
                <td className="px-4 py-3 font-semibold">
                  {formatUzs(order.amount)} {order.currency}
                </td>
                <td className="px-4 py-3">
                  <BillingStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {latest?.provider ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
