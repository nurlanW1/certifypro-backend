import { DESIGN_TEMPLATE_BY_PRODUCT_ID, DESIGN_TEMPLATE_DEFINITIONS } from "./definitions"
import type { CompiledDesignTemplate, DesignTemplateDefinition } from "./types"
import type { ProductFormData } from "@/lib/templates/types"
import { getProductById } from "@/lib/templates/product-catalog"

export type {
  CompiledDesignTemplate,
  DesignTemplateDefinition,
  TemplateLayerSpec,
  TemplateTokens,
} from "./types"

export { DESIGN_TEMPLATE_DEFINITIONS, DESIGN_TEMPLATE_BY_PRODUCT_ID }
export { artboardForProduct, TEMPLATE_ARTBOARDS } from "./artboards"
export { compileDesignTemplate } from "./builder"
export { tokensFromPreview, applyTemplateTokens } from "./tokens"

export const FOCUSED_TEMPLATE_PRODUCT_IDS = [
  "certificate",
  "badge",
  "invitation",
  "flyer",
  "poster",
  "program-book",
  "rollup-banner",
  "press-wall",
  "stage-backdrop",
  "social-media-post",
] as const

export type FocusedTemplateProductId = (typeof FOCUSED_TEMPLATE_PRODUCT_IDS)[number]

export function hasDefaultDesignTemplate(productId: string): boolean {
  return Boolean(getProductById(productId))
}

export function getDesignTemplateDefinition(productId: string): DesignTemplateDefinition | null {
  return DESIGN_TEMPLATE_BY_PRODUCT_ID[productId] ?? null
}

export { compileProductStarterTemplate } from "./starter"

import { compileProductStarterTemplate } from "./starter"

/** Default canvas for catalog, editor, and previews — white background, text layers only */
export function compileDefaultDesignTemplate(
  productId: string,
  preview?: Partial<ProductFormData>
): CompiledDesignTemplate | null {
  if (!hasDefaultDesignTemplate(productId)) return null
  return compileProductStarterTemplate(productId, preview)
}

/** Quick picks shown in editor left panel */
export const EDITOR_QUICK_TEMPLATES = FOCUSED_TEMPLATE_PRODUCT_IDS.map((id) => {
  const def = DESIGN_TEMPLATE_BY_PRODUCT_ID[id]
  return { productId: id, title: def?.title ?? id }
})
