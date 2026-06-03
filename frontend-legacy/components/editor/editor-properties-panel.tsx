"use client"

import { Copy, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { DocumentSettingsPanel, type DocumentSettings } from "@/components/editor/inspector/document-settings-panel"
import { ImageInspector } from "@/components/editor/inspector/image-inspector"
import { inspectorInput } from "@/components/editor/inspector/inspector-primitives"
import { QrInspector } from "@/components/editor/inspector/qr-inspector"
import { ShapeInspector } from "@/components/editor/inspector/shape-inspector"
import { TextInspector } from "@/components/editor/inspector/text-inspector"
import type { CanvasElement, CanvasElementType } from "@/lib/editor/canvas-types"
import { getLayerCategory, layerCategoryLabel } from "@/lib/editor/layer-utils"
import { editorChrome } from "@/lib/editor/editor-chrome"

import { InspectorDivider, InspectorField } from "./inspector/inspector-primitives"

export type { DocumentSettings }

type Props = {
  selected: CanvasElement | null
  documentSettings: DocumentSettings
  onProductNameChange: (name: string) => void
  onArtboardFormatChange: (formatId: string) => void
  onArtboardBackgroundChange: (color: string) => void
  onUpdate: (id: string, patch: Partial<CanvasElement>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onReplaceImage: (id: string, file: File) => void
}

export function EditorPropertiesPanel({
  selected,
  documentSettings,
  onProductNameChange,
  onArtboardFormatChange,
  onArtboardBackgroundChange,
  onUpdate,
  onDelete,
  onDuplicate,
  onReplaceImage,
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-[#e8ebf0] px-3 py-2.5">
        <div>
          <p className={editorChrome.panelTitle}>
            {selected ? layerCategoryLabel(getLayerCategory(selected)) : "Hujjat"}
          </p>
          {selected ? (
            <p className="mt-0.5 truncate text-[10px] text-[#94a3b8]">{selected.name}</p>
          ) : (
            <p className="mt-0.5 text-[10px] text-[#94a3b8]">Element tanlanmagan</p>
          )}
        </div>
        {selected ? (
          <div className="flex shrink-0 gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 text-[#64748b] hover:bg-[#f1f3f6]"
              title="Nusxa"
              onClick={() => onDuplicate(selected.id)}
            >
              <Copy className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 text-[#dc2626] hover:bg-red-50"
              title="O‘chirish"
              onClick={() => onDelete(selected.id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {!selected ? (
          <DocumentSettingsPanel
            settings={documentSettings}
            onProductNameChange={onProductNameChange}
            onArtboardFormatChange={onArtboardFormatChange}
            onArtboardBackgroundChange={onArtboardBackgroundChange}
          />
        ) : (
          <div className="space-y-4">
            <LayerMetaRow
              element={selected}
              onUpdate={(patch) => onUpdate(selected.id, patch)}
            />
            <InspectorDivider />
            <ElementInspector
              element={selected}
              onUpdate={(patch) => onUpdate(selected.id, patch)}
              onReplaceImage={(file) => onReplaceImage(selected.id, file)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function LayerMetaRow({
  element,
  onUpdate,
}: {
  element: CanvasElement
  onUpdate: (patch: Partial<CanvasElement>) => void
}) {
  return (
    <div className="space-y-3 rounded-lg border border-[#e8ebf0] bg-[#fafbfc] p-3">
      <InspectorField label="Qatlam nomi">
        <Input
          value={element.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className={inspectorInput}
        />
      </InspectorField>
      <div className="flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#475569]">
          <Switch checked={element.locked} onCheckedChange={(locked) => onUpdate({ locked })} />
          Qulflangan
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#475569]">
          <Switch checked={element.hidden} onCheckedChange={(hidden) => onUpdate({ hidden })} />
          Yashirin
        </label>
      </div>
    </div>
  )
}

function ElementInspector({
  element,
  onUpdate,
  onReplaceImage,
}: {
  element: CanvasElement
  onUpdate: (patch: Partial<CanvasElement>) => void
  onReplaceImage: (file: File) => void
}) {
  if (element.type === "text") {
    return <TextInspector element={element} onUpdate={onUpdate} />
  }
  if (isImageType(element.type)) {
    return <ImageInspector element={element} onUpdate={onUpdate} onReplaceImage={onReplaceImage} />
  }
  if (element.type === "shape" || element.type === "background") {
    return <ShapeInspector element={element} onUpdate={onUpdate} />
  }
  if (element.type === "qr") {
    return <QrInspector element={element} onUpdate={onUpdate} />
  }
  return null
}

function isImageType(type: CanvasElementType): boolean {
  return type === "image" || type === "logo" || type === "signature" || type === "stamp"
}
