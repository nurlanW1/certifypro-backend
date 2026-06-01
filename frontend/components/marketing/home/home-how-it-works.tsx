import { FileEdit, FolderOpen, LayoutTemplate, Send } from "lucide-react"

import {
  LandingContainer,
  LandingEyebrow,
  LandingHeading,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"

const STEPS = [
  {
    step: "01",
    icon: LayoutTemplate,
    title: "Mahsulotni tanlang",
    description: "Katalogdan kerakli tur — sertifikat, bejik, flyer yoki roll-up.",
  },
  {
    step: "02",
    icon: FileEdit,
    title: "Ma’lumotlarni kiriting",
    description: "Dinamik forma — har mahsulot uchun mos maydonlar va jonli preview.",
  },
  {
    step: "03",
    icon: FolderOpen,
    title: "Editorda yakunlang",
    description: "Studio yoki legacy editor — matn, rang, logo va QR sozlamalari.",
  },
  {
    step: "04",
    icon: Send,
    title: "Eksport qiling",
    description: "PDF, PNG yoki chop etishga tayyor fayl — bir bosishda.",
  },
]

export function HomeHowItWorks() {
  return (
    <LandingSection className="bg-muted/25" id="how">
      <LandingContainer>
        <div className="mx-auto max-w-3xl text-center">
          <LandingEyebrow className="mx-auto">Jarayon</LandingEyebrow>
          <LandingHeading
            align="center"
            title="To‘rtta qadam — tayyor material"
            description="Murakkab dizayn dasturlarisiz, Gildia workflow’i sizni tez natijaga olib boradi."
          />
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent md:left-1/2 md:block md:-translate-x-px" />

          <div className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {STEPS.map((item, index) => {
              const isRight = index % 2 === 1
              return (
                <article
                  key={item.step}
                  className={`relative flex gap-5 md:gap-6 ${isRight ? "md:col-start-2" : ""}`}
                >
                  <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-glow">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <div className="mb-2 flex items-center gap-2">
                      <item.icon className="size-4 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
