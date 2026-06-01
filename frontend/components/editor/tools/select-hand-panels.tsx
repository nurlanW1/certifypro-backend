"use client"

import { MousePointer2, Hand } from "lucide-react"

import { ToolHint, ToolSection } from "./tool-panel-primitives"

export function SelectToolPanel() {
  return (
    <div className="space-y-4">
      <ToolSection title="Tanlash">
        <ToolHint>
          Elementlarni tanlash va sudrab ko‘chirish uchun <strong>Tanlash</strong> asbobidan foydalaning.
          Bo‘sh joyni bosing — tanlov bekor qilinadi.
        </ToolHint>
        <ul className="space-y-1.5 text-[10px] text-[#64748b]">
          <li className="flex items-center gap-2">
            <MousePointer2 className="size-3.5 shrink-0 text-[#2563eb]" />
            Chap tugma — tanlash / ko‘chirish
          </li>
          <li>Shift + bosish — ko‘p tanlov (tez orada)</li>
          <li className="flex items-center gap-2">
            <kbd className="rounded border border-[#e2e5ea] bg-white px-1 font-mono text-[9px]">Del</kbd>
            — o‘chirish
          </li>
        </ul>
      </ToolSection>
    </div>
  )
}

export function HandToolPanel() {
  return (
    <div className="space-y-4">
      <ToolSection title="Qo‘l (pan)">
        <ToolHint>
          Kanvasni sudrab harakatlantirish uchun <strong>Qo‘l</strong> rejimini yoqing yoki bo‘sh joyda{" "}
          <kbd className="rounded border px-1 font-mono text-[9px]">Space</kbd> + sudrab torting.
        </ToolHint>
        <ul className="space-y-1.5 text-[10px] text-[#64748b]">
          <li className="flex items-center gap-2">
            <Hand className="size-3.5 shrink-0 text-[#2563eb]" />
            Chap tugma — pan
          </li>
          <li>O‘ng tugma — pan (har doim)</li>
          <li>G‘ildirak — zoom</li>
        </ul>
      </ToolSection>
    </div>
  )
}
