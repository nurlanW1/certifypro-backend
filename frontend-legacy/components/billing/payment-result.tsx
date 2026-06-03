"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { BillingStatusBadge } from "@/components/billing/billing-status-badge";
import { LinkButton } from "@/components/ui/button";
import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { getBillingMe, getOrderStatus } from "@/lib/api/billing";
import { invalidateBillingCache } from "@/lib/billing/access";
import { getErrorMessage } from "@/lib/api/errors";
import { isAuthenticated } from "@/lib/auth/session";
import { formatUzs } from "@/lib/billing/catalog";

type ResultMode = "success" | "failed";

export function PaymentResult({ mode }: { mode: ResultMode }) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [planSlug, setPlanSlug] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Buyurtma identifikatori topilmadi.");
      return;
    }

    if (!isAuthenticated()) {
      setLoading(false);
      setError("Holatni ko‘rish uchun tizimga kiring.");
      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const statusRes = await getOrderStatus(orderId);
        if (cancelled) return;

        setOrderStatus(statusRes.order.status);
        setAmount(statusRes.order.amount);

        const paid = statusRes.order.status === "PAID";
        if (paid) {
          invalidateBillingCache();
          const me = await getBillingMe().catch(() => null);
          if (me?.currentPlan?.slug) setPlanSlug(me.currentPlan.slug);
        }
        const failed =
          statusRes.order.status === "FAILED" ||
          statusRes.order.status === "CANCELLED" ||
          statusRes.order.status === "EXPIRED";

        if (paid || failed || mode === "failed") {
          setLoading(false);
          return;
        }

        setTimeout(() => void poll(), 2500);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
          setLoading(false);
        }
      }
    }

    void poll();
    return () => {
      cancelled = true;
    };
  }, [orderId, mode]);

  const isPaid = orderStatus === "PAID";
  const isFailed =
    mode === "failed" ||
    orderStatus === "FAILED" ||
    orderStatus === "CANCELLED" ||
    orderStatus === "EXPIRED";

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">To‘lov holati tekshirilmoqda…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <AuthStatusAlert variant="error" title="Xatolik" message={error} />
        <LinkButton href="/billing/history" variant="outline">
          To‘lov tarixiga
        </LinkButton>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="space-y-6 text-center">
        <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">To‘lov muvaffaqiyatli</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Rejangiz faollashtirildi. Endi premium imkoniyatlardan foydalanishingiz mumkin.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-left text-sm">
          <p>
            <span className="text-muted-foreground">Buyurtma: </span>
            <span className="font-mono text-foreground">{orderId}</span>
          </p>
          {amount !== null ? (
            <p className="mt-2">
              <span className="text-muted-foreground">Summa: </span>
              <span className="font-semibold">{formatUzs(amount)} UZS</span>
            </p>
          ) : null}
          {planSlug ? (
            <p className="mt-2">
              <span className="text-muted-foreground">Faol reja: </span>
              <span className="font-semibold capitalize">{planSlug.replace(/_/g, " ")}</span>
            </p>
          ) : null}
          {orderStatus ? (
            <p className="mt-3">
              <BillingStatusBadge status={orderStatus} />
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <LinkButton href="/account/plan" variant="brand">
            Rejamni ko‘rish
          </LinkButton>
          <LinkButton href="/dashboard" variant="outline">
            Dashboard
          </LinkButton>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="space-y-6 text-center">
        <XCircle className="mx-auto size-14 text-destructive" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">To‘lov amalga oshmadi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            To‘lov bekor qilindi yoki tasdiqlanmadi. Qayta urinib ko‘ring yoki boshqa provayderni tanlang.
          </p>
        </div>
        {orderStatus ? (
          <div>
            <BillingStatusBadge status={orderStatus} />
          </div>
        ) : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <LinkButton href="/pricing" variant="brand">
            Tariflarga qaytish
          </LinkButton>
          <Link href="/billing/history" className="text-sm font-medium text-primary hover:underline">
            To‘lov tarixi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-muted-foreground">
        To‘lov hali tasdiqlanmagan. Bir necha daqiqadan so‘ng qayta tekshiring.
      </p>
      <LinkButton href={`/billing/success?order_id=${encodeURIComponent(orderId)}`} variant="outline">
        Qayta tekshirish
      </LinkButton>
    </div>
  );
}
