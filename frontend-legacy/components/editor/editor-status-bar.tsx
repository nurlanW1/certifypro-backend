"use client"

import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EditorShortcutsTrigger } from "@/components/editor/editor-ui-states"
import { editorChrome } from "@/lib/editor/editor-chrome"
import { cn } from "@/lib/utils"

type Props = {
  zoom: number
  onZoomChange: (z: number) => void
  onZoomFit: () => void
  onZoomPreset: (percent: number) => void
  onZoomStep: (direction: 1 | -1) => void
  artboardSize: string
  selectedLabel?: string
  onOpenShortcuts: () => void
}

const PRESETS = [25, 50, 100] as const

export function EditorStatusBar({
  zoom,
  onZoomChange,
  onZoomFit,
  onZoomPreset,
  onZoomStep,
  artboardSize,
  selectedLabel,
  onOpenShortcuts,
}: Props) {
  return (
    <footer className={editorChrome.statusBar}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <EditorShortcutsTrigger onClick={onOpenShortcuts} />
        <span className="hidden h-4 w-px bg-[#e2e5ea] sm:block" aria-hidden />
        <span className="min-w-0 truncate">
          {selectedLabel ? (
            <>
              <span className="text-[#94a3b8]">Tanlangan:</span>{" "}
              <span className="font-medium text-[#334155]">{selectedLabel}</span>
            </>
          ) : (
            <span className="hidden text-[#94a3b8] md:inline">
              Scroll — zoom · Space / o‘ng tugma — pan
            </span>
          )}
        </span>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
        <span className={cn(editorChrome.badge, "hidden border-0 bg-transparent px-0 lg:inline-flex")}>
          {artboardSize}
        </span>

        <div className={editorChrome.toolbarGroup}>
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onZoomPreset(p)}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-semibold tabular-nums transition-all duration-150",
                zoom === p
                  ? "bg-white text-[#4f46e5] shadow-sm ring-1 ring-[#e0e7ff]"
                  : "text-[#64748b] hover:bg-white hover:text-[#0f172a]"
              )}
            >
              {p}%
            </button>
          ))}
          <span className="mx-0.5 h-4 w-px bg-[#e2e5ea]" aria-hidden />
          <button
            type="button"
            onClick={onZoomFit}
            className="rounded-md px-2 py-1 text-[10px] font-semibold text-[#64748b] transition-colors hover:bg-white hover:text-[#0f172a]"
            title="Artboardni ekranga moslashtirish"
          >
            Fit
          </button>
          <span className="mx-0.5 h-4 w-px bg-[#e2e5ea]" aria-hidden />
          <Button
            variant="ghost"
            size="icon-sm"
            className={editorChrome.iconBtn}
            onClick={() => onZoomStep(-1)}
            title="Kichiklashtirish"
          >
            <Minus className="size-3.5 stroke-[1.75]" />
          </Button>
          <button
            type="button"
            className="min-w-[2.75rem] rounded-md px-1 py-1 font-mono text-[11px] font-semibold tabular-nums text-[#334155] transition-colors hover:bg-white hover:text-[#4f46e5]"
            onClick={() => onZoomChange(100)}
            title="100%"
          >
            {zoom}%
          </button>
          <Button
            variant="ghost"
            size="icon-sm"
            className={editorChrome.iconBtn}
            onClick={() => onZoomStep(1)}
            title="Kattalashtirish"
          >
            <Plus className="size-3.5 stroke-[1.75]" />
          </Button>
        </div>
      </div>
    </footer>
  )
}
