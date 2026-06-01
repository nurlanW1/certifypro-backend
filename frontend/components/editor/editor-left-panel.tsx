"use client"

import { useState, type ReactNode } from "react"
import {
  Hand,
  ImageIcon,
  Layers,
  LayoutTemplate,
  MousePointer2,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  Shapes,
  Type,
  Upload,
} from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { EditorToolId } from "@/lib/editor/editor-tools"
import { editorChrome } from "@/lib/editor/editor-chrome"
import { cn } from "@/lib/utils"

export type { EditorToolId } from "@/lib/editor/editor-tools"

const TOOLS: {
  id: EditorToolId
  label: string
  short: string
  icon: ReactNode
}[] = [
  { id: "select", label: "Ma’lumot", short: "Ma’lumot", icon: <MousePointer2 className={editorChrome.railIcon} /> },
  { id: "hand", label: "Grafik", short: "Grafik", icon: <Hand className={editorChrome.railIcon} /> },
  { id: "text", label: "Matn", short: "Matn", icon: <Type className={editorChrome.railIcon} /> },
  { id: "uploads", label: "Yuklash", short: "Yuklash", icon: <Upload className={editorChrome.railIcon} /> },
  { id: "elements", label: "Elementlar", short: "Element", icon: <ImageIcon className={editorChrome.railIcon} /> },
  { id: "shapes", label: "Shakllar", short: "Shakl", icon: <Shapes className={editorChrome.railIcon} /> },
  { id: "qr", label: "QR kod", short: "QR", icon: <QrCode className={editorChrome.railIcon} /> },
  { id: "templates", label: "Shablonlar", short: "Shablon", icon: <LayoutTemplate className={editorChrome.railIcon} /> },
  { id: "brand", label: "Brand Kit", short: "Brend", icon: <Palette className={editorChrome.railIcon} /> },
  { id: "layers", label: "Qatlamlar", short: "Qatlam", icon: <Layers className={editorChrome.railIcon} /> },
]

type Props = {
  active: EditorToolId
  onChange: (id: EditorToolId) => void
  children: ReactNode
}

export function EditorLeftPanel({ active, onChange, children }: Props) {
  const [panelOpen, setPanelOpen] = useState(true)
  const activeTool = TOOLS.find((t) => t.id === active)

  return (
    <aside
      className={cn(
        editorChrome.panel,
        "flex h-full min-h-0 shrink-0 flex-row border-r bg-white"
      )}
    >
      <nav
        className={cn(
          editorChrome.rail,
          "flex h-full max-h-full shrink-0 flex-col justify-between overflow-y-auto"
        )}
        aria-label="Dizayn asboblari"
      >
        <div className="flex flex-col">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              title={tool.label}
              onClick={() => {
                onChange(tool.id)
                setPanelOpen(true)
              }}
              className={cn(
                editorChrome.railBtn,
                active === tool.id ? editorChrome.railBtnActive : editorChrome.railBtnIdle
              )}
            >
              {tool.icon}
              <span className="max-w-full truncate">{tool.short}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          title={panelOpen ? "Panelni yopish" : "Panelni ochish"}
          onClick={() => setPanelOpen((o) => !o)}
          className={cn(editorChrome.railBtn, editorChrome.railBtnIdle, "mb-1 mt-1 shrink-0")}
          aria-expanded={panelOpen}
        >
          {panelOpen ? (
            <PanelLeftClose className={editorChrome.railIcon} />
          ) : (
            <PanelLeftOpen className={editorChrome.railIcon} />
          )}
        </button>
      </nav>

      <div
        className={cn(
          "flex h-full min-h-0 flex-col overflow-hidden border-l border-[#e8ebf0] transition-[width] duration-200 ease-out",
          panelOpen ? "w-[300px]" : "w-0 border-l-0"
        )}
      >
        <div className={cn(editorChrome.panelHeader, "min-w-[300px] shrink-0")}>
          <p className={editorChrome.panelTitle}>{activeTool?.label ?? "Asboblar"}</p>
        </div>
        <ScrollArea className="min-h-0 min-w-[300px] flex-1">
          <div className={editorChrome.panelBody}>{children}</div>
        </ScrollArea>
      </div>
    </aside>
  )
}

export { TOOLS }
