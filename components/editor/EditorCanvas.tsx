'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import { CANVAS_DEFAULTS } from '@/lib/constants'

export function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const setCanvasData = useEditorStore((s) => s.setCanvasData)

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_DEFAULTS.width,
      height: CANVAS_DEFAULTS.height,
      backgroundColor: '#ffffff',
    })

    fabricRef.current = canvas

    canvas.on('object:modified', () => {
      setCanvasData({
        version: '5.3.0',
        objects: canvas.toJSON().objects ?? [],
      })
    })

    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
  }, [setCanvasData])

  return (
    <div className="flex flex-1 items-center justify-center overflow-auto bg-surface-tertiary p-4">
      <div className="shadow-md">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
