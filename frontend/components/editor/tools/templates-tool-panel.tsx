"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowRight,
  Check,
  ExternalLink,
  LayoutTemplate,
  RectangleHorizontal,
  RectangleVertical,
  Search,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TemplateCanvasPreview } from "@/components/templates/template-canvas-preview"
import { getProductById } from "@/lib/templates/product-catalog"
import type { EditorTemplateOption } from "@/lib/editor/editor-tools"
import {
  A4_LANDSCAPE_ASPECT,
  A4_PORTRAIT_ASPECT,
  getTemplatePreviewOrientation,
  groupTemplatesByOrientation,
  type TemplatePreviewOrientation,
} from "@/lib/editor/template-preview-layout"
import { cn } from "@/lib/utils"

type Props = {
  templates: EditorTemplateOption[]
  categoryName: string
  activeTemplateId: string | null
  onApply: (productId: string) => void
}

export function TemplatesToolPanel({
  templates,
  categoryName,
  activeTemplateId,
  onApply,
}: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return templates
    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.format?.toLowerCase().includes(q) ||
        t.productId.toLowerCase().includes(q)
    )
  }, [templates, query])

  const active = templates.find((t) => t.productId === activeTemplateId)
  const grouped = useMemo(
    () => groupTemplatesByOrientation(filtered, activeTemplateId),
    [filtered, activeTemplateId]
  )

  const activeOrientation = activeTemplateId
    ? getTemplatePreviewOrientation(activeTemplateId)
    : null

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#e0e7ff] bg-gradient-to-br from-[#f8faff] to-white p-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
            <Sparkles className="size-4 stroke-[1.75]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#0f172a]">Minimal shablonlar</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-[#64748b]">
              Gorizontal va vertikal maketlar alohida ketma-ket. Preview A4 nisbatida.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#94a3b8]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Shablon qidirish…"
          className="h-8 border-[#e8ebf0] bg-[#fafbfc] pl-8 text-xs"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
          {categoryName}
        </p>
        <span className="rounded-md bg-[#f1f3f6] px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-[#64748b]">
          {filtered.length}
        </span>
      </div>

      {active ? (
        <div className="rounded-xl border-2 border-[#6366f1] bg-[#f5f7ff]/50 p-2.5">
          <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#4338ca]">
            <Check className="size-3" />
            Joriy shablon
          </p>
          <TemplateCard
            template={active}
            orientation={activeOrientation ?? getTemplatePreviewOrientation(active.productId)}
            isActive
            onApply={onApply}
          />
        </div>
      ) : null}

      <OrientationSection
        title="Gorizontal formatlar"
        subtitle="A4 landscape · 297 × 210 mm"
        icon={<RectangleHorizontal className="size-3.5" />}
        orientation="landscape"
        templates={grouped.landscape}
        onApply={onApply}
        empty={filtered.length > 0 && grouped.landscape.length === 0}
      />

      <OrientationSection
        title="Vertikal formatlar"
        subtitle="A4 portrait · 210 × 297 mm"
        icon={<RectangleVertical className="size-3.5" />}
        orientation="portrait"
        templates={grouped.portrait}
        onApply={onApply}
        empty={filtered.length > 0 && grouped.portrait.length === 0}
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#e2e5ea] bg-[#fafbfc] px-3 py-6 text-center">
          <LayoutTemplate className="mx-auto size-6 text-[#cbd5e1]" />
          <p className="mt-2 text-xs font-medium text-[#64748b]">Shablon topilmadi</p>
        </div>
      ) : null}

      <Link
        href="/templates"
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#e8ebf0] bg-white px-3 py-2.5 text-xs font-semibold text-[#4338ca] transition hover:border-[#c7d2fe] hover:bg-[#f5f7ff]"
      >
        Katalogda ko‘rish
        <ExternalLink className="size-3.5 opacity-70" />
      </Link>
    </div>
  )
}

