"use client"

import type { CanvasElement } from "@/lib/editor/canvas-types"
import {
  categoryLabel,
  getTemplatesForEditorContext,
  type EditorToolId,
} from "@/lib/editor/editor-tools"
import type { LayerReorderAction } from "@/lib/editor/layer-utils"
import { getProductById } from "@/lib/templates/product-catalog"

import { EditorLayersPanel } from "../editor-layers-panel"
import { BrandToolPanel } from "./brand-tool-panel"
import { ElementsToolPanel } from "./elements-tool-panel"
import { QrToolPanel } from "./qr-tool-panel"
import { GraphicToolPanel } from "./graphic-tool-panel"
import { TemplateDataPanel } from "./template-data-panel"
import { ShapesToolPanel } from "./shapes-tool-panel"
import { TemplatesToolPanel } from "./templates-tool-panel"
import { TextToolPanel } from "./text-tool-panel"
import { UploadsToolPanel } from "./uploads-tool-panel"

export type EditorToolsPanelActions = {
  onAddHeading: () => void
  onAddSubheading: () => void
  onAddParagraph: () => void
  onAddCaption: () => void
  onUpload: (files: FileList, kind: "logo" | "signature" | "stamp" | "image") => void
  onAddLine: () => void
  onAddDivider: () => void
  onAddBadge: () => void
  onAddFrame: () => void
  onAddIconPlaceholder: () => void
  onAddShape: (shape: "rectangle" | "rounded-rect" | "circle" | "line" | "blob") => void
  onQrValueChange: (value: string) => void
  onGenerateQr: () => void
  onApplyTemplate: (productId: string) => void
  onUploadLogo: (files: FileList) => void
  onUploadSignature: (files: FileList) => void
  onUploadStamp: (files: FileList) => void
  onApplyBrandColor: (color: string) => void
  onApplyBrandFont: (fontFamily: string) => void
}

type Props = {
  tool: EditorToolId
  templateId: string | null
  templateFormValues: Record<string, string>
  onTemplateFieldChange: (key: string, value: string) => void
  qrValue: string
  elements: CanvasElement[]
  selectedId: string | null
  actions: EditorToolsPanelActions
  onSelect: (id: string | null) => void
  onUpdate: (id: string, patch: Partial<CanvasElement>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onReorder: (id: string, action: LayerReorderAction) => void
}

export function EditorToolsPanel({
  tool,
  templateId,
  templateFormValues,
  onTemplateFieldChange,
  qrValue,
  elements,
  selectedId,
  actions,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onReorder,
}: Props) {
  const product = templateId ? getProductById(templateId) : null
  const templates = getTemplatesForEditorContext(templateId)
  const categoryName = categoryLabel(product?.categorySlug)

  switch (tool) {
    case "select":
      return (
        <TemplateDataPanel
          product={product ?? null}
          values={templateFormValues}
          onChange={onTemplateFieldChange}
          templateLabel={product?.title}
        />
      )
    case "hand":
      return <GraphicToolPanel />
    case "text":
      return (
        <TextToolPanel
          onAddHeading={actions.onAddHeading}
          onAddSubheading={actions.onAddSubheading}
          onAddParagraph={actions.onAddParagraph}
          onAddCaption={actions.onAddCaption}
        />
      )
    case "uploads":
      return <UploadsToolPanel onUpload={actions.onUpload} />
    case "elements":
      return (
        <ElementsToolPanel
          onAddLine={actions.onAddLine}
          onAddDivider={actions.onAddDivider}
          onAddBadge={actions.onAddBadge}
          onAddFrame={actions.onAddFrame}
          onAddIconPlaceholder={actions.onAddIconPlaceholder}
        />
      )
    case "shapes":
      return <ShapesToolPanel onAddShape={actions.onAddShape} />
    case "qr":
      return (
        <QrToolPanel
          value={qrValue}
          onChange={actions.onQrValueChange}
          onGenerate={actions.onGenerateQr}
        />
      )
    case "templates":
      return (
        <TemplatesToolPanel
          templates={templates}
          categoryName={categoryName || "Shablonlar"}
          activeTemplateId={templateId}
          onApply={actions.onApplyTemplate}
        />
      )
    case "brand":
      return (
        <BrandToolPanel
          onUploadLogo={actions.onUploadLogo}
          onUploadSignature={actions.onUploadSignature}
          onUploadStamp={actions.onUploadStamp}
          onApplyBrandColor={actions.onApplyBrandColor}
          onApplyBrandFont={actions.onApplyBrandFont}
        />
      )
    case "layers":
      return (
        <EditorLayersPanel
          embedded
          elements={elements}
          selectedId={selectedId}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onReorder={onReorder}
        />
      )
    default:
      return null
  }
}
