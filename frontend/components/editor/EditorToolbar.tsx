'use client'

import { useRef } from 'react'
import { fabric } from 'fabric'
import {
  MousePointer2,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  Layers,
  Pencil,
  QrCode,
  Signature,
  Stamp,
  Upload,
  Download,
  FileArchive,
  FileImage,
  FileText,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useEditorStore, type ActiveTool } from '@/store/editorStore'
import { cn } from '@/lib/utils'
import {
  addDefaultCircle,
  addDefaultLine,
  addDefaultRect,
  addDefaultText,
  loadImageToCanvas,
} from '@/lib/editor/fabric-utils'
import { resizeImage } from '@/lib/editor/imageProcessor'
import { PrintDraftButton } from '@/components/editor/PrintDraftButton'

const TOOLS: {
  id: ActiveTool
  icon: typeof MousePointer2
  label: string
  shortcut: string
}[] = [
  { id: 'select', icon: MousePointer2, label: 'Tanlash', shortcut: 'V' },
  { id: 'text', icon: Type, label: 'Matn', shortcut: 'T' },
  { id: 'image', icon: ImageIcon, label: 'Rasm', shortcut: 'I' },
  { id: 'rect', icon: Square, label: "To'rtburchak", shortcut: 'R' },
  { id: 'circle', icon: Circle, label: 'Doira', shortcut: 'C' },
  { id: 'line', icon: Minus, label: 'Chiziq', shortcut: 'L' },
  { id: 'pen', icon: Pencil, label: 'Qalam', shortcut: 'P' },
]

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

interface TemplateEditorToolbarProps {
  mode?: 'fabric' | 'event-template'
  zoom?: number
  onZoomIn?: () => void
  onZoomOut?: () => void
  onExportPNG?: () => void
  onExportSVG?: () => void
  onPrintDraft?: () => void
}

export function EditorToolbar({
  mode = 'fabric',
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onExportPNG,
  onExportSVG,
  onPrintDraft,
}: TemplateEditorToolbarProps = {}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const {
    activeTool,
    setActiveTool,
    fabricCanvas,
    pushHistory,
    layersOpen,
    setLayersOpen,
    assetMode,
  } = useEditorStore()

  if (mode === 'event-template') {
    return (
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-divide bg-surface px-4 py-2">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onZoomOut} className="btn-secondary btn-sm" aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-14 text-center text-xs font-semibold text-text-secondary">
            {Math.round(zoom * 100)}%
          </span>
          <button type="button" onClick={onZoomIn} className="btn-secondary btn-sm" aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PrintDraftButton onPrint={onPrintDraft} />
          <button type="button" onClick={onExportPNG} className="btn-secondary btn-sm">
            <FileImage className="h-4 w-4" />
            PNG
          </button>
          <button type="button" className="btn-secondary btn-sm" disabled title="Coming soon">
            <FileText className="h-4 w-4" />
            PDF Coming soon
          </button>
          <button type="button" onClick={onExportSVG} className="btn-secondary btn-sm">
            <Download className="h-4 w-4" />
            SVG
          </button>
          <button type="button" className="btn-secondary btn-sm" disabled title="Coming soon">
            <FileArchive className="h-4 w-4" />
            ZIP Coming soon
          </button>
        </div>
      </div>
    )
  }

  const visibleTools = assetMode
    ? TOOLS.filter((t) => ['select', 'text', 'image', 'pen'].includes(t.id))
    : TOOLS

  const runTool = (tool: ActiveTool) => {
    setActiveTool(tool)
    if (!fabricCanvas) return

    switch (tool) {
      case 'text':
        addDefaultText(fabricCanvas)
        pushHistory()
        break
      case 'rect':
        addDefaultRect(fabricCanvas)
        pushHistory()
        break
      case 'circle':
        addDefaultCircle(fabricCanvas)
        pushHistory()
        break
      case 'line':
        addDefaultLine(fabricCanvas)
        pushHistory()
        break
      case 'image':
        fileRef.current?.click()
        break
      case 'pen':
        break
      default:
        break
    }
  }

  const addQrPlaceholder = () => {
    if (!fabricCanvas) return
    const group = new fabric.Group(
      [
        new fabric.Rect({
          width: 96,
          height: 96,
          fill: '#ffffff',
          stroke: '#2563eb',
          strokeDashArray: [8, 6],
          strokeWidth: 2,
        }),
        new fabric.Text('{{qr_code}}', {
          left: 18,
          top: 40,
          fontSize: 12,
          fill: '#2563eb',
          fontFamily: 'Arial',
        }),
      ],
      { left: 120, top: 120 }
    )
    fabricCanvas.add(group)
    fabricCanvas.setActiveObject(group)
    fabricCanvas.renderAll()
    pushHistory()
  }

  const onImageFile = async (file: File) => {
    if (!fabricCanvas) return
    if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) return
    if (file.size > MAX_IMAGE_BYTES) return

    try {
      if (file.type === 'image/svg+xml') {
        const text = await file.text()
        const dataUrl = `data:image/svg+xml;base64,${btoa(text)}`
        await loadImageToCanvas(fabricCanvas, dataUrl)
      } else {
        const resized = await resizeImage(file, 2000, 2000)
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error('read failed'))
          reader.readAsDataURL(resized)
        })
        await loadImageToCanvas(fabricCanvas, dataUrl)
      }
      pushHistory()
    } catch {
      /* ignore */
    }
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      <aside className="flex w-[52px] shrink-0 flex-col items-center border-r border-divide bg-canvas py-2">
        <div className="flex flex-col gap-1">
          {visibleTools.map(({ id, icon: Icon, label, shortcut }) => (
            <Tooltip.Root key={id}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  onClick={() => runTool(id)}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150',
                    activeTool === id
                      ? 'border border-accent-border bg-subtle text-text-primary'
                      : 'text-text-tertiary hover:bg-subtle hover:text-text-primary'
                  )}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  className="z-50 rounded-lg bg-brand-900 px-2 py-1 text-xs text-text-inverse shadow-md"
                >
                  {label} ({shortcut})
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-1 border-t border-divide pt-3">
          {[
            { icon: Upload, label: 'Upload Logo', onClick: () => fileRef.current?.click() },
            { icon: Signature, label: 'Upload Signature', onClick: () => fileRef.current?.click() },
            { icon: Stamp, label: 'Upload Stamp', onClick: () => fileRef.current?.click() },
            { icon: QrCode, label: 'QR Code', onClick: addQrPlaceholder },
          ].map(({ icon: Icon, label, onClick }) => (
            <Tooltip.Root key={label}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  onClick={onClick}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-text-tertiary transition-all duration-150 hover:bg-subtle hover:text-text-primary"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  className="z-50 rounded-lg bg-brand-900 px-2 py-1 text-xs text-text-inverse"
                >
                  {label}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </div>

        <div className="mt-auto pt-2">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                onClick={() => setLayersOpen(!layersOpen)}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150',
                  layersOpen
                    ? 'border border-accent-border bg-accent-dim text-accent-hover'
                    : 'text-text-disabled hover:bg-subtle'
                )}
                aria-label="Qatlamlar"
              >
                <Layers className="h-5 w-5" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                className="z-50 rounded-lg bg-brand-900 px-2 py-1 text-xs text-text-inverse"
              >
                Qatlamlar
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onImageFile(file)
            e.target.value = ''
          }}
        />
      </aside>
    </Tooltip.Provider>
  )
}
