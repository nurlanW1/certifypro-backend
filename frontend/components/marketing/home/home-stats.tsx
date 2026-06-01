import { LandingContainer, LandingSection } from "@/components/marketing/home/landing-primitives"

const STATS = [
  { value: "49+", label: "Dizayn mahsuloti", sub: "9 kategoriyada" },
  { value: "< 5", label: "Daqiqada start", sub: "Forma + preview" },
  { value: "2", label: "Editor rejimi", sub: "Studio va Legacy" },
  { value: "∞", label: "Qoralama", sub: "Session storage" },
]

export function HomeStats() {
  return (
    <LandingSection dark className="py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 landing-dark-mesh opacity-80" />
      <LandingContainer className="relative">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-4xl font-bold tracking-tight text-white md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-blue-100">{stat.label}</p>
              <p className="mt-1 text-xs text-blue-200/60">{stat.sub}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
