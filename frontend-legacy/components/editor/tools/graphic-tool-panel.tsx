"use client"

import { Hand, MousePointer2, Move, RotateCw, Maximize2 } from "lucide-react"

import { ToolHint, ToolSection } from "./tool-panel-primitives"

/** Pan, move, resize, rotate — graphic manipulation (not data entry) */
export function GraphicToolPanel() {
  return (
    <div className="space-y-4">
      <ToolSection title="Ko‘chirish (pan)">
        <ToolHint>
          Kanvasni sudrab harakatlantirish uchun <strong>Qo‘l</strong> rejimini yoqing yoki bo‘sh joyda{" "}
          <kbd className="rounded border border-[#e2e5ea] bg-white px-1 font-mono text-[9px]">Space</kbd>{" "}
          + sudrab torting.
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

      <ToolSection title="Tanlash va ko‘chirish">
        <ToolHint>
          <strong>Ma’lumot</strong> panelida matn kiriting. Elementlarni tanlash va joylashtirish uchun kanvasda
          tanlang yoki <strong>Matn</strong> / <strong>Yuklash</strong> asboblaridan foydalaning.
        </ToolHint>
        <ul className="space-y-2 text-[10px] text-[#64748b]">
          <li className="flex items-start gap-2">
            <MousePointer2 className="mt-0.5 size-3.5 shrink-0 text-[#2563eb]" />
            <span>
              <span className="font-medium text-[#334155]">Tanlash</span> — kanvasda elementni bosing, sudrab
              ko‘chiring
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Maximize2 className="mt-0.5 size-3.5 shrink-0 text-[#2563eb]" />
            <span>
              <span className="font-medium text-[#334155]">Kattalashtirish</span> — tanlangan element burchak
              tutqichlari
            </span>
          </li>
          <li className="flex items-start gap-2">
            <RotateCw className="mt-0.5 size-3.5 shrink-0 text-[#2563eb]" />
            <span>
              <span className="font-medium text-[#334155]">Aylantirish</span> — yuqoridagi aylantirish tugmasi
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Move className="mt-0.5 size-3.5 shrink-0 text-[#2563eb]" />
            <span>
              Matnni tahrirlash — elementga <strong>ikki marta bosing</strong>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <kbd className="rounded border border-[#e2e5ea] bg-white px-1 font-mono text-[9px]">Del</kbd>
            — tanlangan elementni o‘chirish
          </li>
        </ul>
      </ToolSection>
    </div>
  )
}
