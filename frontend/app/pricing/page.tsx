import type { Metadata } from "next"

import { PricingPageContent } from "@/components/pricing/pricing-page-content"

export const metadata: Metadata = {
  title: "Tariflar",
  description:
    "Gildia Free, Pro, Event Package va Enterprise tariflari — konferensiya va tadbir materiallari uchun.",
}

export default function PricingPage() {
  return <PricingPageContent />
}
