"use client";

import { Check } from "lucide-react";

import { LinkButton } from "@/components/ui/button";
import { BadgeChip } from "@/components/ui/badge";
import { BILLING_CATALOG } from "@/lib/billing/catalog";
import { cn } from "@/lib/utils";

export function PricingCatalog() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {BILLING_CATALOG.map((plan) => (
        <article
          key={plan.id}
          className={cn(
            "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow",
            plan.highlighted
              ? "border-primary shadow-[var(--shadow-glow)] ring-1 ring-primary/20 md:col-span-2 xl:col-span-1"
              : "border-border hover:border-primary/25 hover:shadow-md"
          )}
        >
          {plan.badge ? (
            <BadgeChip variant="premium" className="mb-3 w-fit text-[10px]">
              {plan.badge}
            </BadgeChip>
          ) : null}

          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{plan.tagline}</p>
          <h3 className="mt-1 text-xl font-bold text-foreground">{plan.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">{plan.priceLabel}</span>
            <span className="text-sm text-muted-foreground">{plan.period}</span>
          </div>

          <ul className="mt-6 flex-1 space-y-2.5">
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <PlanCta planId={plan.id} checkoutKey={plan.checkout?.queryKey} highlighted={plan.highlighted} />
        </article>
      ))}
    </div>
  );
}

function PlanCta({
  planId,
  checkoutKey,
  highlighted,
}: {
  planId: string;
  checkoutKey?: string;
  highlighted?: boolean;
}) {
  if (planId === "free") {
    return (
      <LinkButton href="/register" variant="outline" className="mt-8 w-full justify-center">
        Bepul boshlash
      </LinkButton>
    );
  }

  if (planId === "enterprise") {
    return (
      <LinkButton href="/contact#business" variant="outline" className="mt-8 w-full justify-center">
        Bog‘lanish
      </LinkButton>
    );
  }

  const key = checkoutKey ?? planId;
  return (
    <LinkButton
      href={`/billing/checkout?plan=${encodeURIComponent(key)}`}
      variant={highlighted ? "brand" : "outline"}
      className="mt-8 w-full justify-center"
    >
      To‘lovga o‘tish
    </LinkButton>
  );
}
