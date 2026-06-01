import { Suspense } from "react";

import { PaymentResult } from "@/components/billing/payment-result";
import { LandingContainer, LandingSection } from "@/components/marketing/home/landing-primitives";

export default function BillingSuccessPage() {
  return (
    <LandingSection className="py-12 md:py-20">
      <LandingContainer>
        <div className="mx-auto max-w-lg">
          <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Yuklanmoqda…</p>}>
            <PaymentResult mode="success" />
          </Suspense>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
