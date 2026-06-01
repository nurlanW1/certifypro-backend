import { Building2, GraduationCap, Landmark, Mic2, Users } from "lucide-react"

import { LandingContainer } from "@/components/marketing/home/landing-primitives"

const TRUST_ITEMS = [
  { icon: Mic2, label: "Konferensiyalar" },
  { icon: GraduationCap, label: "Universitetlar" },
  { icon: Building2, label: "Korporativ tadbirlar" },
  { icon: Landmark, label: "Davlat tashkilotlari" },
  { icon: Users, label: "NGO va jamiyatlar" },
]

export function HomeTrustBar() {
  return (
    <section className="border-y border-border/80 bg-muted/25 py-8">
      <LandingContainer>
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Kimlar uchun
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-border/80">
                <Icon className="size-4 text-primary" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  )
}
