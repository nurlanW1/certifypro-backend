import { HomeHero } from "@/components/marketing/home/home-hero"
import { HomeTrustBar } from "@/components/marketing/home/home-trust-bar"
import { HomeFeatures } from "@/components/marketing/home/home-features"
import { HomeTwoModes } from "@/components/marketing/home/home-two-modes"
import { HomeCatalogPreview } from "@/components/marketing/home/home-catalog-preview"
import { HomeHowItWorks } from "@/components/marketing/home/home-how-it-works"
import { HomeStats } from "@/components/marketing/home/home-stats"
import { HomeDashboardPreview } from "@/components/marketing/home/home-dashboard-preview"
import { HomePricingCta } from "@/components/marketing/home/home-pricing-cta"
import { HomeFaqPreview } from "@/components/marketing/home/home-faq-preview"
import { HomeContactCta } from "@/components/marketing/home/home-contact-cta"

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeTrustBar />
      <HomeFeatures />
      <HomeTwoModes />
      <HomeCatalogPreview />
      <HomeHowItWorks />
      <HomeStats />
      <HomeDashboardPreview />
      <HomePricingCta />
      <HomeFaqPreview />
      <HomeContactCta />
    </>
  )
}
