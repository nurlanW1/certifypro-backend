import { CheckoutForm } from "@/components/billing/checkout-form";
import { SupportPageHero } from "@/components/support/support-page-hero";
import { LandingContainer, LandingSection } from "@/components/marketing/home/landing-primitives";

type Props = { searchParams: Promise<{ plan?: string }> };

export default async function BillingCheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  const planKey = params.plan ?? "pro-monthly";

  return (
    <>
      <SupportPageHero
        eyebrow="To‘lov"
        title="Checkout"
        description="Tanlangan tarif uchun to‘lov usulini tanlang va tasdiqlang."
      />
      <LandingSection className="py-10 md:py-14">
        <LandingContainer>
          <div className="mx-auto max-w-lg">
            <CheckoutForm planKey={planKey} />
          </div>
        </LandingContainer>
      </LandingSection>
    </>
  );
}
