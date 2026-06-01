import { resolveArtboardForProduct } from "@/lib/editor/product-artboards"
import type { EditorTemplateOption } from "@/lib/editor/editor-tools"

/** ISO A4 proportions (mm) for editor panel thumbnails */
export const A4_LANDSCAPE_ASPECT = "aspect-[297/210]"
export const A4_PORTRAIT_ASPECT = "aspect-[210/297]"

export type TemplatePreviewOrientation = "landscape" | "portrait"

export function getTemplatePreviewOrientation(productId: string): TemplatePreviewOrientation {
  const { width, height } = resolveArtboardForProduct(productId)
  return width >= height ? "landscape" : "portrait"
}

export function getA4PreviewAspectClass(orientation: TemplatePreviewOrientation): string {
  return orientation === "landscape" ? A4_LANDSCAPE_ASPECT : A4_PORTRAIT_ASPECT
}

export type GroupedEditorTemplates = {
  landscape: EditorTemplateOption[]
  portrait: EditorTemplateOption[]
}

export function groupTemplatesByOrientation(
  templates: EditorTemplateOption[],
  excludeId?: string | null
): GroupedEditorTemplates {
  const landscape: EditorTemplateOption[] = []
  const portrait: EditorTemplateOption[] = []

  for (const t of templates) {
    if (excludeId && t.productId === excludeId) continue
    if (getTemplatePreviewOrientation(t.productId) === "landscape") {
      landscape.push(t)
    } else {
      portrait.push(t)
    }
  }

  return { landscape, portrait }
}
