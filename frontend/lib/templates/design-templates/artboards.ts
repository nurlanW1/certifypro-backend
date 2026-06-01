import { resolveArtboardForProduct } from "@/lib/editor/product-artboards"
import type { TemplateArtboard } from "./types"

export function artboardForProduct(productId: string): TemplateArtboard {
  const resolved = resolveArtboardForProduct(productId)
  return {
    width: resolved.width,
    height: resolved.height,
    label: resolved.label,
  }
}

/** @deprecated Use artboardForProduct */
export const TEMPLATE_ARTBOARDS: Record<string, TemplateArtboard> = {}
