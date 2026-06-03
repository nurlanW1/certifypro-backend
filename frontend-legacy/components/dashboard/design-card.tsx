"use client"

import { Copy, Download, ExternalLink, Trash2 } from "lucide-react"

import { Button, LinkButton } from "@/components/ui/button"
import { BadgeChip } from "@/components/ui/badge"
import type { DashboardDesign } from "@/lib/dashboard/dashboard-storage"
import { cn } from "@/lib/utils"

const STATUS_LABELS = {
  draft: { label: "Qoralama", variant: "outline" as const },
  in_progress: { label: "Jarayonda", variant: "secondary" as const },
  ready: { label: "Tayyor", variant: "success" as const },
}

type Props = {
  design: DashboardDesign
  onDuplicate: (design: DashboardDesign) => void
  onDelete: (scope: string) => void
  onExport: (design: DashboardDesign) => void
}

export function DesignCard({ design, onDuplicate, onDelete, onExport }: Props) {
  const status = STATUS_LABELS[design.status]

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        "hover:border-primary/25 hover:shadow-md"
      )}
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border"
        style={{ backgroundColor: design.thumbnailColor }}
      >
        {design.thumbnailSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={design.thumbnailSrc}
            alt=""
            className="max-h-full max-w-full object-contain p-3"
          />
        ) : (
          <span className="text-4xl opacity-40">📄</span>
        )}
        <BadgeChip variant={status.variant} className="absolute right-2 top-2 text-[10px]">
          {status.label}
        </BadgeChip>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {design.productType.replace(/-/g, " ")}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">{design.title}</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Oxirgi tahrir:{" "}
          {new Date(design.lastEdited).toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <LinkButton href={design.editorHref} size="sm" className="gap-1.5">
            <ExternalLink className="size-3.5" />
            Editor
          </LinkButton>
          <Button variant="outline" size="sm" onClick={() => onDuplicate(design)} title="Nusxa">
            <Copy className="size-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport(design)} title="Export">
            <Download className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(design.scope)}
            title="O‘chirish"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
