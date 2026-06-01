import type { CanvasElement } from "@/lib/editor/canvas-types"
import { normalizeElement } from "@/lib/editor/canvas-factory"
import { designElementsFromState } from "@/lib/editor/build-design-state"
import type { EditorDesignState } from "@/lib/editor/canvas-types"
import { resolveArtboardForProduct, type ResolvedArtboard } from "@/lib/editor/product-artboards"
import { compileDefaultDesignTemplate } from "@/lib/templates/design-templates"
import { getProductById } from "@/lib/templates/product-catalog"
import { getEditorProductName, toPreviewFormData } from "@/lib/templates/product-draft-storage"

export type LoadedTemplateCanvas = {
  productName: string
  artboard: ResolvedArtboard
  artboardBackground: string
  elements: CanvasElement[]
}

export function shouldPreferFreshTemplate(
  saved: EditorDesignState | null,
  templateId: string,
  opts?: { forceFresh?: boolean }
): boolean {
  if (opts?.forceFresh) return true
  if (!saved) return true
  if (saved.productType && saved.productType !== templateId) return true
  const elements = designElementsFromState(saved)
  if (elements.length === 0) return true
  if (elements.length <= 2 && elements.every((e) => e.id === "title" || e.id === "name")) {
    return true
  }
  return false
}

export function loadTemplateCanvas(
  templateId: string,
  draftValues?: Record<string, string>
): LoadedTemplateCanvas | null {
  const product = getProductById(templateId)
  if (!product) return null

  const preview = toPreviewFormData(draftValues ?? {})
  const compiled = compileDefaultDesignTemplate(templateId, preview)
  if (!compiled?.elements.length) return null

  const artboard = resolveArtboardForProduct(templateId)
  return {
    productName: getEditorProductName(product, draftValues ?? {}),
    artboard,
    artboardBackground: "#ffffff",
    elements: compiled.elements.map((e) => normalizeElement(e)),
  }
}

export function applyLoadedTemplateToState(loaded: LoadedTemplateCanvas) {
  const firstEditable =
    loaded.elements.find((e) => e.type === "text" && !e.locked) ?? loaded.elements[0]
  return {
    productName: loaded.productName,
    artboard: loaded.artboard,
    artboardBackground: loaded.artboardBackground,
    elements: loaded.elements,
    selectedId: firstEditable?.id ?? null,
  }
}
