import Link from "next/link"

import {
  LandingContainer,
  LandingEyebrow,
  LandingHeading,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = [
  {
    q: "Gildia.uz nima uchun mo‘ljallangan?",
    a: "Konferensiya, seminar, forum va boshqa rasmiy tadbirlar uchun sertifikat, bejik, taklifnoma, roll-up va boshqa materiallarni tez yaratish platformasi. Alohida dizayn mahsulotlari ham katalogda mavjud.",
  },
  {
    q: "Create Design va Create Event farqi qanday?",
    a: "Create Design — bitta mahsulot (masalan, faqat sertifikat). Create Event — butun tadbir uchun material to‘plami va workspace, jamoa bilan ishlash imkoniyati.",
  },
  {
    q: "Qoralama qayerda saqlanadi?",
    a: "Hozircha brauzer sessionStorage’da — sahifani yangilasangiz ham ma’lumot saqlanadi. Backend tayyor bo‘lganda bulutga ko‘chiriladi.",
  },
  {
    q: "Legacy editor ishlaydimi?",
    a: "Ha. Editor sahifasida Studio va Legacy tablari mavjud — to‘liq funksional legacy editor iframe orqali ulanadi.",
  },
  {
    q: "Eksport formatlari qanday?",
    a: "PDF va PNG (mahsulot va editor sozlamalariga qarab). Chop etish uchun A4 va maxsus o‘lchamlar qo‘llab-quvvatlanadi.",
  },
]

export function HomeFaqPreview() {
  return (
    <LandingSection id="faq">
      <LandingContainer>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <LandingEyebrow>FAQ</LandingEyebrow>
            <LandingHeading
              align="left"
              title="Ko‘p so‘raladigan savollar"
              description="Javob topilmadimi? Biz bilan bog‘laning — yordam beramiz."
            />
            <div className="flex flex-wrap gap-4">
              <Link
                href="/faq"
                className="inline-flex text-sm font-semibold text-primary hover:underline"
              >
                Barcha savollar →
              </Link>
              <Link
                href="/contact"
                className="inline-flex text-sm font-semibold text-muted-foreground hover:text-primary hover:underline"
              >
                Aloqa
              </Link>
            </div>
          </div>

          <Accordion className="w-full">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
