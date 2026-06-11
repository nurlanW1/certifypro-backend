'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { EditorSidebar } from '@/components/editor/EditorSidebar'
import { EditorPropertiesPanel } from '@/components/editor/EditorPropertiesPanel'
import { cloneTemplateElements } from '@/lib/templates/templateUtils'
import type { StarterTemplate, TemplateElement } from '@/lib/templates/types'
import { useCanvasViewportControls } from '@/hooks/useCanvasViewportControls'

interface EventCanvasEditorProps {
  template: StarterTemplate
}

type DragState = {
  id: string
  startX: number
  startY: number
  original: TemplateElement
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function placeholderLabel(element: Extract<TemplateElement, { width: number }>) {
  if (!('label' in element) || !element.label) return null
  return (
    <text
      x={element.x + element.width / 2}
      y={element.y + element.height / 2 + 4}
      textAnchor="middle"
      fontSize={Math.max(10, Math.min(18, element.width / 8))}
      fill={element.stroke ?? '#64748b'}
      opacity={0.82}
      pointerEvents="none"
    >
      {element.label}
    </text>
  )
}

function renderElement(element: TemplateElement, selected: boolean, onPointerDown: (element: TemplateElement, x: number, y: number) => void) {
  const selectionStroke = selected ? '#f97316' : undefined
  const common = {
    onPointerDown: (event: React.PointerEvent<SVGElement>) => {
      event.stopPropagation()
      onPointerDown(element, event.clientX, event.clientY)
    },
    style: { cursor: 'move' },
  }

  if (element.type === 'text') {
    return (
      <text
        key={element.id}
        {...common}
        x={element.x}
        y={element.y}
        textAnchor={element.align ?? 'start'}
        fontFamily={element.fontFamily ?? 'Arial, sans-serif'}
        fontSize={element.fontSize}
        fontWeight={element.fontWeight ?? '400'}
        fill={element.fill}
        stroke={selectionStroke}
        strokeWidth={selected ? 0.8 : 0}
      >
        {element.text}
      </text>
    )
  }

  if (element.type === 'line') {
    return (
      <line
        key={element.id}
        {...common}
        x1={element.x1}
        y1={element.y1}
        x2={element.x2}
        y2={element.y2}
        stroke={selectionStroke ?? element.stroke}
        strokeWidth={selected ? Math.max(3, element.strokeWidth ?? 2) : element.strokeWidth ?? 2}
        strokeDasharray={element.dashed ? '10 8' : undefined}
        opacity={element.opacity}
      />
    )
  }

  if (element.type === 'circle') {
    return (
      <circle
        key={element.id}
        {...common}
        cx={element.x}
        cy={element.y}
        r={element.radius}
        fill={element.fill ?? 'transparent'}
        stroke={selectionStroke ?? element.stroke}
        strokeWidth={selected ? 4 : element.strokeWidth ?? 0}
        opacity={element.opacity}
      />
    )
  }

  const stroke = selectionStroke ?? element.stroke
  const strokeWidth = selected ? 4 : element.strokeWidth ?? 0
  const isStamp = element.type === 'stampPlaceholder'

  return (
    <g key={element.id} {...common}>
      {isStamp ? (
        <circle
          cx={element.x + element.width / 2}
          cy={element.y + element.height / 2}
          r={Math.min(element.width, element.height) / 2}
          fill={element.fill ?? 'transparent'}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={element.dashed ? '10 8' : undefined}
          opacity={element.opacity}
        />
      ) : (
        <rect
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rx={element.radius ?? 6}
          fill={element.fill ?? 'transparent'}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={element.dashed ? '10 8' : undefined}
          opacity={element.opacity}
        />
      )}
      {placeholderLabel(element)}
    </g>
  )
}

function elementsToSvg(template: StarterTemplate, elements: TemplateElement[], watermark = false): string {
  const body = elements
    .map((element) => {
      if (element.type === 'text') {
        return `<text x="${element.x}" y="${element.y}" text-anchor="${element.align ?? 'start'}" font-family="${escapeXml(
          element.fontFamily ?? 'Arial, sans-serif'
        )}" font-size="${element.fontSize}" fill="${element.fill}" font-weight="${element.fontWeight ?? '400'}">${escapeXml(element.text)}</text>`
      }
      if (element.type === 'line') {
        return `<line x1="${element.x1}" y1="${element.y1}" x2="${element.x2}" y2="${element.y2}" stroke="${element.stroke}" stroke-width="${element.strokeWidth ?? 2}"${
          element.dashed ? ' stroke-dasharray="10 8"' : ''
        }${element.opacity !== undefined ? ` opacity="${element.opacity}"` : ''}/>`
      }
      if (element.type === 'circle') {
        return `<circle cx="${element.x}" cy="${element.y}" r="${element.radius}" fill="${element.fill ?? 'transparent'}"${element.stroke ? ` stroke="${element.stroke}" stroke-width="${element.strokeWidth ?? 2}"` : ''}${
          element.opacity !== undefined ? ` opacity="${element.opacity}"` : ''
        }/>`
      }
      const stroke = element.stroke ? ` stroke="${element.stroke}" stroke-width="${element.strokeWidth ?? 2}"${element.dashed ? ' stroke-dasharray="10 8"' : ''}` : ''
      const opacity = element.opacity !== undefined ? ` opacity="${element.opacity}"` : ''
      const shape =
        element.type === 'stampPlaceholder'
          ? `<circle cx="${element.x + element.width / 2}" cy="${element.y + element.height / 2}" r="${Math.min(element.width, element.height) / 2}" fill="${element.fill ?? 'transparent'}"${stroke}${opacity}/>`
          : `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="${element.radius ?? 6}" fill="${element.fill ?? 'transparent'}"${stroke}${opacity}/>`
      const label = 'label' in element && element.label ? `<text x="${element.x + element.width / 2}" y="${element.y + element.height / 2 + 4}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${element.stroke ?? '#64748b'}">${escapeXml(element.label)}</text>` : ''
      return `${shape}${label}`
    })
    .join('\n')

  const draft = watermark
    ? `<text x="${template.size.width / 2}" y="${template.size.height / 2}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(
        template.size.width * 0.06
      )}" fill="#ef4444" opacity="0.18" transform="rotate(-24 ${template.size.width / 2} ${template.size.height / 2})">Gildia Draft Preview</text>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${template.size.width}" height="${template.size.height}" viewBox="0 0 ${template.size.width} ${template.size.height}">${body}${draft}</svg>`
}

function download(filename: string, content: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function EventCanvasEditor({ template }: EventCanvasEditorProps) {
  const [elements, setElements] = useState<TemplateElement[]>(() => cloneTemplateElements(template))
  const [selectedId, setSelectedId] = useState<string | null>(template.elements[0]?.id ?? null)
  const [zoom, setZoom] = useState(0.72)
  const [drag, setDrag] = useState<DragState | null>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const canvasStageRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef(elements)
  const historyRef = useRef<TemplateElement[][]>([cloneTemplateElements(template)])
  const historyIndexRef = useRef(0)

  const { isPanning, isSpacePressed, panOffset } = useCanvasViewportControls({
    containerRef: canvasWrapRef,
    contentRef: canvasStageRef,
    zoom,
    setZoom,
    minZoom: 0.25,
    maxZoom: 1.5,
  })

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedId) ?? null,
    [elements, selectedId]
  )

  const setCurrentElements = useCallback((next: TemplateElement[]) => {
    elementsRef.current = next
    setElements(next)
  }, [])

  const commitElements = useCallback((next: TemplateElement[]) => {
    const snapshots = historyRef.current.slice(0, historyIndexRef.current + 1)
    snapshots.push(next.map((element) => ({ ...element })))
    historyRef.current = snapshots
    historyIndexRef.current = snapshots.length - 1
    setCurrentElements(next)
  }, [setCurrentElements])

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return
    historyIndexRef.current -= 1
    setCurrentElements(
      historyRef.current[historyIndexRef.current].map((element) => ({ ...element }))
    )
    setDrag(null)
  }, [setCurrentElements])

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current += 1
    setCurrentElements(
      historyRef.current[historyIndexRef.current].map((element) => ({ ...element }))
    )
    setDrag(null)
  }, [setCurrentElements])

  const updateSelected = (patch: Partial<TemplateElement>) => {
    if (!selectedId) return
    commitElements(
      elementsRef.current.map((element) =>
        element.id === selectedId ? ({ ...element, ...patch } as TemplateElement) : element
      )
    )
  }

  const beginDrag = (element: TemplateElement, clientX: number, clientY: number) => {
    setSelectedId(element.id)
    setDrag({ id: element.id, startX: clientX, startY: clientY, original: { ...element } })
  }

  const moveDrag = (clientX: number, clientY: number) => {
    if (!drag) return
    const dx = (clientX - drag.startX) / zoom
    const dy = (clientY - drag.startY) / zoom
    setCurrentElements(
      elementsRef.current.map((element) => {
        if (element.id !== drag.id) return element
        const original = drag.original
        if (original.type === 'line') {
          return { ...element, x1: original.x1 + dx, y1: original.y1 + dy, x2: original.x2 + dx, y2: original.y2 + dy }
        }
        return { ...element, x: original.x + dx, y: original.y + dy } as TemplateElement
      })
    )
  }

  const finishDrag = () => {
    if (!drag) return
    const moved = elementsRef.current.find((element) => element.id === drag.id)
    setDrag(null)
    if (!moved || JSON.stringify(moved) === JSON.stringify(drag.original)) return

    const snapshots = historyRef.current.slice(0, historyIndexRef.current + 1)
    snapshots.push(elementsRef.current.map((element) => ({ ...element })))
    historyRef.current = snapshots
    historyIndexRef.current = snapshots.length - 1
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }
      if (!(event.ctrlKey || event.metaKey)) return

      const key = event.key.toLowerCase()
      if (key === 'z') {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
      } else if (key === 'y') {
        event.preventDefault()
        redo()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [redo, undo])

  const exportSVG = () => download(`${template.id}.svg`, elementsToSvg(template, elements), 'image/svg+xml')

  const exportPNG = async () => {
    const svg = elementsToSvg(template, elements)
    const imageUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = template.size.width
      canvas.height = template.size.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(image, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) download(`${template.id}.png`, blob, 'image/png')
        URL.revokeObjectURL(imageUrl)
      })
    }
    image.src = imageUrl
  }

  const printDraft = () => {
    const svg = elementsToSvg(template, elements, true)
    const printWindow = window.open('', '_blank', 'width=1100,height=800')
    if (!printWindow) return
    printWindow.document.write(`<!doctype html><html><head><title>${template.title}</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#f8fafc}svg{max-width:96vw;max-height:96vh}</style></head><body>${svg}<script>window.onload=function(){window.print()}</script></body></html>`)
    printWindow.document.close()
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <EditorToolbar
        mode="event-template"
        zoom={zoom}
        onZoomIn={() => setZoom((value) => Math.min(1.5, value + 0.1))}
        onZoomOut={() => setZoom((value) => Math.max(0.25, value - 0.1))}
        onExportPNG={exportPNG}
        onExportSVG={exportSVG}
        onPrintDraft={printDraft}
      />

      <div className="flex min-h-0 flex-1">
        <EditorSidebar elements={elements} selectedId={selectedId} onSelect={setSelectedId} />
        <main
          className="min-w-0 flex-1 overflow-hidden p-6"
          ref={canvasWrapRef}
          style={{
            touchAction: 'none',
            cursor: isPanning ? 'grabbing' : isSpacePressed ? 'grab' : undefined,
          }}
        >
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-text-primary">{template.title}</h1>
            <p className="text-sm text-text-muted">{template.size.label} / {template.category}</p>
          </div>
          <div
            ref={canvasStageRef}
            className="relative"
            style={{
              width: template.size.width * zoom,
              height: template.size.height * zoom,
              transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0)`,
              willChange: 'transform',
            }}
          >
            <div
              className="absolute left-0 top-0 origin-top-left rounded border border-divide bg-white shadow-sm"
              style={{ transform: `scale(${zoom})` }}
            >
              <svg
                width={template.size.width}
                height={template.size.height}
                viewBox={`0 0 ${template.size.width} ${template.size.height}`}
                role="img"
                aria-label={template.title}
                onPointerMove={(event) => moveDrag(event.clientX, event.clientY)}
                onPointerUp={finishDrag}
                onPointerLeave={finishDrag}
                onPointerDown={() => setSelectedId(null)}
              >
                {elements.map((element) => renderElement(element, selectedId === element.id, beginDrag))}
              </svg>
            </div>
          </div>
        </main>
        <EditorPropertiesPanel selectedElement={selectedElement} onUpdate={updateSelected} />
      </div>
    </div>
  )
}
