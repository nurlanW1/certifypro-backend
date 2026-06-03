"use client"

import { forwardRef, useCallback, useImperativeHandle, useRef, useState, useEffect } from "react"
import { RotateCw } from "lucide-react"

import { CanvasElementRenderer } from "@/components/editor/canvas-element-renderer"
import { EditorCanvasEmptyHint } from "@/components/editor/editor-ui-states"
import { useEditorViewport } from "@/hooks/use-editor-viewport"
import type { CanvasElement } from "@/lib/editor/canvas-types"
import type { EditorInteractionMode } from "@/lib/editor/editor-tools"
import { ARTBOARD_A4_LANDSCAPE } from "@/lib/editor/canvas-types"
import { editorChrome } from "@/lib/editor/editor-chrome"
import { cn } from "@/lib/utils"

export type { CanvasElement } from "@/lib/editor/canvas-types"

export type EditorCanvasHandle = {
  zoomToFit: () => void
  zoomToPreset: (percent: number) => void
  zoomByDelta: (direction: 1 | -1) => void
}

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w"

type Props = {
  productName: string
  zoom: number
  onZoomChange: (z: number) => void
  elements: CanvasElement[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onUpdateElement: (id: string, patch: Partial<CanvasElement>) => void
  onCommitHistory?: () => void
  onDropFiles?: (files: FileList, offsetX: number, offsetY: number) => void
  artboardWidth?: number
  artboardHeight?: number
  artboardBackground?: string
  interactionMode?: EditorInteractionMode
  showEmptyHint?: boolean
}

type ElementInteraction =
  | { mode: "move"; id: string; startX: number; startY: number; origX: number; origY: number }
  | {
      mode: "resize"
      id: string
      handle: ResizeHandle
      startX: number
      startY: number
      orig: CanvasElement
    }
  | {
      mode: "rotate"
      id: string
      centerX: number
      centerY: number
      startAngle: number
      origRotation: number
    }

const HANDLES: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"]

export const EditorCanvas = forwardRef<EditorCanvasHandle, Props>(function EditorCanvas(
  {
    productName,
    zoom,
    onZoomChange,
    elements,
    selectedId,
    onSelect,
    onUpdateElement,
    onCommitHistory,
    onDropFiles,
    artboardWidth = ARTBOARD_A4_LANDSCAPE.width,
    artboardHeight = ARTBOARD_A4_LANDSCAPE.height,
    artboardBackground = "#ffffff",
    interactionMode = "select",
    showEmptyHint = false,
  },
  ref
) {
  const handToolActive = interactionMode === "hand"
  const artboardRef = useRef<HTMLDivElement>(null)
  const [interaction, setInteraction] = useState<ElementInteraction | null>(null)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const textEditRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editingTextId && textEditRef.current) {
      textEditRef.current.focus()
      textEditRef.current.select()
    }
  }, [editingTextId])

  const viewport = useEditorViewport({
    zoom,
    onZoomChange,
    artboardWidth,
    artboardHeight,
    handToolActive,
  })

  useImperativeHandle(
    ref,
    () => ({
      zoomToFit: viewport.zoomToFit,
      zoomToPreset: viewport.zoomToPreset,
      zoomByDelta: (direction) => viewport.zoomByDelta(direction > 0 ? 1 : -1),
    }),
    [viewport.zoomToFit, viewport.zoomToPreset, viewport.zoomByDelta]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!interaction) return
      const { x, y } = viewport.screenToArtboard(e.clientX, e.clientY)

      if (interaction.mode === "move") {
        const dx = x - interaction.startX
        const dy = y - interaction.startY
        onUpdateElement(interaction.id, {
          x: Math.round(interaction.origX + dx),
          y: Math.round(interaction.origY + dy),
        })
      } else if (interaction.mode === "rotate") {
        const angle = Math.atan2(y - interaction.centerY, x - interaction.centerX)
        const deg = ((angle - interaction.startAngle) * 180) / Math.PI + interaction.origRotation
        onUpdateElement(interaction.id, { rotation: Math.round(deg) })
      } else if (interaction.mode === "resize") {
        const dx = x - interaction.startX
        const dy = y - interaction.startY
        const o = interaction.orig
        let { x: nx, y: ny, width: nw, height: nh } = o
        const h = interaction.handle

        if (h.includes("e")) nw = Math.max(24, o.width + dx)
        if (h.includes("s")) nh = Math.max(16, o.height + dy)
        if (h.includes("w")) {
          nw = Math.max(24, o.width - dx)
          nx = o.x + (o.width - nw)
        }
        if (h.includes("n")) {
          nh = Math.max(16, o.height - dy)
          ny = o.y + (o.height - nh)
        }
        onUpdateElement(interaction.id, { x: nx, y: ny, width: nw, height: nh })
      }
    },
    [interaction, viewport.screenToArtboard, onUpdateElement]
  )

  const endInteraction = useCallback(() => {
    setInteraction(null)
    onCommitHistory?.()
    window.removeEventListener("pointermove", onPointerMove)
  }, [onPointerMove, onCommitHistory])

  const startElementInteraction = useCallback(
    (next: ElementInteraction) => {
      setInteraction(next)
      const onUp = () => {
        endInteraction()
        window.removeEventListener("pointerup", onUp)
      }
      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onUp)
    },
    [onPointerMove, endInteraction]
  )

  const finishTextEdit = useCallback(() => {
    setEditingTextId(null)
    onCommitHistory?.()
  }, [onCommitHistory])

  const handleElementDoubleClick = (el: CanvasElement, e: React.MouseEvent) => {
    if (handToolActive || el.locked || el.type !== "text") return
    e.stopPropagation()
    onSelect(el.id)
    setEditingTextId(el.id)
  }

  const handleElementPointerDown = (el: CanvasElement, e: React.PointerEvent) => {
    if (editingTextId) return
    if (handToolActive) {
      viewport.onViewportPointerDown(e)
      return
    }
    if (viewport.shouldStartPan(e)) {
      e.preventDefault()
      viewport.startPan(e)
      return
    }
    if (e.button !== 0) return
    e.stopPropagation()
    onSelect(el.id)
    if (el.locked) return
    const { x, y } = viewport.screenToArtboard(e.clientX, e.clientY)
    startElementInteraction({
      mode: "move",
      id: el.id,
      startX: x,
      startY: y,
      origX: el.x,
      origY: el.y,
    })
  }

  const startResize = (el: CanvasElement, handle: ResizeHandle, e: React.PointerEvent) => {
    if (viewport.shouldStartPan(e)) return
    e.stopPropagation()
    const { x, y } = viewport.screenToArtboard(e.clientX, e.clientY)
    startElementInteraction({
      mode: "resize",
      id: el.id,
      handle,
      startX: x,
      startY: y,
      orig: { ...el },
    })
  }

  const startRotate = (el: CanvasElement, e: React.PointerEvent) => {
    if (viewport.shouldStartPan(e)) return
    e.stopPropagation()
    const cx = el.x + el.width / 2
    const cy = el.y + el.height / 2
    const { x, y } = viewport.screenToArtboard(e.clientX, e.clientY)
    startElementInteraction({
      mode: "rotate",
      id: el.id,
      centerX: cx,
      centerY: cy,
      startAngle: Math.atan2(y - cy, x - cx),
      origRotation: el.rotation,
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!onDropFiles || !e.dataTransfer.files.length) return
    const { x, y } = viewport.screenToArtboard(e.clientX, e.clientY)
    onDropFiles(e.dataTransfer.files, x, y)
  }

  const handleViewportPointerDown = (e: React.PointerEvent) => {
    viewport.onViewportPointerDown(e)
    if (e.button === 0 && !viewport.spaceHeld && e.target === e.currentTarget) {
      onSelect(null)
    }
  }

  const handleArtboardPointerDown = (e: React.PointerEvent) => {
    if (viewport.shouldStartPan(e)) {
      viewport.onViewportPointerDown(e)
      return
    }
    if (e.button === 0 && !viewport.spaceHeld && e.target === e.currentTarget) {
      onSelect(null)
    }
  }

  return (
    <main className={cn(editorChrome.workspace, "flex min-w-0 flex-1 flex-col")}>
      <div className={editorChrome.workspaceDots} aria-hidden />
      <div className={editorChrome.workspaceGlow} aria-hidden />
      <div
        ref={viewport.viewportRef}
        className="relative min-h-0 flex-1 overflow-hidden touch-none select-none"
        style={{ cursor: handToolActive ? (viewport.isPanning ? "grabbing" : "grab") : viewport.viewportCursor }}
        onPointerDown={handleViewportPointerDown}
        onPointerMove={viewport.onViewportPointerMove}
        onPointerUp={viewport.onViewportPointerUp}
        onContextMenu={viewport.onViewportContextMenu}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div
          className="absolute left-0 top-0 will-change-transform"
          style={{
            transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.scale})`,
            transformOrigin: "0 0",
            transition: viewport.smoothTransform ? "transform 140ms cubic-bezier(0.2, 0, 0, 1)" : "none",
          }}
        >
          <div
            ref={artboardRef}
            className={cn("relative", editorChrome.artboardShadow)}
            style={{
              width: artboardWidth,
              height: artboardHeight,
              backgroundColor: artboardBackground,
            }}
            onPointerDown={handleArtboardPointerDown}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
              aria-hidden
            />
            <div className="pointer-events-none absolute left-4 top-3 z-[1] text-[9px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]/90">
              {productName}
            </div>

            {showEmptyHint ? <EditorCanvasEmptyHint /> : null}

            {elements.map((el, zIndex) => {
              if (el.hidden) return null
              const selected = selectedId === el.id
              return (
                <div
                  key={el.id}
                  className={cn(
                    "absolute touch-none",
                    el.locked && "opacity-80",
                    !el.locked && !viewport.isPanning && !viewport.spaceHeld && "cursor-move"
                  )}
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    zIndex: selected ? elements.length + 1 : zIndex + 1,
                    transform: `rotate(${el.rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                  onPointerDown={(e) => handleElementPointerDown(el, e)}
                  onDoubleClick={(e) => handleElementDoubleClick(el, e)}
                >
                  <div
                    className={cn(
                      "relative size-full rounded-[1px]",
                      selected && editorChrome.selectionRing,
                      !selected &&
                        !el.locked &&
                        "hover:ring-1 hover:ring-[#a5b4fc]/90 hover:ring-offset-1 hover:ring-offset-white"
                    )}
                  >
                    {editingTextId === el.id && el.type === "text" ? (
                      <textarea
                        ref={textEditRef}
                        className="size-full resize-none border-2 border-primary bg-white/95 p-1 text-inherit outline-none"
                        style={{
                          color: el.color,
                          fontSize: el.fontSize,
                          fontFamily: el.fontFamily,
                          fontWeight: el.fontWeight,
                          textAlign: el.textAlign,
                          lineHeight: el.lineHeight,
                        }}
                        value={el.label}
                        onChange={(e) => onUpdateElement(el.id, { label: e.target.value })}
                        onBlur={finishTextEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") finishTextEdit()
                          e.stopPropagation()
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <CanvasElementRenderer element={el} selected={selected} />
                    )}

                    {selected && !el.locked ? (
                      <>
                        {HANDLES.map((handle) => (
                          <span
                            key={handle}
                            data-export-ignore
                            className={editorChrome.resizeHandle}
                            style={handleStyle(handle, el.width, el.height)}
                            onPointerDown={(e) => startResize(el, handle, e)}
                          />
                        ))}
                        <div
                          data-export-ignore
                          className="absolute -top-10 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center"
                        >
                          <div className={editorChrome.rotateStem} />
                          <button
                            type="button"
                            className={editorChrome.rotateHandle}
                            onPointerDown={(e) => startRotate(el, e)}
                          >
                            <RotateCw className="size-3 stroke-[2]" />
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
})

function handleStyle(handle: ResizeHandle, w: number, h: number): React.CSSProperties {
  const s = 6
  const map: Record<ResizeHandle, React.CSSProperties> = {
    nw: { left: -s, top: -s, cursor: "nwse-resize" },
    n: { left: w / 2 - s, top: -s, cursor: "ns-resize" },
    ne: { right: -s, top: -s, cursor: "nesw-resize" },
    e: { right: -s, top: h / 2 - s, cursor: "ew-resize" },
    se: { right: -s, bottom: -s, cursor: "nwse-resize" },
    s: { left: w / 2 - s, bottom: -s, cursor: "ns-resize" },
    sw: { left: -s, bottom: -s, cursor: "nesw-resize" },
    w: { left: -s, top: h / 2 - s, cursor: "ew-resize" },
  }
  return map[handle]
}
