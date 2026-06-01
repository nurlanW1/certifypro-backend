'use client'

import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import { getFabricObjectType } from '@/lib/editor/fabric-utils'
import { AlignmentTools } from '@/components/editor/properties/AlignmentTools'
import { TextProperties } from '@/components/editor/properties/TextProperties'
import { ImageProperties } from '@/components/editor/properties/ImageProperties'
import { ShapeProperties } from '@/components/editor/properties/ShapeProperties'
import { CanvasProperties } from '@/components/editor/properties/CanvasProperties'

export function EditorProperties() {
  const { selectedObject } = useEditorStore()

  const type = selectedObject ? getFabricObjectType(selectedObject) : null

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-l border-border bg-surface md:flex">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-text-primary">Xususiyatlar</h2>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <AlignmentTools />
        <div className="border-t border-border pt-4">
          {!selectedObject && <CanvasProperties />}
          {type === 'text' && <TextProperties />}
          {type === 'image' && <ImageProperties />}
          {(type === 'shape' || type === 'line') && <ShapeProperties />}
          {selectedObject && type === 'unknown' && (
            <p className="text-xs text-text-muted">Bu element uchun sozlamalar cheklangan.</p>
          )}
        </div>
      </div>
    </aside>
  )
}
