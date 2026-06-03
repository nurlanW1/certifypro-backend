import {
  Download,
  Eye,
  Layers,
  Palette,
  Save,
  Wand2,
} from "lucide-react"

import {
  LandingContainer,
  LandingEyebrow,
  LandingHeading,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"
import { cn } from "@/lib/utils"

const FEATURES = [
  {
    icon: Layers,
    title: "Yagona mahsulot katalogi",
    description: "49 turdagi material — hujjatdan ijtimoiy tarmoqgacha, barchasi bir joyda.",
    className: "md:col-span-2 md:row-span-2",
    large: true,
  },
  {
    icon: Eye,
    title: "Jonli preview",
    description: "Formani to‘ldirish bilan mockup bir vaqtda yangilanadi.",
    className: "md:col-span-1",
  },
  {
    icon: Save,
    title: "Qoralama",
    description: "Sessiyada saqlanadi — sahifadan chiqsangiz ham ma’lumot qoladi.",
    className: "md:col-span-1",
  },
  {
    icon: Palette,
    title: "Studio + Legacy editor",
    description: "Zamonaviy shell yoki to‘liq legacy editor — tanlov sizda.",
    className: "md:col-span-2",
  },
  {
    icon: Wand2,
    title: "Dinamik forma",
    description: "Har mahsulot uchun o‘z maydonlari — sertifikat, bejik, flyer farq qiladi.",
    className: "md:col-span-1",
  },
  {
    icon: Download,
    title: "Print & digital eksport",
    description: "PDF, PNG va chop etishga tayyor formatlar.",
    className: "md:col-span-1",
  },
]

export function HomeFeatures() {
  return (
    <LandingSection className="bg-muted/20">
      <LandingContainer>
        <div className="mx-auto max-w-3xl text-center">
          <LandingEyebrow className="mx-auto">Imkoniyatlar</LandingEyebrow>
          <LandingHeading
            align="center"
            title="Dizayn jarayonini soddalashtiradigan har bir qadam"
            description="Katalogdan eksportgacha — barcha vositalar bir platformada, ortiqcha dasturlarsiz."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg hover:border-primary/20",
                feature.className
              )}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" />
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className={cn("mt-5 font-bold text-foreground", feature.large ? "text-xl" : "text-base")}>
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
