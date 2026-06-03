import type { CanvasElement, CanvasElementType } from "@/lib/editor/canvas-types"

/** User-facing layer categories shown in the Layers panel */
export type LayerCategory =
  | "text"
  | "image"
  | "shape"
  | "qr"
  | "signature"
  | "logo"
  | "background"

export type LayerReorderAction = "forward" | "backward" | "front" | "back"

export function getLayerCategory(element: CanvasElement): LayerCategory {
  if (element.type === "background") return "background"
  if (element.type === "logo") return "logo"
  if (element.type === "signature" || element.type === "stamp") return "signature"
  if (element.type === "qr") return "qr"
  if (element.type === "shape") return "shape"
  if (element.type === "text") return "text"
  return "image"
}

export function layerCategoryLabel(category: LayerCategory): string {
  const labels: Record<LayerCategory, string> = {
    text: "Matn",
    image: "Rasm",
    shape: "Shakl",
    qr: "QR",
    signature: "Imzo",
    logo: "Logo",
    background: "Fon",
  }
  return labels[category]
}

/** Front-most first (for layers list UI) */
export function layersForPanel(elements: CanvasElement[]): CanvasElement[] {
  return [...elements].reverse()
}

export function reorderElements(
  elements: CanvasElement[],
  id: string,
  action: LayerReorderAction
): CanvasElement[] | null {
  const idx = elements.findIndex((e) => e.id === id)
  if (idx < 0) return null

  const next = [...elements]
  const [item] = next.splice(idx, 1)

  let insertAt: number
  switch (action) {
    case "forward":
      insertAt = Math.min(idx + 1, next.length)
      break
    case "backward":
      insertAt = Math.max(idx - 1, 0)
      break
    case "front":
      insertAt = next.length
      break
    case "back":
      insertAt = 0
      break
    default:
      insertAt = idx
  }

  next.splice(insertAt, 0, item)
  return next
}

export function isLegacyElementType(type: string): type is CanvasElementType {
  return [
    "text",
    "image",
    "shape",
    "qr",
    "logo",
    "signature",
    "stamp",
    "background",
  ].includes(type)
}
