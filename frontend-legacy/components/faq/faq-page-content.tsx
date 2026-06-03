import Link from "next/link"

import { SupportPageHero } from "@/components/support/support-page-hero"
import {
  LandingContainer,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LinkButton } from "@/components/ui/button"
import { FAQ_ITEMS } from "@/lib/constants/support"

export function FaqPageContent() {
  return (
    <>
      <SupportPageHero
        eyebrow="FAQ"
        title="Tez-tez so‘raladigan savollar"
        description="Gildia platformasi, dizayn yaratish, tadbir paketlari va pullik rejalar haqida javoblar."
      />

      <LandingSection className="py-12 md:py-16">
        <LandingContainer className="max-w-3xl">
          <Accordion className="w-full">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-base font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 text-center md:p-8">
            <h3 className="text-lg font-semibold text-foreground">Javob topa olmadingizmi?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Qo‘llab-quvvatlash jamoamiz yordam beradi yoki tariflarni solishtiring.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <LinkButton href="/contact" variant="brand">
                Bog‘lanish
              </LinkButton>
              <LinkButton href="/pricing" variant="outline">
                Tariflar
              </LinkButton>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              <Link href="/register" className="text-primary hover:underline">
                Bepul hisob yaratish
              </Link>{" "}
              — hoziroq sinab ko‘ring.
            </p>
          </div>
        </LandingContainer>
      </LandingSection>
    </>
  )
}
