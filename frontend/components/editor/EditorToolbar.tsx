'use client'

import { useRef } from 'react'
import {
  MousePointer2,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  Layers,
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
]

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export function EditorToolbar() {
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

  const visibleTools = assetMode
    ? TOOLS.filter((t) => ['select', 'text', 'image'].includes(t.id))
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
      default:
        break
    }
  }

  const onImageFile = (file: File) => {
    if (!fabricCanvas) return
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) return
    if (file.size > MAX_IMAGE_BYTES) return

    const url = URL.createObjectURL(file)
    void loadImageToCanvas(fabricCanvas, url)
      .then(() => {
        pushHistory()
        URL.revokeObjectURL(url)
      })
      .catch(() => URL.revokeObjectURL(url))
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
                      ? 'border border-accent-border bg-accent-dim text-accent-hover'
                      : 'text-text-disabled hover:bg-subtle hover:text-text-secondary'
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
