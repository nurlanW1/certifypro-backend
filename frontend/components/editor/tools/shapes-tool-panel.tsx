"use client"

import type { ReactNode } from "react"
import { Circle, Minus, Square, Squircle } from "lucide-react"

import { ToolSection } from "./tool-panel-primitives"
import { cn } from "@/lib/utils"
import { editorChrome } from "@/lib/editor/editor-chrome"

type ShapeAction =
  | "rectangle"
  | "rounded-rect"
  | "circle"
  | "line"
  | "blob"

type Props = {
  onAddShape: (shape: ShapeAction) => void
}

const SHAPES: { id: ShapeAction; label: string; glyph: string; icon?: ReactNode }[] = [
  { id: "rectangle", label: "To‘rtburchak", glyph: "□" },
  { id: "rounded-rect", label: "Yumaloq burchak", glyph: "▢", icon: <Squircle className="size-4" /> },
  { id: "circle", label: "Doira", glyph: "○", icon: <Circle className="size-4" /> },
  { id: "line", label: "Chiziq", glyph: "─", icon: <Minus className="size-4" /> },
  { id: "blob", label: "Dekor blob", glyph: "◉", icon: <Square className="size-4 rounded-full" /> },
]

export function ShapesToolPanel({ onAddShape }: Props) {
  return (
    <div className="space-y-4">
      <ToolSection title="Shakllar">
        <div className="grid grid-cols-2 gap-2">
          {SHAPES.map((s) => (
            <button
              key={s.id}
              type="button"
              title={s.label}
              onClick={() => onAddShape(s.id)}
              className={cn(
                editorChrome.toolCard,
                "flex flex-col items-center justify-center gap-1.5 py-4 text-center"
              )}
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#eef2ff] text-lg text-[#2563eb]">
                {s.icon ?? s.glyph}
              </span>
              <span className="text-[10px] font-medium leading-tight text-[#334155]">{s.label}</span>
            </button>
          ))}
        </div>
      </ToolSection>
    </div>
  )
}
