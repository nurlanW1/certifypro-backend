import { ArrowRight, Mail, MessageCircle } from "lucide-react"

import { LandingContainer, LandingSection } from "@/components/marketing/home/landing-primitives"
import { LinkButton } from "@/components/ui/button"

export function HomeContactCta() {
  return (
    <LandingSection dark className="pb-0 pt-0 md:pb-0">
      <div className="landing-cta-band relative overflow-hidden">
        <div className="landing-dark-mesh pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 size-80 rounded-full bg-blue-400/10 blur-3xl" />

        <LandingContainer className="relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200/80">
              Boshlash vaqti keldi
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.1]">
              Birinchi sertifikatingizni bugun yarating
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-blue-100/80 md:text-lg">
              Ro‘yxatdan o‘ting yoki katalogni ko‘rib chiqing — hech qanday murakkab sozlashsiz, bir necha daqiqada
              natija.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton
                href="/templates"
                size="lg"
                className="h-12 min-w-[200px] gap-2 bg-white text-[#0a1628] hover:bg-white/90"
              >
                Bepul boshlash
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton
                href="/contact"
                size="lg"
                variant="outline"
                className="h-12 min-w-[200px] border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Demo so‘rash
              </LinkButton>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-blue-200/70">
              <a href="mailto:info@gildia.uz" className="inline-flex items-center gap-2 transition hover:text-white">
                <Mail className="size-4" />
                info@gildia.uz
              </a>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="size-4" />
                Telegram orqali qo‘llab-quvvatlash
              </span>
            </div>
          </div>
        </LandingContainer>
      </div>
    </LandingSection>
  )
}
