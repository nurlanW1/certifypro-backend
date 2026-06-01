"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { getBillingMe, type BillingMe } from "@/lib/api/billing";
import { getErrorMessage } from "@/lib/api/errors";

export function AccountPlanPanel() {
  const [billing, setBilling] = useState<BillingMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getBillingMe();
        if (!cancelled) setBilling(data);
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
      <div className="flex justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <AuthStatusAlert
        variant="error"
        title="Reja yuklanmadi"
        message={
          error.includes("401")
            ? "Rejani ko‘rish uchun tizimga kiring."
            : error
        }
      />
    );
  }

  if (!billing) return null;

  const features = [
    { label: "Premium shablonlar", ok: billing.canUsePremiumTemplate },
    { label: "Dizayn yaratish", ok: billing.canCreateDesign },
    { label: "Tadbir yaratish", ok: billing.canCreateEvent },
    { label: "Eksport", ok: billing.canExport },
    { label: "Event builder", ok: billing.canUseEventBuilder },
    { label: "Watermark", ok: billing.watermarkRequired, invert: true },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Joriy reja">
        <p className="text-2xl font-bold capitalize text-foreground">
          {billing.currentPlan.name}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Slug: {billing.currentPlan.slug}</p>
        {billing.activeEntitlement ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Faol entitlement: {billing.activeEntitlement.status}
            {billing.activeEntitlement.endsAt
              ? ` · ${new Date(billing.activeEntitlement.endsAt).toLocaleDateString("uz-UZ")}`
              : ""}
          </p>
        ) : null}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="font-semibold text-foreground">{billing.remaining.designs}</p>
            <p className="text-muted-foreground">dizayn</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="font-semibold text-foreground">{billing.remaining.exports}</p>
            <p className="text-muted-foreground">eksport</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="font-semibold text-foreground">{billing.remaining.events}</p>
            <p className="text-muted-foreground">tadbir</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <LinkButton href="/pricing" size="sm" variant="brand">
            Rejani yangilash
          </LinkButton>
          <LinkButton href="/billing/history" size="sm" variant="outline">
            To‘lov tarixi
          </LinkButton>
        </div>
      </Card>

      <Card title="Imkoniyatlar">
        <ul className="space-y-2 text-sm">
          {features.map((f) => (
            <li key={f.label} className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{f.label}</span>
              <span className={f.invert ? (f.ok ? "text-amber-600" : "text-emerald-600") : f.ok ? "text-emerald-600" : "text-muted-foreground"}>
                {f.invert ? (f.ok ? "Bor" : "Yo‘q") : f.ok ? "Ha" : "Yo‘q"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          <Link href="/dashboard" className="text-primary hover:underline">
            Dashboard
          </Link>
          {" "}orqali limitlardan foydalaning.
        </p>
      </Card>
    </div>
  );
}
