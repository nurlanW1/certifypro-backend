import Link from "next/link"
import { ArrowRight, CalendarRange, Check, Palette, Sparkles } from "lucide-react"

import {
  LandingContainer,
  LandingEyebrow,
  LandingHeading,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"
import { LinkButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MODES = [
  {
    id: "design",
    icon: Palette,
    tag: "Create Design",
    title: "Bitta mahsulot — tez natija",
    description:
      "Katalogdan tanlang, formani to‘ldiring, jonli mockupda ko‘ring va editorda yakunlang. Sertifikat, flyer yoki ijtimoiy post uchun ideal.",
    href: "/templates",
    cta: "Katalogni ochish",
    checks: ["49+ mahsulot", "Dinamik forma", "Session qoralama", "PDF / PNG eksport"],
    gradient: "from-violet-600/20 via-primary/10 to-transparent",
    ring: "ring-violet-500/20",
  },
  {
    id: "event",
    icon: CalendarRange,
    tag: "Create Event",
    title: "Butun tadbir — barcha materiallar",
    description:
      "Tadbir katalogi, workspace, brending va jamoa workflow. Forum yoki konferensiya uchun 40+ material bir loyihada.",
    href: "/dashboard/events/new",
    cta: "Tadbir yaratish",
    checks: ["Material katalogi", "Workspace", "Bulk Excel", "Jamoa rollari"],
    gradient: "from-emerald-600/15 via-teal-500/10 to-transparent",
    ring: "ring-emerald-500/20",
  },
]

export function HomeTwoModes() {
  return (
    <LandingSection id="modes">
      <LandingContainer>
        <div className="mx-auto max-w-3xl text-center">
          <LandingEyebrow className="mx-auto">Ikki yo‘l</LandingEyebrow>
          <LandingHeading
            align="center"
            title="Bitta sertifikat yoki to‘liq tadbir paketi?"
            description="Ikkala ssenariy ham bir platformada — workflow sizning vazifangizga moslashadi."
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {MODES.map((mode) => (
            <article
              key={mode.id}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-premium md:p-10 ring-1",
                mode.ring
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
                  mode.gradient
                )}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                    <mode.icon className="size-7" />
                  </span>
                  <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {mode.tag}
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {mode.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                  {mode.description}
                </p>

                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {mode.checks.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="size-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <LinkButton href={mode.href} size="lg" className="gap-2">
                    {mode.cta}
                    <ArrowRight className="size-4" />
                  </LinkButton>
                  <Link
                    href={mode.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Batafsil
                    <Sparkles className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
