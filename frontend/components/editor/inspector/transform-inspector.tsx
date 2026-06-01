"use client"

import type { CanvasElement } from "@/lib/editor/canvas-types"

import { InspectorSection, NumField, SliderField } from "./inspector-primitives"

type Props = {
  element: CanvasElement
  onUpdate: (patch: Partial<CanvasElement>) => void
  showOpacity?: boolean
}

export function TransformInspector({ element, onUpdate, showOpacity = true }: Props) {
  return (
    <InspectorSection title="Joylashuv va o‘lcham">
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X" value={element.x} onChange={(x) => onUpdate({ x })} suffix="px" />
        <NumField label="Y" value={element.y} onChange={(y) => onUpdate({ y })} suffix="px" />
        <NumField
          label="Kenglik"
          value={element.width}
          onChange={(width) => onUpdate({ width: Math.max(1, width) })}
          min={1}
          suffix="px"
        />
        <NumField
          label="Balandlik"
          value={element.height}
          onChange={(height) => onUpdate({ height: Math.max(1, height) })}
          min={1}
          suffix="px"
        />
      </div>
      <NumField
        label="Aylanish"
        value={element.rotation}
        onChange={(rotation) => onUpdate({ rotation })}
        min={-360}
        max={360}
        suffix="°"
      />
      {showOpacity ? (
        <SliderField
          label="Shaffoflik"
          value={element.opacity}
          onChange={(opacity) => onUpdate({ opacity })}
          min={0.05}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      ) : null}
    </InspectorSection>
  )
}
