import type { Metadata } from "next"

import { FaqPageContent } from "@/components/faq/faq-page-content"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Gildia haqida tez-tez so‘raladigan savollar — dizayn, tadbir paketi, eksport va pullik rejalar.",
}

export default function FaqPage() {
  return <FaqPageContent />
}
