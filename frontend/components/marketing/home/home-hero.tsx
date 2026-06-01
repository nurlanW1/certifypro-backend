import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  FileImage,
  Layers3,
  Play,
  Sparkles,
  Zap,
} from "lucide-react"

import { LandingContainer, LandingEyebrow } from "@/components/marketing/home/landing-primitives"
import { LinkButton } from "@/components/ui/button"
import { CATALOG_PRODUCTS } from "@/lib/templates/catalog-data"
import { cn } from "@/lib/utils"

const HERO_STATS = [
  { value: "49+", label: "Mahsulot turi" },
  { value: "9", label: "Kategoriya" },
  { value: "A4–Roll", label: "Print formatlar" },
  { value: "1 klik", label: "Eksport" },
]

const showcaseProducts = CATALOG_PRODUCTS.filter((p) =>
  ["certificate", "badge", "invitation", "flyer", "poster", "social-media-post"].includes(p.id)
).slice(0, 6)

export function HomeHero() {
  return (
    <section className="landing-hero relative overflow-hidden">
      <div className="landing-hero-mesh pointer-events-none absolute inset-0" />
      <div className="landing-grid-bg pointer-events-none absolute inset-0 opacity-60" />

      <LandingContainer className="relative pt-12 pb-20 md:pt-16 md:pb-28 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <div className="max-w-2xl">
            <LandingEyebrow>
              <Sparkles className="size-3" />
              Gildia.uz — dizayn avtomatlashtirish
            </LandingEyebrow>

            <h1 className="text-[2.35rem] font-bold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Tadbir materiallarini{" "}
              <span className="landing-gradient-text">daqiqalar ichida</span> professional darajada yarating
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              Sertifikatdan roll-upgacha — bitta katalog, jonli preview, zamonaviy editor va chop etishga
              tayyor eksport. Konferensiya, seminar yoki korporativ tadbir uchun to‘liq yechim.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <LinkButton href="/templates" size="lg" className="h-12 gap-2 px-7 text-base shadow-glow">
                Dizayn yaratish
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton href="/dashboard/events/new" variant="outline" size="lg" className="h-12 px-7 text-base">
                Tadbir yaratish
              </LinkButton>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Qoralama saqlash", "Jonli mockup", "Legacy + Studio editor"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border/80 pt-10 sm:grid-cols-4">
              {HERO_STATS.map(({ value, label }) => (
                <div key={label}>
                  <dt className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{value}</dt>
                  <dd className="mt-1 text-xs font-medium text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="landing-hero-glow pointer-events-none absolute -inset-8 rounded-[3rem] opacity-70" />

            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-premium-lg ring-1 ring-black/[0.04]">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">gildia.uz — Create Design</span>
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Zap className="size-3" />
                </span>
              </div>

              <div className="grid gap-0 sm:grid-cols-5">
                <div className="border-b border-border bg-muted/20 p-4 sm:col-span-2 sm:border-b-0 sm:border-r">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Katalog
                  </p>
                  <ul className="mt-3 space-y-2">
                    {showcaseProducts.map((p, i) => (
                      <li
                        key={p.id}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                          i === 0 ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground hover:bg-muted"
                        )}
                      >
                        <FileImage className="size-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{p.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 sm:col-span-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">Certificate — jonli preview</p>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Live
                    </span>
                  </div>

                  <div className="mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#0a1628] via-[#132337] to-primary p-5 shadow-inner">
                    <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200/90">
                          Sertifikat
                        </p>
                        <p className="mt-2 text-sm font-bold text-white">Ishtirok sertifikati</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-white">{"{{full_name}}"}</p>
                        <p className="text-[10px] text-blue-100/70">Konferensiya 2026 • Toshkent</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="h-8 w-20 rounded bg-white/20" />
                        <div className="size-10 rounded border border-white/30 bg-white/10" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <span className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-[10px] font-semibold text-primary-foreground">
                      Editorda ochish
                    </span>
                    <span className="rounded-lg border border-border px-3 py-2 text-[10px] font-semibold text-muted-foreground">
                      Eksport
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 hidden animate-float rounded-2xl border border-border bg-card p-3 shadow-premium md:block">
              <div className="flex items-center gap-2">
                <Layers3 className="size-4 text-primary" />
                <div>
                  <p className="text-[10px] font-bold text-foreground">9 kategoriya</p>
                  <p className="text-[9px] text-muted-foreground">Bitta katalog</p>
                </div>
              </div>
            </div>

            <Link
              href="/templates"
              className="absolute -right-2 top-8 hidden animate-float-delayed items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold shadow-premium transition hover:border-primary/30 md:inline-flex"
            >
              <Play className="size-3.5 text-primary" />
              Katalogni ko‘rish
            </Link>
          </div>
        </div>
      </LandingContainer>
    </section>
  )
}
