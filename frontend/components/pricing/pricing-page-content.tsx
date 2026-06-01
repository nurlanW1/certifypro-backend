import Link from "next/link";
import { HelpCircle } from "lucide-react";

import { PricingCatalog } from "@/components/billing/pricing-catalog";
import { PaymentMethods } from "@/components/pricing/pricing-card";
import { SupportPageHero } from "@/components/support/support-page-hero";
import {
  LandingContainer,
  LandingSection,
} from "@/components/marketing/home/landing-primitives";
import { LinkButton } from "@/components/ui/button";
import { PAYMENT_PROVIDERS } from "@/lib/billing/catalog";

export function PricingPageContent() {
  const providerLabels = PAYMENT_PROVIDERS.map((p) => p.label).join(" • ");

  return (
    <>
      <SupportPageHero
        eyebrow="Tariflar"
        title="O‘sishingizga mos reja tanlang"
        description="Bepul boshlang, Pro (oylik yoki yillik), Event Package yoki Enterprise. Barcha narxlar UZS."
      />

      <LandingSection className="py-12 md:py-16">
        <LandingContainer>
          <PricingCatalog />

          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground">Qaysi reja sizga mos?</h3>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <dt className="font-semibold text-foreground">Bitta dizayn kerak</dt>
                <dd className="mt-1 text-muted-foreground">Free yoki Pro — shablon tanlang va Media Editordan foydalaning.</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Butun tadbir materiallari</dt>
                <dd className="mt-1 text-muted-foreground">Event Package — Event Builder va barcha material turlari.</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Jamoalar va agentliklar</dt>
                <dd className="mt-1 text-muted-foreground">Enterprise — maxsus shartnoma va qo‘llab-quvvatlash.</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Savollar bormi?</dt>
                <dd className="mt-1">
                  <Link href="/faq" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                    <HelpCircle className="size-3.5" />
                    FAQ sahifasini ko‘ring
                  </Link>
                </dd>
              </div>
            </dl>
          </div>

          <PaymentMethods>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              To‘lovlar: {providerLabels}. To‘lovlar server orqali xavfsiz qayta ishlanadi.
            </p>
          </PaymentMethods>

          <div className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
            <LinkButton href="/register" variant="brand">
              Bepul hisob yaratish
            </LinkButton>
            <LinkButton href="/contact#business" variant="outline">
              Enterprise uchun bog‘lanish
            </LinkButton>
          </div>
        </LandingContainer>
      </LandingSection>
    </>
  );
}
