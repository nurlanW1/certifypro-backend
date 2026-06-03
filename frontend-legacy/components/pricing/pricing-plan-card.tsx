import { Check } from "lucide-react"

import { LinkButton } from "@/components/ui/button"
import { BadgeChip } from "@/components/ui/badge"
import type { PricingPlan } from "@/lib/constants/support"
import { cn } from "@/lib/utils"

export function PricingPlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow md:p-8",
        plan.highlighted
          ? "border-primary shadow-[var(--shadow-glow)] ring-1 ring-primary/20"
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
        <span className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {plan.price}
        </span>
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

      <LinkButton
        href={plan.href}
        variant={plan.highlighted ? "brand" : "outline"}
        className="mt-8 w-full justify-center"
      >
        {plan.cta}
      </LinkButton>
    </article>
  )
}
