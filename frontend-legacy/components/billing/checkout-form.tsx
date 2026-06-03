"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ProviderSelector } from "@/components/billing/provider-selector";
import { Button } from "@/components/ui/button";
import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import {
  createBillingOrder,
  initiateProviderPayment,
  listBillingPlans,
} from "@/lib/api/billing";
import { getErrorMessage } from "@/lib/api/errors";
import { isAuthenticated } from "@/lib/auth/session";
import {
  findCatalogItem,
  formatUzs,
  type BillingCatalogItem,
  type PaymentProviderId,
} from "@/lib/billing/catalog";
import { APP_URL } from "@/lib/constants/env";

export function CheckoutForm({ planKey }: { planKey: string }) {
  const router = useRouter();
  const catalogItem = useMemo(() => findCatalogItem(planKey), [planKey]);
  const [provider, setProvider] = useState<PaymentProviderId>("click");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  const checkout = catalogItem?.checkout;

  if (!catalogItem || !checkout) {
    return (
      <AuthStatusAlert
        variant="error"
        title="Buyurtma mavjud emas"
        message="Tanlangan tarif uchun onlayn to‘lov mavjud emas."
      />
    );
  }

  const displayAmount = amount ?? null;

  const handlePay = async () => {
    setError(null);
    if (!isAuthenticated()) {
      router.push(`/login?next=${encodeURIComponent(`/billing/checkout?plan=${planKey}`)}`);
      return;
    }

    if (provider === "paynet") {
      setError("Paynet hozircha ulanmagan. Click, Payme yoki Uzum ni tanlang.");
      return;
    }

    setLoading(true);
    try {
      const plans = await listBillingPlans();
      const apiPlan = plans.find((p) => p.slug === checkout.planSlug);
      if (!apiPlan) {
        throw new Error("Tarif serverda topilmadi. Qo‘llab-quvvatlash bilan bog‘laning.");
      }
      setAmount(apiPlan.price);

      const order = await createBillingOrder({
        type: checkout.orderType,
        planSlug: checkout.planSlug,
        description: `${catalogItem.name} — ${catalogItem.tagline}`,
      });

      const returnUrl = `${APP_URL}/billing/success?order_id=${encodeURIComponent(order.id)}`;
      const payment = await initiateProviderPayment(provider, order.id, returnUrl);

      if (payment.integrationStatus === "placeholder" || !payment.paymentUrl) {
        setError(
          payment.instructions ||
            "To‘lov havolasi hozircha mavjud emas. Boshqa provayderni sinab ko‘ring."
        );
        return;
      }

      window.location.href = payment.paymentUrl;
    } catch (err) {
      setError(getErrorMessage(err, "To‘lovni boshlashda xatolik yuz berdi."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <OrderSummary item={catalogItem} amount={displayAmount} />

      <div>
        <h2 className="text-sm font-semibold text-foreground">To‘lov usuli</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          To‘lovlar xavfsiz server orqali qayta ishlanadi. Provayder kalitlari brauzerga uzatilmaydi.
        </p>
        <div className="mt-4">
          <ProviderSelector value={provider} onChange={setProvider} disabled={loading} />
        </div>
      </div>

      {error ? <AuthStatusAlert variant="error" title="To‘lov xatosi" message={error} /> : null}

      <Button
        type="button"
        variant="brand"
        className="w-full"
        disabled={loading}
        onClick={() => void handlePay()}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            To‘lov tayyorlanmoqda…
          </>
        ) : (
          "To‘lash"
        )}
      </Button>
    </div>
  );
}

function OrderSummary({
  item,
  amount,
}: {
  item: BillingCatalogItem;
  amount: number | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{item.tagline}</p>
      <h2 className="mt-1 text-xl font-bold text-foreground">{item.name}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
      <div className="mt-4 flex items-baseline gap-2 border-t border-border pt-4">
        <span className="text-2xl font-bold text-foreground">
          {amount !== null ? formatUzs(amount) : item.priceLabel}
        </span>
        <span className="text-sm text-muted-foreground">
          {amount !== null ? "UZS" : item.period}
        </span>
      </div>
    </div>
  );
}
