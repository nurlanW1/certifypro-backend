import Link from "next/link"
import { Check } from "lucide-react"

import {
  LandingContainer,
  LandingEyebrow,
  LandingHeading,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"
import { LinkButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    name: "Bepul",
    price: "0",
    period: "boshlash uchun",
    description: "Shablonlar va editor bilan tanishish.",
    features: ["Asosiy shablonlar", "Cheklangan eksport", "Qoralama saqlash"],
    href: "/register",
    cta: "Ro‘yxatdan o‘tish",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Tez orada",
    period: "professional",
    description: "Jamoalar va muntazam tadbirlar uchun.",
    features: ["Barcha mahsulotlar", "Cheksiz eksport", "Bulk generatsiya", "Brend kit"],
    href: "/pricing",
    cta: "Tariflarni ko‘rish",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Maxsus",
    period: "tashkilotlar",
    description: "Katta hajmli tadbirlar va integratsiya.",
    features: ["Maxsus shablonlar", "API / integratsiya", "Qo‘llab-quvvatlash", "SLA"],
    href: "/contact",
    cta: "Bog‘lanish",
    highlighted: false,
  },
]

export function HomePricingCta() {
  return (
    <LandingSection className="bg-muted/20" id="pricing">
      <LandingContainer>
        <div className="mx-auto max-w-3xl text-center">
          <LandingEyebrow className="mx-auto">Tariflar</LandingEyebrow>
          <LandingHeading
            align="center"
            title="O‘sishingizga mos reja"
            description="Hozir bepul boshlang — professional funksiyalar tez orada. Batafsil tariflar sahifasida."
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-card p-8 shadow-sm transition hover:shadow-premium-lg",
                plan.highlighted
                  ? "border-primary/40 shadow-glow ring-2 ring-primary/20"
                  : "border-border/80"
              )}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Tavsiya etiladi
                </span>
              ) : null}
              <p className="text-sm font-semibold text-muted-foreground">{plan.name}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{plan.price}</p>
              <p className="text-xs text-muted-foreground">{plan.period}</p>
              <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <LinkButton
                href={plan.href}
                variant={plan.highlighted ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {plan.cta}
              </LinkButton>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Barcha narxlar va cheklovlar{" "}
          <Link href="/pricing" className="font-semibold text-primary hover:underline">
            tariflar sahifasida
          </Link>
        </p>
      </LandingContainer>
    </LandingSection>
  )
}
