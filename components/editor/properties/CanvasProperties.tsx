'use client'

import { useEditorStore } from '@/store/editorStore'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/lib/editor/constants'

export function CanvasProperties() {
  const { fabricCanvas, pushHistory } = useEditorStore()

  const bg =
    (fabricCanvas?.backgroundColor as string | undefined) ??
    (typeof fabricCanvas?.backgroundColor === 'string' ? fabricCanvas.backgroundColor : '#ffffff')

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-text-primary">Canvas</p>
      <p className="text-xs text-text-muted">
        A4 • {CANVAS_WIDTH}×{CANVAS_HEIGHT} px
      </p>
      <div>
        <label htmlFor="canvas-bg" className="gildia-label">
          Fon rangi
        </label>
        <input
          id="canvas-bg"
          type="color"
          className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-border bg-surface p-1"
          value={typeof bg === 'string' && bg.startsWith('#') ? bg : '#ffffff'}
          onChange={(e) => {
            if (!fabricCanvas) return
            fabricCanvas.setBackgroundColor(e.target.value, () => {
              fabricCanvas.requestRenderAll()
              pushHistory()
            })
          }}
        />
      </div>
    </div>
  )
}
