"use client"

import { cn } from "@/lib/utils"
import type { PreviewTone } from "@/lib/templates/types"

const TONE_STYLES: Record<
  PreviewTone,
  { gradient: string; label: string; accent: string }
> = {
  document: {
    gradient: "from-[#0a1628] via-[#132337] to-primary",
    label: "DOC",
    accent: "text-blue-200/80",
  },
  card: {
    gradient: "from-slate-100 to-white",
    label: "ID",
    accent: "text-primary",
  },
  print: {
    gradient: "from-primary to-[#1d4ed8]",
    label: "PRINT",
    accent: "text-white/80",
  },
  large: {
    gradient: "from-primary via-[#1d4ed8] to-[#0a1628]",
    label: "BANNER",
    accent: "text-white/70",
  },
  digital: {
    gradient: "from-violet-600 via-primary to-[#0a1628]",
    label: "DIGITAL",
    accent: "text-white/80",
  },
  brand: {
    gradient: "from-slate-50 to-slate-100",
    label: "BRAND",
    accent: "text-foreground",
  },
  video: {
    gradient: "from-[#0a1628] to-slate-900",
    label: "VIDEO",
    accent: "text-white/60",
  },
}

type Props = {
  productName: string
  tone: PreviewTone
  format?: string
  className?: string
  aspectClass?: string
}

export function ProductPreviewPlaceholder({
  productName,
  tone,
  format,
  className,
  aspectClass = "aspect-[4/3]",
}: Props) {
  const style = TONE_STYLES[tone]
  const isLight = tone === "card" || tone === "brand"

  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-lg",
        aspectClass,
        `bg-gradient-to-br ${style.gradient}`,
        className
      )}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <span
          className={cn(
            "text-[9px] font-bold uppercase tracking-widest",
            isLight ? "text-muted-foreground" : style.accent
          )}
        >
          {style.label}
        </span>
        {format ? (
          <span
            className={cn(
              "max-w-[55%] truncate text-right text-[8px] font-medium",
              isLight ? "text-muted-foreground" : "text-white/50"
            )}
          >
            {format}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-4 text-center">
        {tone === "card" ? (
          <div className="mb-3 size-12 rounded-full bg-slate-200" />
        ) : tone === "brand" ? (
          <div className="mb-3 grid grid-cols-3 gap-1">
            <div className="size-6 rounded bg-[#0a1628]" />
            <div className="size-6 rounded bg-primary" />
            <div className="size-6 rounded bg-slate-300" />
          </div>
        ) : tone === "video" ? (
          <div className="mb-3 flex size-10 items-center justify-center rounded-full border-2 border-white/30">
            <div className="ml-0.5 size-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white/80" />
          </div>
        ) : (
          <div className="mb-3 h-1 w-12 rounded-full bg-white/30" />
        )}

        <p
          className={cn(
            "line-clamp-2 text-xs font-bold leading-tight",
            isLight ? "text-foreground" : "text-white"
          )}
        >
          {productName}
        </p>

        {tone === "document" ? (
          <div className="mt-3 space-y-1.5">
            <div className="mx-auto h-1 w-20 rounded-full bg-white/20" />
            <div className="mx-auto h-1 w-14 rounded-full bg-white/15" />
          </div>
        ) : null}

        {tone === "large" ? (
          <div className="mt-3 size-8 rounded-lg bg-white/15" />
        ) : null}
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t",
          isLight ? "from-white/80 to-transparent" : "from-black/20 to-transparent"
        )}
      />
    </div>
  )
}
