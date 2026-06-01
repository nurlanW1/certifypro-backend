'use client'

import { Trash2 } from 'lucide-react'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editorStore'

export function ShapeProperties() {
  const { fabricCanvas, selectedObject, setSelectedObject, pushHistory } = useEditorStore()
  const shape =
    selectedObject instanceof fabric.Rect || selectedObject instanceof fabric.Circle
      ? selectedObject
      : null

  if (!shape || !fabricCanvas) return null

  const obj = shape as fabric.Object

  const update = (props: Record<string, unknown>) => {
    obj.set(props)
    obj.setCoords()
    fabricCanvas.requestRenderAll()
    pushHistory()
  }

  const fill = (shape.fill as string) ?? '#EEEDFE'
  const stroke = (shape.stroke as string) ?? '#534AB7'
  const strokeWidth = shape.strokeWidth ?? 0
  const opacity = Math.round((shape.opacity ?? 1) * 100)
  const isRect = shape instanceof fabric.Rect
  const rx = isRect ? (shape as fabric.Rect).rx ?? 0 : 0

  const scaledW = Math.round((shape.width ?? 0) * (shape.scaleX ?? 1))
  const scaledH = Math.round((shape.height ?? 0) * (shape.scaleY ?? 1))

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="shape-fill" className="gildia-label">
          To&apos;ldirish
        </label>
        <input
          id="shape-fill"
          type="color"
          className="mt-1 h-10 w-full rounded-lg border border-border p-1"
          value={fill.startsWith('#') ? fill : '#EEEDFE'}
          onChange={(e) => update({ fill: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="shape-stroke" className="gildia-label">
          Chegara ({strokeWidth}px)
        </label>
        <input
          id="shape-stroke-w"
          type="range"
          min={0}
          max={20}
          value={strokeWidth}
          className="mt-2 w-full accent-brand-600"
          onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
        />
        <input
          id="shape-stroke"
          type="color"
          className="mt-2 h-8 w-full rounded border border-border p-0.5"
          value={stroke.startsWith('#') ? stroke : '#534AB7'}
          onChange={(e) => update({ stroke: e.target.value })}
        />
      </div>

      {isRect && (
        <div>
          <label htmlFor="border-radius" className="gildia-label">
            Border radius ({rx}px)
          </label>
          <input
            id="border-radius"
            type="range"
            min={0}
            max={50}
            value={rx}
            className="mt-2 w-full accent-brand-600"
            onChange={(e) => {
              const v = Number(e.target.value)
              ;(shape as fabric.Rect).set({ rx: v, ry: v })
              shape.setCoords()
              fabricCanvas.requestRenderAll()
              pushHistory()
            }}
          />
        </div>
      )}

      <div>
        <label htmlFor="shape-opacity" className="gildia-label">
          Shaffoflik ({opacity}%)
        </label>
        <input
          id="shape-opacity"
          type="range"
          min={0}
          max={100}
          value={opacity}
          className="mt-2 w-full accent-brand-600"
          onChange={(e) => update({ opacity: Number(e.target.value) / 100 })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="shape-w" className="gildia-label">
            W
          </label>
          <input
            id="shape-w"
            type="number"
            className="gildia-input mt-1"
            value={scaledW}
            onChange={(e) => {
              const w = Number(e.target.value)
              obj.set({ scaleX: w / (shape.width ?? 1) })
              obj.setCoords()
              fabricCanvas.requestRenderAll()
              pushHistory()
            }}
          />
        </div>
        <div>
          <label htmlFor="shape-h" className="gildia-label">
            H
          </label>
          <input
            id="shape-h"
            type="number"
            className="gildia-input mt-1"
            value={scaledH}
            onChange={(e) => {
              const h = Number(e.target.value)
              obj.set({ scaleY: h / (shape.height ?? 1) })
              obj.setCoords()
              fabricCanvas.requestRenderAll()
              pushHistory()
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          fabricCanvas.remove(obj)
          fabricCanvas.discardActiveObject()
          fabricCanvas.requestRenderAll()
          setSelectedObject(null)
          pushHistory()
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger-light py-2.5 text-sm font-medium text-danger"
      >
        <Trash2 className="h-4 w-4" />
        O&apos;chirish
      </button>
    </div>
  )
}
