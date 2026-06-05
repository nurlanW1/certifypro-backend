'use client'

import { Trash2 } from 'lucide-react'
import { fabric } from 'fabric'
import { ImageUploader } from '@/components/editor/ImageUploader'
import { useEditorStore } from '@/store/editorStore'
export function ImageProperties() {
  const { fabricCanvas, selectedObject, setSelectedObject, pushHistory } = useEditorStore()
  const image = selectedObject instanceof fabric.Image ? selectedObject : null

  if (!image || !fabricCanvas) return null

  const opacity = Math.round((image.opacity ?? 1) * 100)
  const scaledW = Math.round((image.width ?? 0) * (image.scaleX ?? 1))
  const scaledH = Math.round((image.height ?? 0) * (image.scaleY ?? 1))

  const update = (props: Partial<fabric.Image>) => {
    image.set(props)
    image.setCoords()
    fabricCanvas.requestRenderAll()
    pushHistory()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Rasm elementi</p>

      <div>
        <p className="gildia-label mb-2">Rasmni almashtirish</p>
        <ImageUploader
          onUpload={(dataUrl) => {
            fabric.Image.fromURL(dataUrl, (img) => {
              if (!img) return
              img.set({
                left: image.left,
                top: image.top,
                scaleX: image.scaleX,
                scaleY: image.scaleY,
                angle: image.angle,
                opacity: image.opacity,
              })
              fabricCanvas.remove(image)
              fabricCanvas.add(img)
              fabricCanvas.setActiveObject(img)
              fabricCanvas.requestRenderAll()
              setSelectedObject(img)
              pushHistory()
            })
          }}
        />
      </div>

      <div>
        <label htmlFor="img-opacity" className="gildia-label">
          Shaffoflik ({opacity}%)
        </label>
        <input
          id="img-opacity"
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
          <label htmlFor="img-w" className="gildia-label">
            W
          </label>
          <input
            id="img-w"
            type="number"
            className="gildia-input mt-1"
            value={scaledW}
            onChange={(e) => {
              const w = Number(e.target.value)
              image.set({ scaleX: w / (image.width ?? 1) })
              image.setCoords()
              fabricCanvas.requestRenderAll()
              pushHistory()
            }}
          />
        </div>
        <div>
          <label htmlFor="img-h" className="gildia-label">
            H
          </label>
          <input
            id="img-h"
            type="number"
            className="gildia-input mt-1"
            value={scaledH}
            onChange={(e) => {
              const h = Number(e.target.value)
              image.set({ scaleY: h / (image.height ?? 1) })
              image.setCoords()
              fabricCanvas.requestRenderAll()
              pushHistory()
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          fabricCanvas.remove(image)
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
