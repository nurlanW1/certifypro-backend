"use client"

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CanvasElement, TextAlign } from "@/lib/editor/canvas-types"
import { FONT_FAMILIES, FONT_WEIGHT_OPTIONS } from "@/lib/editor/canvas-types"
import { cn } from "@/lib/utils"

import {
  ColorField,
  InspectorDivider,
  InspectorField,
  InspectorSection,
  NumField,
  inspectorInput,
  inspectorTextarea,
} from "./inspector-primitives"
import { TransformInspector } from "./transform-inspector"

type Props = {
  element: CanvasElement
  onUpdate: (patch: Partial<CanvasElement>) => void
}

export function TextInspector({ element, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <InspectorSection title="Matn">
        <InspectorField label="Kontent">
          <textarea
            value={element.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            rows={3}
            className={inspectorTextarea}
          />
        </InspectorField>
        <InspectorField label="Shrift oilasi">
          <Select
            value={element.fontFamily}
            onValueChange={(v) => v && onUpdate({ fontFamily: v })}
          >
            <SelectTrigger className={inspectorInput}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InspectorField>
        <div className="grid grid-cols-2 gap-2">
          <NumField
            label="O‘lchami"
            value={element.fontSize}
            onChange={(fontSize) => onUpdate({ fontSize: Math.max(8, fontSize) })}
            min={8}
            max={200}
            suffix="px"
          />
          <InspectorField label="Og‘irligi">
            <Select
              value={String(element.fontWeight)}
              onValueChange={(v) => v && onUpdate({ fontWeight: Number(v) })}
            >
              <SelectTrigger className={inspectorInput}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHT_OPTIONS.map((w) => (
                  <SelectItem key={w.value} value={String(w.value)}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InspectorField>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <NumField
            label="Qator bal."
            value={element.lineHeight}
            onChange={(lineHeight) => onUpdate({ lineHeight: Math.max(0.8, lineHeight) })}
            min={0.8}
            max={3}
            step={0.05}
          />
          <NumField
            label="Harflar orasi"
            value={element.letterSpacing}
            onChange={(letterSpacing) => onUpdate({ letterSpacing })}
            min={-4}
            max={24}
            step={0.5}
            suffix="px"
          />
        </div>
        <ColorField label="Rang" value={element.color} onChange={(color) => onUpdate({ color })} />
        <InspectorField label="Tekislash">
          <div className="flex gap-1 rounded-md border border-[#e8ebf0] bg-[#fafbfc] p-0.5">
            {(
              [
                ["left", AlignLeft],
                ["center", AlignCenter],
                ["right", AlignRight],
              ] as const
            ).map(([align, Icon]) => (
              <Button
                key={align}
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "size-8 text-[#64748b] hover:bg-white hover:text-[#0f172a]",
                  element.textAlign === align &&
                    "bg-white text-[#2563eb] shadow-sm ring-1 ring-[#e2e5ea]"
                )}
                onClick={() => onUpdate({ textAlign: align as TextAlign })}
              >
                <Icon className="size-4" />
              </Button>
            ))}
          </div>
        </InspectorField>
      </InspectorSection>

      <InspectorDivider />
      <TransformInspector element={element} onUpdate={onUpdate} />
    </div>
  )
}
