"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

import { BRAND } from "@/lib/constants/brand"
import { cn } from "@/lib/utils"

type Props = {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function AuthLayout({ title, subtitle, children, footer, className }: Props) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <div
        className={cn(
          "flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:max-w-xl lg:px-12 xl:px-16",
          className
        )}
      >
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Bosh sahifa
        </Link>

        <Link href="/" className="mb-6 inline-flex items-center gap-2.5" aria-label={BRAND.name}>
          <span className="flex size-10 items-center justify-center rounded-xl bg-[image:var(--gradient-accent)] text-sm font-bold text-white shadow-[var(--shadow-glow)]">
            G
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">{BRAND.name}</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>
        </div>

        {children}
        {footer ? <div className="mt-8">{footer}</div> : null}
      </div>

      <aside
        className="relative hidden flex-1 overflow-hidden bg-[#0a1628] lg:flex lg:flex-col lg:justify-between"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(37,99,235,0.45),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(10,22,40,0.2)_0%,rgba(10,22,40,0.95)_100%)]" />
        <div className="relative flex flex-1 flex-col justify-center p-12 xl:p-16">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
            <Sparkles className="size-3.5 text-blue-300" />
            Event design platform
          </div>
          <h2 className="mt-6 max-w-md text-3xl font-bold leading-tight text-white xl:text-4xl">
            Konferensiya va tadbir materiallarini bir joyda yarating
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Sertifikat, bejik, taklifnoma va boshqa chop etiladigan materiallar — tez, chiroyli va
            print-ready.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-white/80">
            {["49+ mahsulot shabloni", "Excel bulk generatsiya", "Media Editor va eksport"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-blue-400" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
        <p className="relative px-12 pb-8 text-xs text-white/40 xl:px-16">
          © {new Date().getFullYear()} {BRAND.name}.uz
        </p>
      </aside>
    </div>
  )
}
