import { resolveArtboardForProduct } from "@/lib/editor/product-artboards"
import type { CatalogProduct, PreviewTone } from "@/lib/templates/types"
import { CATALOG_PRODUCTS } from "@/lib/templates/product-catalog"

export type SizeFormatGroupId = "small" | "medium" | "large" | "book"

export type SizeFormatGroup = {
  id: SizeFormatGroupId
  title: string
  description: string
  productIds: string[]
}

/** Display order for catalog — small formats first, books last */
export const SIZE_FORMAT_GROUPS: SizeFormatGroup[] = [
  {
    id: "small",
    title: "Kichik formatlar",
    description: "Bejik, vizitka, QR karta va stol belgilari",
    productIds: [
      "badge",
      "business-card",
      "name-tags",
      "qr-cards",
      "table-tent",
      "stickers",
    ],
  },
  {
    id: "medium",
    title: "O‘rta formatlar",
    description: "Sertifikat, taklifnoma, flyer va ijtimoiy tarmoq",
    productIds: [
      "certificate",
      "diploma",
      "thank-you-letter",
      "invitation",
      "flyer",
      "social-media-post",
      "instagram-story",
      "telegram-banner",
      "linkedin-banner",
      "email-banner",
      "opening-slide",
    ],
  },
  {
    id: "large",
    title: "Katta formatlar",
    description: "Poster, roll-up, press-wall va sahna fonlari",
    productIds: [
      "poster",
      "scientific-poster",
      "rollup-banner",
      "press-wall",
      "stage-backdrop",
      "led-screen-design",
      "registration-stand",
      "navigation-signs",
      "sponsor-banner",
      "partner-banner",
    ],
  },
  {
    id: "book",
    title: "Ko‘p sahifali / kitob",
    description: "Dastur kitobi, hisobot va brend qo‘llanmalari",
    productIds: [
      "program-book",
      "proceedings-book",
      "catalog",
      "report-book",
      "photo-album",
      "brand-book",
      "font-guide",
      "final-report",
      "photo-catalog",
      "video-presentation",
      "powerpoint",
      "folder",
    ],
  },
]

const productById = new Map(CATALOG_PRODUCTS.map((p) => [p.id, p]))

const groupOrder = new Map<SizeFormatGroupId, number>(
  SIZE_FORMAT_GROUPS.map((g, i) => [g.id, i])
)

const productGroupMap = new Map<string, SizeFormatGroupId>()
for (const group of SIZE_FORMAT_GROUPS) {
  for (const id of group.productIds) {
    productGroupMap.set(id, group.id)
  }
}

export function getSizeGroupForProduct(productId: string): SizeFormatGroupId {
  return productGroupMap.get(productId) ?? "medium"
}

/** Stable preview frame for catalog cards (avoids extreme artboard ratios squishing the grid) */
export function getCatalogPreviewFrame(
  tone: PreviewTone,
  productId: string
): { width: number; height: number } {
  const { width, height } = resolveArtboardForProduct(productId)
  const landscape = width >= height

  switch (tone) {
    case "card":
      return landscape ? { width: 90, height: 55 } : { width: 55, height: 90 }
    case "large":
      return landscape ? { width: 16, height: 9 } : { width: 3, height: 4 }
    case "digital":
    case "video":
      return { width: 16, height: 9 }
    case "brand":
      return { width: 4, height: 3 }
    case "print":
      return landscape ? { width: 297, height: 210 } : { width: 210, height: 297 }
    case "document":
    default:
      return landscape ? { width: 297, height: 210 } : { width: 210, height: 297 }
  }
}

export function getPreviewAspectClass(tone: PreviewTone, productId?: string): string {
  if (productId) {
    const f = getCatalogPreviewFrame(tone, productId)
    return `aspect-[${f.width}/${f.height}]`
  }
  switch (tone) {
    case "card":
      return "aspect-[90/55]"
    case "large":
      return "aspect-[16/9]"
    case "digital":
    case "video":
      return "aspect-video"
    case "brand":
      return "aspect-[4/3]"
    case "print":
      return "aspect-[210/297]"
    case "document":
    default:
      return "aspect-[297/210]"
  }
}

export function getCatalogGridClass(groupId: SizeFormatGroupId): string {
  const base = "grid w-full items-start gap-5"
  switch (groupId) {
    case "small":
      return `${base} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
    case "large":
      return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
    case "book":
      return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
    case "medium":
    default:
      return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
  }
}

export function sortProductsBySizeGroup(products: CatalogProduct[]): CatalogProduct[] {
  return [...products].sort((a, b) => {
    const ga = groupOrder.get(getSizeGroupForProduct(a.id)) ?? 99
    const gb = groupOrder.get(getSizeGroupForProduct(b.id)) ?? 99
    if (ga !== gb) return ga - gb
    const ia = SIZE_FORMAT_GROUPS[ga]?.productIds.indexOf(a.id) ?? 999
    const ib = SIZE_FORMAT_GROUPS[gb]?.productIds.indexOf(b.id) ?? 999
    return ia - ib
  })
}

export function groupProductsBySize(
  products: CatalogProduct[]
): { group: SizeFormatGroup; products: CatalogProduct[] }[] {
  const buckets = new Map<SizeFormatGroupId, CatalogProduct[]>()
  for (const g of SIZE_FORMAT_GROUPS) {
    buckets.set(g.id, [])
  }
  const other: CatalogProduct[] = []
  for (const p of products) {
    const gid = productGroupMap.get(p.id)
    if (gid && buckets.has(gid)) {
      buckets.get(gid)!.push(p)
    } else {
      other.push(p)
    }
  }
  const result = SIZE_FORMAT_GROUPS.map((group) => ({
    group,
    products: (buckets.get(group.id) ?? []).sort(
      (a, b) => group.productIds.indexOf(a.id) - group.productIds.indexOf(b.id)
    ),
  })).filter((s) => s.products.length > 0)
  if (other.length) {
    result.push({
      group: {
        id: "medium",
        title: "Boshqa mahsulotlar",
        description: "",
        productIds: [],
      },
      products: other,
    })
  }
  return result
}

export function getProductByIdFromCatalog(id: string) {
  return productById.get(id)
}
