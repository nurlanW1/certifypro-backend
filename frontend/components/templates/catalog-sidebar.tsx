"use client"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export type CatalogFilters = {
  free: boolean
  premium: boolean
  print: boolean
  online: boolean
  landscape: boolean
  portrait: boolean
}

type Props = {
  filters: CatalogFilters
  onChange: (filters: CatalogFilters) => void
  resultCount: number
}

const FILTER_GROUPS: { key: keyof CatalogFilters; label: string }[] = [
  { key: "free", label: "Free" },
  { key: "premium", label: "Premium" },
  { key: "print", label: "Print-ready" },
  { key: "online", label: "Online-ready" },
  { key: "landscape", label: "Landscape" },
  { key: "portrait", label: "Portrait" },
]

export function CatalogSidebar({ filters, onChange, resultCount }: Props) {
  const toggle = (key: keyof CatalogFilters) => {
    onChange({ ...filters, [key]: !filters[key] })
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="border-b border-sidebar-border px-4 py-4">
        <p className="text-sm font-semibold text-sidebar-foreground">Filtrlar</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{resultCount} ta mahsulot</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tarif va format
        </p>
        <div className="space-y-3">
          {FILTER_GROUPS.map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
            >
              <Checkbox checked={filters[key]} onCheckedChange={() => toggle(key)} />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <Separator className="my-5" />

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tez tanlov
        </p>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p>• Davlat forumlari</p>
          <p>• Universitet tadbirlari</p>
          <p>• Korporativ konferensiya</p>
        </div>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <button
          type="button"
          onClick={() =>
            onChange({
              free: false,
              premium: false,
              print: false,
              online: false,
              landscape: false,
              portrait: false,
            })
          }
          className={cn(
            "w-full rounded-lg border border-border px-3 py-2 text-xs font-medium",
            "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          )}
        >
          Filtrlarni tozalash
        </button>
      </div>
    </aside>
  )
}
