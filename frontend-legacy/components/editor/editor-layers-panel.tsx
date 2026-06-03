"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpToLine,
  Copy,
  Eye,
  EyeOff,
  ImageIcon,
  Layers,
  Lock,
  LockOpen,
  QrCode,
  Shapes,
  Trash2,
  Type,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CanvasElement } from "@/lib/editor/canvas-types"
import { editorChrome } from "@/lib/editor/editor-chrome"
import {
  getLayerCategory,
  layerCategoryLabel,
  layersForPanel,
  type LayerCategory,
  type LayerReorderAction,
} from "@/lib/editor/layer-utils"
import { cn } from "@/lib/utils"

type Props = {
  elements: CanvasElement[]
  selectedId: string | null
  embedded?: boolean
  onSelect: (id: string | null) => void
  onUpdate: (id: string, patch: Partial<CanvasElement>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onReorder: (id: string, action: LayerReorderAction) => void
}

const CATEGORY_ICONS: Record<LayerCategory, React.ReactNode> = {
  text: <Type className="size-3.5 shrink-0" />,
  image: <ImageIcon className="size-3.5 shrink-0" />,
  shape: <Shapes className="size-3.5 shrink-0" />,
  qr: <QrCode className="size-3.5 shrink-0" />,
  signature: <PenIcon />,
  logo: <ImageIcon className="size-3.5 shrink-0" />,
  background: <Layers className="size-3.5 shrink-0" />,
}

function PenIcon() {
  return (
    <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.5 2.5a2.12 2.12 0 0 1 3 3L5.5 14.5 2 15l.5-3.5L11.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EditorLayersPanel({
  elements,
  selectedId,
  embedded = false,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onReorder,
}: Props) {
  const panelLayers = layersForPanel(elements)
  const selectedRowRef = useRef<HTMLLIElement>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  useEffect(() => {
    if (!selectedId) return
    selectedRowRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedId])

  const startRename = (el: CanvasElement) => {
    setRenamingId(el.id)
    setRenameValue(el.name)
  }

  const commitRename = (id: string) => {
    const trimmed = renameValue.trim()
    if (trimmed) onUpdate(id, { name: trimmed })
    setRenamingId(null)
  }

  const selected = elements.find((e) => e.id === selectedId) ?? null

  return (
    <div className={cn("flex min-h-0 flex-col", embedded ? "" : "flex-1")}>
      {!embedded ? (
        <div className="flex items-center justify-between border-b border-[#e8ebf0] px-3 py-2.5">
          <p className={editorChrome.panelTitle}>Qatlamlar</p>
          <span className="rounded-md bg-[#f1f3f6] px-2 py-0.5 text-[10px] font-medium text-[#64748b]">
            {elements.length}
          </span>
        </div>
      ) : (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-medium text-[#94a3b8]">{elements.length} qatlam</span>
        </div>
      )}

      {selected ? (
        <div className="flex flex-wrap gap-1 border-b border-[#e8ebf0] bg-[#fafbfc] px-2 py-2">
          <LayerActionBtn
            title="Oldinga"
            onClick={() => onReorder(selected.id, "forward")}
            icon={<ArrowUp className="size-3.5" />}
          />
          <LayerActionBtn
            title="Orqaga"
            onClick={() => onReorder(selected.id, "backward")}
            icon={<ArrowDown className="size-3.5" />}
          />
          <LayerActionBtn
            title="Eng oldinga"
            onClick={() => onReorder(selected.id, "front")}
            icon={<ArrowUpToLine className="size-3.5" />}
          />
          <LayerActionBtn
            title="Eng orqaga"
            onClick={() => onReorder(selected.id, "back")}
            icon={<ArrowDownToLine className="size-3.5" />}
          />
          <div className="mx-0.5 w-px bg-[#e2e5ea]" />
          <LayerActionBtn
            title="Nusxa"
            onClick={() => onDuplicate(selected.id)}
            icon={<Copy className="size-3.5" />}
          />
          <LayerActionBtn
            title="O‘chirish"
            onClick={() => onDelete(selected.id)}
            icon={<Trash2 className="size-3.5" />}
            destructive
          />
        </div>
      ) : null}

      <ul className={cn("min-h-0 space-y-0.5 overflow-y-auto", embedded ? "max-h-[min(480px,50vh)]" : "flex-1 p-2")}>
        {panelLayers.length === 0 ? (
          <li className="rounded-lg border border-dashed border-[#e2e5ea] bg-[#fafbfc] px-3 py-8 text-center text-xs text-[#94a3b8]">
            Qatlamlar yo‘q — chap paneldan element qo‘shing
          </li>
        ) : (
          panelLayers.map((el) => {
            const isSelected = selectedId === el.id
            const category = getLayerCategory(el)
            const isRenaming = renamingId === el.id

            return (
              <li
                key={el.id}
                ref={isSelected ? selectedRowRef : undefined}
                className={cn(
                  "group rounded-lg border transition-colors",
                  isSelected
                    ? "border-[#93c5fd] bg-[#eef2ff] shadow-sm"
                    : "border-transparent hover:border-[#e8ebf0] hover:bg-[#f8f9fb]",
                  el.hidden && "opacity-60"
                )}
              >
                <div className="flex items-center gap-1 p-1">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-left"
                    onClick={() => onSelect(el.id)}
                    onDoubleClick={() => startRename(el)}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md",
                        isSelected ? "bg-[#2563eb] text-white" : "bg-[#f1f3f6] text-[#64748b]"
                      )}
                    >
                      {CATEGORY_ICONS[category]}
                    </span>
                    <span className="min-w-0 flex-1">
                      {isRenaming ? (
                        <Input
                          value={renameValue}
                          autoFocus
                          className="h-7 text-xs"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => commitRename(el.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(el.id)
                            if (e.key === "Escape") setRenamingId(null)
                          }}
                        />
                      ) : (
                        <>
                          <span
                            className={cn(
                              "block truncate text-xs font-medium",
                              isSelected ? "text-[#1e40af]" : "text-[#334155]"
                            )}
                          >
                            {el.name}
                          </span>
                          <span className="block text-[9px] uppercase tracking-wide text-[#94a3b8]">
                            {layerCategoryLabel(category)}
                          </span>
                        </>
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    title={el.hidden ? "Ko‘rsatish" : "Yashirish"}
                    className="size-7 shrink-0 rounded-md text-[#94a3b8] hover:bg-white hover:text-[#334155]"
                    onClick={() => onUpdate(el.id, { hidden: !el.hidden })}
                  >
                    {el.hidden ? <EyeOff className="size-3.5 mx-auto" /> : <Eye className="size-3.5 mx-auto" />}
                  </button>
                  <button
                    type="button"
                    title={el.locked ? "Qulfni ochish" : "Qulflash"}
                    className="size-7 shrink-0 rounded-md text-[#94a3b8] hover:bg-white hover:text-[#334155]"
                    onClick={() => onUpdate(el.id, { locked: !el.locked })}
                  >
                    {el.locked ? (
                      <Lock className="size-3.5 mx-auto" />
                    ) : (
                      <LockOpen className="size-3.5 mx-auto" />
                    )}
                  </button>
                </div>
              </li>
            )
          })
        )}
      </ul>

      {!embedded ? (
        <p className="shrink-0 border-t border-[#e8ebf0] px-3 py-2 text-[10px] leading-relaxed text-[#94a3b8]">
          Ikki marta bosing — nomini o‘zgartirish. Yuqoridagi qatlam oldinga chiqadi.
        </p>
      ) : null}
    </div>
  )
}

function LayerActionBtn({
  title,
  onClick,
  icon,
  destructive,
}: {
  title: string
  onClick: () => void
  icon: React.ReactNode
  destructive?: boolean
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={title}
      className={cn(
        "size-7 text-[#64748b] hover:bg-white hover:text-[#0f172a]",
        destructive && "hover:bg-red-50 hover:text-[#dc2626]"
      )}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}
