"use client"

import type { CanvasElement } from "@/lib/editor/canvas-types"

import {
  ColorField,
  InspectorDivider,
  InspectorSection,
  NumField,
  SliderField,
} from "./inspector-primitives"
import { TransformInspector } from "./transform-inspector"

type Props = {
  element: CanvasElement
  onUpdate: (patch: Partial<CanvasElement>) => void
}

export function ShapeInspector({ element, onUpdate }: Props) {
  const isRect = element.shapeKind === "rect" || element.shapeKind === "star"
  const fillHex = element.fill.startsWith("#") ? element.fill : "#2563eb"

  return (
    <div className="space-y-4">
      <InspectorSection title="Shakl">
        <ColorField label="To‘ldirish" value={fillHex} onChange={(fill) => onUpdate({ fill })} />
        <ColorField
          label="Kontur rangi"
          value={element.stroke}
          onChange={(stroke) => onUpdate({ stroke })}
        />
        <NumField
          label="Kontur qalinligi"
          value={element.strokeWidth}
          onChange={(strokeWidth) => onUpdate({ strokeWidth: Math.max(0, strokeWidth) })}
          min={0}
          max={24}
          suffix="px"
        />
        {isRect ? (
          <NumField
            label="Burchak radiusi"
            value={element.cornerRadius}
            onChange={(cornerRadius) => onUpdate({ cornerRadius: Math.max(0, cornerRadius) })}
            min={0}
            max={120}
            suffix="px"
          />
        ) : null}
        <SliderField
          label="Shaffoflik"
          value={element.opacity}
          onChange={(opacity) => onUpdate({ opacity })}
          min={0.05}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      </InspectorSection>

      <InspectorDivider />
      <TransformInspector element={element} onUpdate={onUpdate} showOpacity={false} />
    </div>
  )
}