function OrientationSection({
  title,
  subtitle,
  icon,
  orientation,
  templates,
  onApply,
  empty,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  orientation: TemplatePreviewOrientation
  templates: EditorTemplateOption[]
  onApply: (productId: string) => void
  empty?: boolean
}) {
  if (empty) return null

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 border-b border-[#e8ebf0] pb-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-[#f1f3f6] text-[#475569]">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">
            {title}
          </p>
          <p className="text-[9px] text-[#94a3b8]">{subtitle}</p>
        </div>
        <span className="rounded-md bg-[#f1f3f6] px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-[#94a3b8]">
          {templates.length}
        </span>
      </div>

      {templates.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#e8ebf0] bg-[#fafbfc] px-3 py-4 text-center text-[10px] text-[#94a3b8]">
          Bu yo‘nalishda shablon yo‘q
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {templates.map((t, index) => (
            <li key={t.productId} className="flex items-stretch gap-1.5">
              <span className="flex w-4 shrink-0 flex-col items-center pt-3 text-[9px] font-medium tabular-nums text-[#cbd5e1]">
                {index + 1}
              </span>
              <TemplateCard
                template={t}
                orientation={orientation}
                isActive={false}
                onApply={onApply}
                className="min-w-0 flex-1"
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function TemplateCard({
  template,
  orientation,
  isActive,
  onApply,
  className,
}: {
  template: EditorTemplateOption
  orientation: TemplatePreviewOrientation
  isActive: boolean
  onApply: (productId: string) => void
  className?: string
}) {
  const product = getProductById(template.productId)
  const isLandscape = orientation === "landscape"
  const aspectClass = isLandscape ? A4_LANDSCAPE_ASPECT : A4_PORTRAIT_ASPECT

  return (
    <button
      type="button"
      onClick={() => onApply(template.productId)}
      className={cn(
        "group overflow-hidden rounded-xl border bg-white text-left shadow-sm transition",
        isActive
          ? "border-[#6366f1] ring-1 ring-[#6366f1]/30"
          : "border-[#e8ebf0] hover:border-[#c7d2fe] hover:shadow-md",
        isLandscape ? "flex w-full flex-row items-stretch gap-0" : "flex w-full flex-col",
        className
      )}
    >
      <div
        className={cn(
          "relative shrink-0 bg-[#f8fafc] p-2",
          isLandscape ? "flex w-[58%] min-w-0 items-center border-r border-[#f1f3f6]" : "w-full border-b border-[#f1f3f6]"
        )}
      >
        {product ? (
          <TemplateCanvasPreview
            productId={template.productId}
            productName={template.title}
            tone={product.previewTone}
            frameAspect={
              isLandscape ? { width: 297, height: 210 } : { width: 210, height: 297 }
            }
            className={cn(
              "rounded-md border border-[#e8ebf0] bg-white shadow-none ring-0",
              isLandscape ? "h-[76px] w-full" : "mx-auto h-[128px] w-[90px]"
            )}
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center rounded-md border border-[#e8ebf0] bg-white",
              aspectClass,
              isLandscape ? "h-[76px] w-full" : "mx-auto h-[128px] w-[90px]"
            )}
          >
            <LayoutTemplate className="size-5 text-[#cbd5e1]" />
          </div>
        )}
        {template.isPremium ? (
          <span className="absolute left-2.5 top-2.5 z-10">
            <Badge text="Premium" variant="premium" />
          </span>
        ) : null}
        <span className="absolute bottom-2 right-2 z-10 rounded bg-white/95 px-1 py-px text-[7px] font-semibold uppercase tracking-wide text-[#64748b] shadow-sm ring-1 ring-[#e8ebf0]">
          {isLandscape ? "A4 ⟷" : "A4 ↕"}
        </span>
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col justify-center",
          isLandscape ? "px-2.5 py-2" : "px-2.5 py-2.5 text-center"
        )}
      >
        <p
          className={cn(
            "font-semibold leading-snug text-[#0f172a] group-hover:text-[#4338ca]",
            isLandscape ? "text-[11px] line-clamp-3" : "text-xs line-clamp-2"
          )}
        >
          {template.title}
        </p>
        {template.format ? (
          <p className="mt-0.5 truncate text-[9px] text-[#94a3b8]">{template.format}</p>
        ) : null}
        <div
          className={cn(
            "mt-1.5 flex items-center gap-1 text-[9px] font-medium",
            isActive ? "text-[#4338ca]" : "text-[#94a3b8] group-hover:text-[#6366f1]",
            !isLandscape && "justify-center"
          )}
        >
          {isActive ? (
            <>
              <Check className="size-3" />
              Faol maket
            </>
          ) : (
            <>
              Qo‘llash
              {isLandscape ? (
                <ArrowRight className="size-3 opacity-70" />
              ) : (
                <ArrowDown className="size-3 opacity-70" />
              )}
            </>
          )}
        </div>
      </div>
    </button>
  )
}
