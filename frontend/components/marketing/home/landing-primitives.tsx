import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function LandingSection({
  children,
  className,
  id,
  dark,
}: {
  children: ReactNode
  className?: string
  id?: string
  dark?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-20 md:py-28",
        dark ? "bg-[#0a1628] text-white" : "bg-background",
        className
      )}
    >
      {children}
    </section>
  )
}

export function LandingContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("gildia-container relative", className)}>{children}</div>
}

export function LandingEyebrow({
  children,
  className,
  light,
}: {
  children: ReactNode
  className?: string
  light?: boolean
}) {
  return (
    <p
      className={cn(
        "mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        light
          ? "border-white/20 bg-white/10 text-blue-100"
          : "border-primary/20 bg-primary/5 text-primary",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", light ? "bg-blue-300" : "bg-primary")} />
      {children}
    </p>
  )
}

export function LandingHeading({
  title,
  description,
  align = "center",
  light,
}: {
  title: string
  description?: string
  align?: "left" | "center"
  light?: boolean
}) {
  const alignClass = align === "center" ? "mx-auto text-center" : "text-left"
  return (
    <div className={cn("mb-14 max-w-3xl", alignClass)}>
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            light ? "text-blue-100/80" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function BrowserFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_32px_80px_-24px_rgba(10,22,40,0.22)] ring-1 ring-black/[0.04]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/90" />
        <span className="size-2.5 rounded-full bg-amber-400/90" />
        <span className="size-2.5 rounded-full bg-emerald-400/90" />
        <div className="ml-3 flex-1 rounded-md bg-background px-3 py-1 text-[10px] text-muted-foreground">
          gildia.uz/templates
        </div>
      </div>
      {children}
    </div>
  )
}
