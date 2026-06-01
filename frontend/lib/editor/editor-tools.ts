import type { CatalogCategorySlug } from "@/lib/templates/types"
import { CATALOG_PRODUCTS, getProductById } from "@/lib/templates/product-catalog"
import { hasDefaultDesignTemplate } from "@/lib/templates/design-templates"

export type EditorToolId =
  | "select"
  | "hand"
  | "text"
  | "uploads"
  | "elements"
  | "shapes"
  | "qr"
  | "templates"
  | "brand"
  | "layers"

export type EditorInteractionMode = "select" | "hand"

export function interactionModeForTool(tool: EditorToolId): EditorInteractionMode {
  return tool === "hand" ? "hand" : "select"
}

export type EditorTemplateOption = {
  productId: string
  title: string
  description?: string
  format?: string
  isPremium?: boolean
}

/** Templates in the same catalog category as the open product */
export function getTemplatesForEditorContext(templateId: string | null): EditorTemplateOption[] {
  const current = templateId ? getProductById(templateId) : null
  const category = current?.categorySlug

  let products = CATALOG_PRODUCTS.filter((p) => hasDefaultDesignTemplate(p.id))
  if (category) {
    const inCategory = products.filter((p) => p.categorySlug === category)
    if (inCategory.length) products = inCategory
  }

  const sorted = [...products].sort((a, b) => {
    if (a.id === templateId) return -1
    if (b.id === templateId) return 1
    return a.title.localeCompare(b.title, "uz")
  })

  return sorted.map((p) => ({
    productId: p.id,
    title: p.title,
    description: "Oq fon · matn",
    format: p.format,
    isPremium: p.isPremium,
  }))
}

export const BRAND_KIT_COLORS = [
  { id: "navy", label: "Asosiy to‘q", value: "#0a1628" },
  { id: "primary", label: "Primary", value: "#2563eb" },
  { id: "gold", label: "Oltin", value: "#c9a227" },
  { id: "slate", label: "Kulrang", value: "#64748b" },
  { id: "white", label: "Oq", value: "#ffffff" },
  { id: "black", label: "Qora", value: "#000000" },
] as const

export const BRAND_KIT_FONTS = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Manrope", value: "Manrope, sans-serif" },
] as const

export function categoryLabel(slug: CatalogCategorySlug | undefined): string {
  if (!slug) return "Barcha maketlar"
  const labels: Record<CatalogCategorySlug, string> = {
    documents: "Hujjatlar",
    identification: "ID va bejiklar",
    "invitations-marketing": "Taklif va chop etish",
    programs: "Dasturlar va kitoblar",
    "large-format": "Katta format",
    presentations: "Prezentatsiya",
    social: "Ijtimoiy tarmoq",
    brand: "Brend",
    video: "Video",
  }
  return labels[slug] ?? slug
}
