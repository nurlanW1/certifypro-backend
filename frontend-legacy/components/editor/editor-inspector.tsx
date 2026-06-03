"use client"

import { useState } from "react"
import { Layers, SlidersHorizontal } from "lucide-react"

import { EditorLayersPanel } from "@/components/editor/editor-layers-panel"
import {
  EditorPropertiesPanel,
  type DocumentSettings,
} from "@/components/editor/editor-properties-panel"
import type { CanvasElement } from "@/lib/editor/canvas-types"
import { editorChrome } from "@/lib/editor/editor-chrome"
import type { LayerReorderAction } from "@/lib/editor/layer-utils"
import { cn } from "@/lib/utils"

type InspectorTab = "layers" | "properties"

type Props = {
  selected: CanvasElement | null
  elements: CanvasElement[]
  selectedId: string | null
  documentSettings: DocumentSettings
  onProductNameChange: (name: string) => void
  onArtboardFormatChange: (formatId: string) => void
  onArtboardBackgroundChange: (color: string) => void
  onSelect: (id: string | null) => void
  onUpdate: (id: string, patch: Partial<CanvasElement>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onReorder: (id: string, action: LayerReorderAction) => void
  onReplaceImage: (id: string, file: File) => void
}

export function EditorInspector({
  selected,
  elements,
  selectedId,
  documentSettings,
  onProductNameChange,
  onArtboardFormatChange,
  onArtboardBackgroundChange,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onReorder,
  onReplaceImage,
}: Props) {
  const [tab, setTab] = useState<InspectorTab>("layers")

  return (
    <aside className={cn(editorChrome.inspector, "flex min-h-0 flex-col")}>
      <div className={editorChrome.inspectorTabs}>
        <InspectorTabButton
          active={tab === "layers"}
          onClick={() => setTab("layers")}
          icon={<Layers className="size-3.5 stroke-[1.75]" />}
          label="Qatlamlar"
          badge={elements.length}
        />
        <InspectorTabButton
          active={tab === "properties"}
          onClick={() => setTab("properties")}
          icon={<SlidersHorizontal className="size-3.5 stroke-[1.75]" />}
          label="Xususiyatlar"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {tab === "layers" ? (
          <EditorLayersPanel
            elements={elements}
            selectedId={selectedId}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onReorder={onReorder}
          />
        ) : (
          <EditorPropertiesPanel
            selected={selected}
            documentSettings={documentSettings}
            onProductNameChange={onProductNameChange}
            onArtboardFormatChange={onArtboardFormatChange}
            onArtboardBackgroundChange={onArtboardBackgroundChange}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onReplaceImage={onReplaceImage}
          />
        )}
      </div>
    </aside>
  )
}

function InspectorTabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  badge?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        editorChrome.inspectorTab,
        active ? editorChrome.inspectorTabActive : editorChrome.inspectorTabIdle
      )}
    >
      {icon}
      {label}
      {badge !== undefined ? (
        <span
          className={cn(
            "rounded-md px-1.5 py-px text-[9px] font-semibold tabular-nums",
            active ? "bg-[#e0e7ff] text-[#4338ca]" : "bg-[#f1f3f6] text-[#94a3b8]"
          )}
        >
          {badge}
        </span>
      ) : null}
    </button>
  )
}
