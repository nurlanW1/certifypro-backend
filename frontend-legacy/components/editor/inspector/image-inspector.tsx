"use client"

import { useRef } from "react"
import { ImagePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CanvasElement } from "@/lib/editor/canvas-types"

import {
  InspectorDivider,
  InspectorField,
  InspectorSection,
  inspectorInput,
} from "./inspector-primitives"
import { TransformInspector } from "./transform-inspector"

type Props = {
  element: CanvasElement
  onUpdate: (patch: Partial<CanvasElement>) => void
  onReplaceImage: (file: File) => void
}

export function ImageInspector({ element, onUpdate, onReplaceImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-4">
      <InspectorSection title="Rasm">
        <div className="overflow-hidden rounded-lg border border-[#e8ebf0] bg-[#fafbfc]">
          {element.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={element.src} alt={element.name} className="aspect-video w-full object-contain" />
          ) : (
            <div className="flex aspect-video items-center justify-center text-xs text-[#94a3b8]">
              Rasm yuklanmagan
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onReplaceImage(file)
            e.target.value = ""
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-full gap-2 border-[#e2e5ea] text-xs"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-3.5" />
          Rasmni almashtirish
        </Button>
        <InspectorField label="Moslashtirish">
          <Select
            value={element.objectFit}
            onValueChange={(v) => v && onUpdate({ objectFit: v as "cover" | "contain" })}
          >
            <SelectTrigger className={inspectorInput}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover — to‘ldirish</SelectItem>
              <SelectItem value="contain">Contain — sig‘dirish</SelectItem>
            </SelectContent>
          </Select>
        </InspectorField>
      </InspectorSection>

      <InspectorDivider />
      <TransformInspector element={element} onUpdate={onUpdate} />
    </div>
  )
}
