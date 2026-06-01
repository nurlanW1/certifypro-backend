"use client"

import { QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { editorChrome } from "@/lib/editor/editor-chrome"

import { ToolHint, ToolSection } from "./tool-panel-primitives"

type Props = {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
}

export function QrToolPanel({ value, onChange, onGenerate }: Props) {
  return (
    <div className="space-y-4">
      <ToolSection title="QR kod">
        <div className="space-y-2">
          <Label className="text-[11px] font-medium text-[#64748b]">URL yoki matn</Label>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={editorChrome.input}
            placeholder="https://gildia.uz/verify"
          />
          <Button type="button" className="h-9 w-full gap-2 shadow-sm" onClick={onGenerate}>
            <QrCode className="size-4" />
            QR yaratish
          </Button>
        </div>
      </ToolSection>
      <ToolHint>
        QR kod artboard markaziga yaqin joyga qo‘shiladi. O‘lcham va ranglarni o‘ng paneldan tahrirlang.
      </ToolHint>
    </div>
  )
}
