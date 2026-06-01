import Link from "next/link"
import { Building2, Clock, Mail, MessageCircle, Send } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"
import { SupportPageHero } from "@/components/support/support-page-hero"
import {
  LandingContainer,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/button"
import { BUSINESS_EMAIL, SUPPORT_EMAIL, SUPPORT_TELEGRAM } from "@/lib/constants/support"

export function ContactPageContent() {
  return (
    <>
      <SupportPageHero
        eyebrow="Aloqa"
        title="Biz bilan bog‘laning"
        description="Texnik yordam, hisob savollari yoki biznes hamkorligi — jamoamiz javob beradi."
      />

      <LandingSection className="py-12 md:py-16">
        <LandingContainer>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageCircle className="size-4 text-primary" />
                    Qo‘llab-quvvatlash
                  </CardTitle>
                  <CardDescription>
                    Platforma, eksport, hisob va texnik muammolar bo‘yicha yordam.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="flex items-center gap-2 font-medium text-foreground hover:text-primary"
                  >
                    <Mail className="size-4 text-primary" />
                    {SUPPORT_EMAIL}
                  </a>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Send className="size-4 shrink-0 text-primary" />
                    Telegram: {SUPPORT_TELEGRAM}
                  </p>
                  <p className="flex items-start gap-2 text-muted-foreground">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    Ish vaqti: Dush–Jum, 09:00–18:00 (Toshkent). Odatda 24 soat ichida javob.
                  </p>
                </CardContent>
              </Card>

              <div id="business" className="scroll-mt-24">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="size-4 text-primary" />
                    Biznes murojaatlari
                  </CardTitle>
                  <CardDescription>
                    Enterprise tarif, universitetlar, davlat tashkilotlari va event agentliklari
                    uchun hamkorlik.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="flex items-center gap-2 font-medium text-foreground hover:text-primary"
                  >
                    <Mail className="size-4 text-primary" />
                    {BUSINESS_EMAIL}
                  </a>
                  <p className="text-muted-foreground">
                    Maxsus shablonlar, jamoa litsenziyalari, integratsiya va SLA bo‘yicha taklif
                    tayyorlaymiz.
                  </p>
                  <LinkButton href="/pricing" variant="outline" size="sm">
                    Tariflarni ko‘rish
                  </LinkButton>
                </CardContent>
              </Card>
              </div>

              <p className="text-xs text-muted-foreground">
                Tez-tez so‘raladigan savollar uchun{" "}
                <Link href="/faq" className="font-medium text-primary hover:underline">
                  FAQ
                </Link>{" "}
                sahifasiga qarang.
              </p>
            </div>

            <div className="lg:col-span-3">
              <Card className="shadow-[var(--shadow-premium)]">
                <CardHeader>
                  <CardTitle>Xabar yuborish</CardTitle>
                  <CardDescription>
                    Formani to‘ldiring — murojaat turi bo‘yicha tegishli jamoaga yo‘naltiramiz.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </LandingContainer>
      </LandingSection>
    </>
  )
}
