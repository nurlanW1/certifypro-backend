import type { CatalogProduct, ProductFormData } from "./types"
import { getDefaultFormValues } from "./product-form-schema"
import { persistGet, persistKeys, persistRemove, persistSet } from "@/lib/persistence/client-store"

const DRAFT_PREFIX = "gildia-product-draft-"
const META_PREFIX = "gildia-product-draft-meta-"
const PRODUCT_INDEX_KEY = "gildia_product_draft_index"

export type ProductDraftMeta = {
  productId: string
  productTitle: string
  updatedAt: string
}

export type ProductDraft = {
  values: Record<string, string>
  meta: ProductDraftMeta
}

function isBrowser() {
  return typeof window !== "undefined"
}

function registerProductDraftIndex(productId: string, title: string) {
  if (!isBrowser()) return
  try {
    const raw = persistGet(PRODUCT_INDEX_KEY)
    const list: { productId: string; title: string; updatedAt: string }[] = raw
      ? JSON.parse(raw)
      : []
    const entry = { productId, title, updatedAt: new Date().toISOString() }
    const next = [entry, ...list.filter((e) => e.productId !== productId)].slice(0, 100)
    persistSet(PRODUCT_INDEX_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

export function loadProductDraft(productId: string): ProductDraft | null {
  if (!isBrowser()) return null
  try {
    const raw = persistGet(`${DRAFT_PREFIX}${productId}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ProductDraft
    if (!parsed?.values) return null
    return parsed
  } catch {
    return null
  }
}

export function saveProductDraft(product: CatalogProduct, values: Record<string, string>): void {
  if (!isBrowser()) return
  const draft: ProductDraft = {
    values,
    meta: {
      productId: product.id,
      productTitle: product.title,
      updatedAt: new Date().toISOString(),
    },
  }
  persistSet(`${DRAFT_PREFIX}${product.id}`, JSON.stringify(draft))
  persistSet(
    `${META_PREFIX}${product.id}`,
    JSON.stringify({ template: product.id, from: "catalog", title: product.title })
  )
  registerProductDraftIndex(product.id, product.title)
}

export function deleteProductDraft(productId: string) {
  if (!isBrowser()) return
  persistRemove(`${DRAFT_PREFIX}${productId}`)
  persistRemove(`${META_PREFIX}${productId}`)
}

export function getOrCreateDraftValues(product: CatalogProduct): Record<string, string> {
  const existing = loadProductDraft(product.id)
  if (existing?.values) return { ...getDefaultFormValues(product), ...existing.values }
  return getDefaultFormValues(product)
}

/** Map dynamic form values → legacy preview shape */
export function toPreviewFormData(values: Record<string, string>): ProductFormData {
  return {
    eventName: values.eventName ?? values.brandName ?? "",
    fullName: values.fullName ?? values.presenter ?? "",
    organization: values.organization ?? "",
    position: values.position ?? values.badgeRole ?? values.signatoryTitle ?? "",
    date: values.date ?? "",
    subtitle: values.subtitle ?? values.headline ?? values.slogan ?? values.ctaText ?? "",
  }
}

export function getEditorProductName(product: CatalogProduct, values: Record<string, string>): string {
  return values.subtitle || values.headline || values.eventName || product.title
}

export function listRecentDraftProductIds(): string[] {
  if (!isBrowser()) return []
  return persistKeys(DRAFT_PREFIX).map((k) => k.replace(DRAFT_PREFIX, ""))
}
