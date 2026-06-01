export type CatalogCategorySlug =
  | "documents"
  | "identification"
  | "invitations-marketing"
  | "programs"
  | "large-format"
  | "presentations"
  | "social"
  | "brand"
  | "video"

export type CatalogCategory = {
  slug: CatalogCategorySlug
  name: string
  icon: string
}

export type MockupVariant =
  | "certificate"
  | "badge"
  | "invitation"
  | "flyer"
  | "poster"
  | "program"
  | "rollup"
  | "press-wall"
  | "backdrop"
  | "social"
  | "brand-kit"
  | "report"

export type PreviewTone =
  | "document"
  | "card"
  | "print"
  | "large"
  | "digital"
  | "brand"
  | "video"

export type CatalogProduct = {
  id: string
  title: string
  description: string
  categorySlug: CatalogCategorySlug
  format: string
  variant: MockupVariant
  previewTone: PreviewTone
  isPremium: boolean
  isPrint: boolean
  isOnline: boolean
}

export type ProductFormData = {
  eventName: string
  fullName: string
  organization: string
  position: string
  date: string
  subtitle: string
}

export const DEFAULT_PRODUCT_FORM: ProductFormData = {
  eventName: "Tashkent International AI Forum 2026",
  fullName: "Ism Familiya",
  organization: "Tashkilot nomi",
  position: "Lavozim",
  date: "2026-05-29",
  subtitle: "Rasmiy ishtirok sertifikati",
}
