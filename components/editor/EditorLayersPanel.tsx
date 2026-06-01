'use client'

import { X, Layers } from 'lucide-react'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import { getFabricObjectType } from '@/lib/editor/fabric-utils'
import { cn } from '@/lib/utils'

export function EditorLayersPanel() {
  const {
    fabricCanvas,
    layersOpen,
    setLayersOpen,
    selectedObject,
    setSelectedObject,
  } = useEditorStore()

  if (!layersOpen || !fabricCanvas) return null

  const objects = [...fabricCanvas.getObjects()].reverse()

  return (
    <div className="absolute bottom-20 left-16 z-20 w-56 rounded-xl border border-border bg-surface shadow-lg">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="flex items-center gap-2 text-xs font-semibold text-text-primary">
          <Layers className="h-4 w-4" />
          Qatlamlar
        </span>
        <button
          type="button"
          onClick={() => setLayersOpen(false)}
          className="rounded p-1 text-text-muted hover:bg-brand-50"
          aria-label="Yopish"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="max-h-48 overflow-y-auto p-2">
        {objects.length === 0 ? (
          <li className="px-2 py-3 text-xs text-text-muted">Qatlamlar yo&apos;q</li>
        ) : (
          objects.map((obj, i) => {
            const active = selectedObject === obj
            const type = getFabricObjectType(obj)
            const label =
              type === 'text' && obj instanceof fabric.IText
                ? (obj.text?.slice(0, 20) ?? 'Matn')
                : `${type} ${objects.length - i}`

            return (
              <li key={`layer-${i}-${obj.type}`}>
                <button
                  type="button"
                  onClick={() => {
                    fabricCanvas.setActiveObject(obj)
                    fabricCanvas.requestRenderAll()
                    setSelectedObject(obj)
                  }}
                  className={cn(
                    'w-full rounded-lg px-2 py-2 text-left text-xs transition-all duration-150',
                    active
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-text-secondary hover:bg-surface-secondary'
                  )}
                >
                  {label}
                </button>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
