"use client"

import { Input } from "@/components/ui/input"
import type { CanvasElement } from "@/lib/editor/canvas-types"

import {
  ColorField,
  InspectorDivider,
  InspectorField,
  InspectorSection,
  NumField,
  inspectorInput,
} from "./inspector-primitives"
import { TransformInspector } from "./transform-inspector"

type Props = {
  element: CanvasElement
  onUpdate: (patch: Partial<CanvasElement>) => void
}

export function QrInspector({ element, onUpdate }: Props) {
  const size = Math.round(element.width)

  return (
    <div className="space-y-4">
      <InspectorSection title="QR kod">
        <InspectorField label="Qiymat (URL yoki matn)">
          <Input
            value={element.qrValue}
            onChange={(e) => onUpdate({ qrValue: e.target.value })}
            className={inspectorInput}
            placeholder="https://..."
          />
        </InspectorField>
        <NumField
          label="O‘lcham"
          value={size}
          onChange={(v) => {
            const s = Math.max(32, v)
            onUpdate({ width: s, height: s })
          }}
          min={32}
          max={400}
          suffix="px"
        />
        <ColorField
          label="Old fon (modullar)"
          value={element.qrForeground}
          onChange={(qrForeground) => onUpdate({ qrForeground, color: qrForeground })}
        />
        <ColorField
          label="Orqa fon"
          value={element.qrBackground}
          onChange={(qrBackground) => onUpdate({ qrBackground, fill: qrBackground })}
        />
      </InspectorSection>

      <InspectorDivider />
      <TransformInspector
        element={element}
        onUpdate={(patch) => {
          if (patch.width !== undefined && patch.height === undefined) {
            onUpdate({ ...patch, height: patch.width })
          } else if (patch.height !== undefined && patch.width === undefined) {
            onUpdate({ ...patch, width: patch.height })
          } else {
            onUpdate(patch)
          }
        }}
      />
    </div>
  )
}
