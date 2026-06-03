"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { exportDesignPdf } from "@/lib/editor/canvas-pdf-export"
import { exportDesignRaster, type RasterExportFormat } from "@/lib/editor/canvas-raster-export"
import { exportDesignSvg } from "@/lib/editor/canvas-vector-export"
import type { CanvasElement } from "@/lib/editor/canvas-types"
import { logExport } from "@/lib/dashboard/dashboard-storage"
import { checkBillingAccess } from "@/lib/billing/access"
import Link from "next/link"

export type ExportFormatId = "png" | "jpg" | "pdf" | "svg"

const formats: {
  id: ExportFormatId
  label: string
  description: string
}[] = [
  { id: "png", label: "PNG", description: "Shaffof fon, veb va chop" },
  { id: "jpg", label: "JPG", description: "Kichik hajm, fotosuratlar" },
  { id: "pdf", label: "PDF", description: "Chop etish va ulashish" },
  { id: "svg", label: "SVG", description: "Vektor (matn va shakllar)" },
]

export type ExportDesignContext = {
  designName: string
  width: number
  height: number
  background: string
  elements: CanvasElement[]
}

type ExportPanelProps = {
  trigger?: React.ReactNode | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  design?: ExportDesignContext | null
}

export function ExportPanel({
  trigger,
  open: controlledOpen,
  onOpenChange,
  design,
}: ExportPanelProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [exporting, setExporting] = useState<ExportFormatId | null>(null)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const safeName = (design?.designName || "dizayn")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48) || "dizayn"

  const runExport = async (formatId: ExportFormatId) => {
    if (!design) {
      toast.error("Dizayn ma’lumotlari tayyor emas")
      return
    }

    const gate = await checkBillingAccess("canExport")
    if (!gate.allowed) {
      toast.error(gate.message, {
        action: {
          label: "Rejalar",
          onClick: () => {
            window.location.href = "/pricing"
          },
        },
      })
      return
    }

    setExporting(formatId)
    try {
      const scale = gate.billing.highQualityExport ? 3 : 2
      const base = {
        width: design.width,
        height: design.height,
        background: design.background,
        elements: design.elements,
        filename: safeName,
        scale,
        watermark: gate.billing.watermarkRequired,
      }
      switch (formatId) {
        case "png":
          await exportDesignRaster({ ...base, format: "png" satisfies RasterExportFormat })
          break
        case "jpg":
          await exportDesignRaster({ ...base, format: "jpg" satisfies RasterExportFormat, quality: 0.9 })
          break
        case "pdf":
          await exportDesignPdf(base)
          break
        case "svg":
          exportDesignSvg(base)
          break
      }
      logExport(design.designName, formatId.toUpperCase())
      toast.success(`${formatId.toUpperCase()} yuklab olindi`)
      setOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Eksport amalga oshmadi")
    } finally {
      setExporting(null)
    }
  }

  return (
    <>
      {trigger !== null && trigger !== undefined ? (
        <span
          onClick={() => setOpen(true)}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
        >
          {trigger}
        </span>
      ) : controlledOpen === undefined ? (
        <Button size="sm" onClick={() => setOpen(true)}>
          Export
        </Button>
      ) : null}

      <Modal open={open} onClose={() => setOpen(false)} title="Eksport" size="md">
        <p className="text-sm text-muted-foreground">
          PNG, JPG, PDF va SVG. Hozircha eksport brauzerda; server render keyin qo‘shiladi.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {formats.map((f) => {
            const busy = exporting === f.id
            return (
              <button
                key={f.id}
                type="button"
                disabled={!!exporting || !design}
                onClick={() => void runExport(f.id)}
                className={`flex flex-col items-center justify-center rounded-xl border border-border px-2 py-4 text-center transition ${
                  busy
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                }`}
              >
                <span className="text-sm font-semibold">{f.label}</span>
                <span className="mt-1 text-[10px] leading-tight text-muted-foreground">
                  {busy ? "Tayyorlanmoqda…" : f.description}
                </span>
              </button>
            )
          })}
        </div>
        {design ? (
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            {design.width} × {design.height} px · {design.elements.length} qatlam
            {" · "}
            <Link href="/pricing" className="text-primary hover:underline">
              Reja limitlari
            </Link>
          </p>
        ) : null}
        <Button className="mt-4 w-full" size="sm" variant="outline" onClick={() => setOpen(false)}>
          Yopish
        </Button>
      </Modal>
    </>
  )
}
