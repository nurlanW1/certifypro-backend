"use client"

import { cn } from "@/lib/utils"
import type { MockupVariant, ProductFormData } from "@/lib/templates/types"

type Props = {
  variant: MockupVariant
  data: ProductFormData
  className?: string
  aspectClass?: string
  showFrame?: boolean
}

function Line({ w = "w-3/4" }: { w?: string }) {
  return <div className={cn("h-2 rounded-full bg-white/20", w)} />
}

export function TemplatePreviewMockup({
  variant,
  data,
  className,
  aspectClass = "aspect-[3/4]",
  showFrame = true,
}: Props) {
  const body = renderMockupBody(variant, data)

  const inner = (
    <div className={cn("relative w-full overflow-hidden", aspectClass)}>{body}</div>
  )

  if (!showFrame) return <div className={className}>{inner}</div>

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-white shadow-[0_24px_64px_rgba(10,22,40,0.12)] ring-1 ring-border",
        className
      )}
    >
      <div className="border-b border-border bg-muted/40 px-3 py-2">
        <div className="flex gap-1">
          <span className="size-2 rounded-full bg-red-400/80" />
          <span className="size-2 rounded-full bg-amber-400/80" />
          <span className="size-2 rounded-full bg-emerald-400/80" />
        </div>
      </div>
      {inner}
    </div>
  )
}

function renderMockupBody(variant: MockupVariant, data: ProductFormData) {
  const { eventName, fullName, organization, position, date, subtitle } = data

  switch (variant) {
    case "certificate":
      return (
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#132337] to-[#2563eb] p-6 text-center text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/80">
            {subtitle}
          </p>
          <div className="my-4 h-px w-16 bg-white/30" />
          <p className="text-lg font-bold leading-tight">{fullName}</p>
          <p className="mt-2 text-xs text-blue-100/90">{organization}</p>
          <p className="mt-1 text-[10px] text-white/60">{position}</p>
          <p className="mt-6 text-sm font-medium text-white/90">{eventName}</p>
          <p className="mt-4 text-[10px] text-white/50">{date}</p>
          <div className="mt-6 flex w-full max-w-[200px] items-end justify-between border-t border-white/20 pt-4">
            <div className="text-left">
              <div className="h-6 w-16 rounded bg-white/10" />
              <p className="mt-1 text-[8px] text-white/40">Imzo</p>
            </div>
            <div className="grid grid-cols-4 gap-0.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className={cn("size-2", i % 2 === 0 ? "bg-white" : "bg-transparent")} />
              ))}
            </div>
          </div>
        </div>
      )
    case "badge":
      return (
        <div className="flex h-full gap-4 bg-white p-5">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-100 text-2xl font-bold text-slate-400">
            {fullName.charAt(0)}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2">
            <p className="text-sm font-bold text-foreground">{fullName}</p>
            <Line w="w-2/3" />
            <p className="text-xs text-muted-foreground">{organization}</p>
            <p className="text-[10px] font-medium text-primary">{eventName}</p>
          </div>
        </div>
      )
    case "invitation":
      return (
        <div className="flex h-full flex-col justify-between bg-gradient-to-b from-slate-50 to-white p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Taklifnoma</p>
            <p className="mt-4 text-lg font-bold text-foreground">{fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{position}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{eventName}</p>
            <p className="mt-1 text-xs text-muted-foreground">{date}</p>
            <div className="mt-4 h-px w-full bg-border" />
            <p className="mt-3 text-[10px] text-muted-foreground">{organization}</p>
          </div>
        </div>
      )
    case "flyer":
    case "poster":
      return (
        <div className="flex h-full flex-col bg-gradient-to-br from-primary to-[#0a1628] p-6 text-white">
          <p className="text-[10px] font-semibold uppercase opacity-70">{eventName}</p>
          <p className="mt-6 text-2xl font-black leading-tight">{subtitle}</p>
          <p className="mt-4 text-sm opacity-90">{fullName}</p>
          <p className="mt-auto text-xs opacity-60">{date} • {organization}</p>
        </div>
      )
    case "program":
      return (
        <div className="h-full space-y-3 bg-white p-5">
          <p className="text-sm font-bold text-foreground">{eventName}</p>
          <p className="text-[10px] text-muted-foreground">{date}</p>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 border-b border-border pb-2 text-xs">
              <span className="font-mono font-semibold text-primary">09:{(i - 1) * 15}</span>
              <span className="text-muted-foreground">Sessiya {i} — {organization}</span>
            </div>
          ))}
        </div>
      )
    case "rollup":
    case "press-wall":
    case "backdrop":
      return (
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-primary via-[#1d4ed8] to-[#0a1628] p-6 text-center text-white">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
            G
          </div>
          <p className="text-lg font-bold leading-snug">{eventName}</p>
          <p className="mt-2 text-xs text-white/70">{subtitle}</p>
          <p className="mt-6 text-[10px] uppercase tracking-wider text-white/50">{organization}</p>
        </div>
      )
    case "social":
      return (
        <div className="flex h-full flex-col justify-end bg-gradient-to-br from-violet-600 via-primary to-[#0a1628] p-5 text-white">
          <p className="text-lg font-bold">{eventName}</p>
          <p className="mt-2 text-sm opacity-90">{fullName}</p>
          <p className="mt-4 text-[10px] opacity-70">#konferensiya • {date}</p>
        </div>
      )
    case "brand-kit":
      return (
        <div className="grid h-full grid-cols-2 gap-2 bg-slate-50 p-4">
          <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-[#0a1628] to-primary text-2xl font-bold text-white">
            G
          </div>
          <div className="space-y-2">
            <div className="h-8 rounded-lg bg-[#0a1628]" />
            <div className="h-8 rounded-lg bg-primary" />
            <div className="h-8 rounded-lg bg-slate-200" />
          </div>
          <div className="col-span-2 rounded-lg border border-border bg-white p-2 text-[10px] text-muted-foreground">
            {eventName}
          </div>
        </div>
      )
    case "report":
      return (
        <div className="h-full bg-white p-5">
          <p className="text-xs font-bold uppercase text-primary">Hisobot</p>
          <p className="mt-2 text-sm font-bold text-foreground">{eventName}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{date}</p>
          <div className="mt-4 space-y-2">
            <Line w="w-full" />
            <Line w="w-5/6" />
            <Line w="w-4/6" />
          </div>
          <p className="mt-6 text-[10px] text-muted-foreground">{organization}</p>
        </div>
      )
    default:
      return (
        <div className="flex h-full flex-col justify-center gap-2 bg-white p-5">
          <p className="font-bold text-foreground">{eventName}</p>
          <Line w="w-full" />
          <p className="text-xs text-muted-foreground">{fullName}</p>
        </div>
      )
  }
}
