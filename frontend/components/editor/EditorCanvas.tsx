'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/lib/editor/constants'
import { isFabricCanvasJson, serializeCanvas } from '@/lib/editor/fabric-utils'
import { loadSvgOntoCanvas } from '@/lib/editor/svg-to-fabric'

export function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initializedRef = useRef(false)
  const hydratingRef = useRef(true)

  const {
    setFabricCanvas,
    zoom,
    setZoom,
    canvasData,
    canvasReady,
    setCanvasReady,
    setSelectedObject,
    pushHistory,
    setDirty,
    syncFromCanvas,
    printPreview,
  } = useEditorStore()

  useEffect(() => {
    if (!canvasRef.current || initializedRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
    })

    initializedRef.current = true
    setFabricCanvas(fabricCanvas)

    const onSelect = (e: { selected?: fabric.Object[] }) => {
      const target = e.selected?.[0] ?? null
      setSelectedObject(target)
    }

    fabricCanvas.on('selection:created', onSelect)
    fabricCanvas.on('selection:updated', onSelect)
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null))

    const onModified = () => {
      setDirty(true)
      syncFromCanvas()
      pushHistory()
    }

    fabricCanvas.on('object:modified', onModified)
    fabricCanvas.on('object:added', () => {
      if (hydratingRef.current) return
      setDirty(true)
      syncFromCanvas()
    })

    const initialSnapshot = serializeCanvas(fabricCanvas)
    useEditorStore.setState({
      history: [initialSnapshot],
      historyIndex: 0,
    })

    return () => {
      fabricCanvas.dispose()
      initializedRef.current = false
      setFabricCanvas(null)
      setCanvasReady(false)
    }
  }, [setFabricCanvas, setSelectedObject, pushHistory, setDirty, syncFromCanvas, setCanvasReady])

  useEffect(() => {
    const { fabricCanvas } = useEditorStore.getState()
    if (!fabricCanvas || canvasReady) return
    if (!canvasData || !isFabricCanvasJson(canvasData)) {
      hydratingRef.current = false
      setCanvasReady(true)
      return
    }

    hydratingRef.current = true
    fabricCanvas.loadFromJSON(canvasData as object, () => {
      const trySvg = async () => {
        const objs = fabricCanvas.getObjects()
        const { templateSvg } = useEditorStore.getState()
        if (objs.length === 0 && templateSvg) {
          const loaded = await loadSvgOntoCanvas(fabricCanvas, templateSvg)
          if (loaded) {
            useEditorStore.getState().setDirty(true)
          }
        }
        fabricCanvas.renderAll()
        hydratingRef.current = false
        const snapshot = serializeCanvas(fabricCanvas)
        useEditorStore.setState({
          history: [snapshot],
          historyIndex: 0,
          canvasReady: true,
        })
      }
      void trySvg()
    })
  }, [canvasData, canvasReady, setCanvasReady])

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 3))
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.3))
  const handleFitScreen = () => setZoom(0.75)

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-canvas">
      <div className="flex flex-1 items-center justify-center overflow-auto p-6 md:p-10">
        <div
          className="shadow-lg transition-transform duration-150"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <div className="relative rounded-sm border border-border bg-surface">
            {printPreview && (
              <div
                className="pointer-events-none absolute inset-2 rounded border border-dashed border-brand-400/60"
                aria-hidden
              />
            )}
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-divide bg-ink px-2 py-1 shadow-sm">
        <button
          type="button"
          onClick={handleZoomOut}
          className="rounded p-1.5 text-text-secondary transition-all duration-150 hover:bg-surface-secondary"
          aria-label="Kichiklashtirish"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-[44px] px-2 text-center text-xs text-text-secondary">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          className="rounded p-1.5 text-text-secondary transition-all duration-150 hover:bg-surface-secondary"
          aria-label="Kattalashtirish"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          type="button"
          onClick={handleFitScreen}
          className="rounded p-1.5 text-text-secondary transition-all duration-150 hover:bg-surface-secondary"
          aria-label="Ekranga moslash"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
