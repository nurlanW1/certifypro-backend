"use client"

import { Eye } from "lucide-react"

import { EventMaterialLivePreview } from "@/components/event-create/event-material-live-preview"
import { Button } from "@/components/ui/button"
import type { EventSetup } from "@/lib/event-create/event-setup"
import { isConfiguredMaterial } from "@/lib/event-create/material-form-schema"
import type { CatalogItem } from "@/lib/event-create/types"
import type { CategoryFormData } from "@/lib/event-create/types"

type Props = {
  activeItem: CatalogItem | null
  enabled: boolean
  formData: CategoryFormData
  setup: EventSetup
  enabledCount: number
  onOpenEditor: () => void
}

export function EventLivePreviewPanel({
  activeItem,
  enabled,
  formData,
  setup,
  enabledCount,
  onOpenEditor,
}: Props) {
  const filledFields = Object.entries(formData).filter(([, v]) => {
    if (typeof v === "string") return v.trim().length > 0
    if (Array.isArray(v)) return v.length > 0
    return false
  }).length

  return (
    <aside className="xl:sticky xl:top-20 xl:z-10 xl:max-h-[calc(100vh-6rem)] xl:self-start">
      <div className="flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
        <div className="shrink-0 border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-primary" />
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Jonli preview</p>
            </div>
            {enabled && activeItem ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live
              </span>
            ) : null}
          </div>
          {activeItem ? (
            <p className="mt-1 truncate text-sm font-semibold text-foreground">{activeItem.name}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Material tanlanmagan</p>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {activeItem && enabled ? (
            <EventMaterialLivePreview
              materialId={activeItem.id}
              materialName={activeItem.name}
              mockupVariant={activeItem.mockupVariant}
              formData={formData}
              setup={setup}
              onOpenEditor={onOpenEditor}
            />
          ) : activeItem && !enabled ? (
            <div className="space-y-4">
              <EventMaterialLivePreview
                materialId={activeItem.id}
                materialName={activeItem.name}
                mockupVariant={activeItem.mockupVariant}
                formData={{}}
                setup={setup}
                onOpenEditor={onOpenEditor}
                className="opacity-60"
              />
              <p className="rounded-lg border border-dashed border-amber-300/60 bg-amber-50/80 px-3 py-2 text-center text-xs text-amber-900">
                Default mockup. <strong>Ha</strong> bosing — forma va jonli yangilanish ochiladi.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <Eye className="size-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">Preview paneli</p>
              <p className="mt-2 max-w-[200px] text-xs text-muted-foreground">
                Katalogdan material tanlang. Formani to‘ldirish bilan mockup bir vaqtda yangilanadi.
              </p>
            </div>
          )}
        </div>

        {activeItem && enabled ? (
          <div className="shrink-0 space-y-3 border-t border-border bg-muted/20 p-4">
            {filledFields > 0 ? (
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  To‘ldirilgan maydonlar
                </p>
                <p className="mt-0.5 text-sm font-bold text-primary">{filledFields}</p>
              </div>
            ) : null}
            {isConfiguredMaterial(activeItem.id) ? (
              <p className="text-[10px] text-muted-foreground">Maxsus forma — real vaqtli mockup</p>
            ) : null}
            <Button className="w-full" size="sm" onClick={onOpenEditor}>
              Editorda tahrirlash
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
        <p className="font-semibold text-foreground">Tanlangan: {enabledCount}</p>
        <p className="mt-1 text-xs text-muted-foreground">Ma’lumotlar sessiyada saqlanadi</p>
      </div>
    </aside>
  )
}
