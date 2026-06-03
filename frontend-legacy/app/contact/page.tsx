import type { Metadata } from "next"

import { ContactPageContent } from "@/components/contact/contact-page-content"

export const metadata: Metadata = {
  title: "Aloqa",
  description:
    "Gildia qo‘llab-quvvatlash, biznes murojaatlari va aloqa formasi — support@gildia.uz",
}

export default function ContactPage() {
  return <ContactPageContent />
}
