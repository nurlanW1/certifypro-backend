import type { CatalogProduct } from "./types"

export type FormFieldType = "text" | "textarea" | "date" | "url" | "color" | "select"

export type FormFieldDefinition = {
  key: string
  label: string
  type: FormFieldType
  placeholder?: string
  hint?: string
  options?: { value: string; label: string }[]
}

/** Shared field library — referenced by product schemas */
export const FORM_FIELD_LIBRARY: Record<string, FormFieldDefinition> = {
  eventName: {
    key: "eventName",
    label: "Tadbir nomi",
    type: "text",
    placeholder: "Tashkent International AI Forum 2026",
  },
  fullName: {
    key: "fullName",
    label: "Ism familiya",
    type: "text",
    placeholder: "Ism Familiya",
  },
  organization: {
    key: "organization",
    label: "Tashkilot",
    type: "text",
    placeholder: "Tashkilot nomi",
  },
  position: {
    key: "position",
    label: "Lavozim",
    type: "text",
    placeholder: "Lavozim / rol",
  },
  date: {
    key: "date",
    label: "Sana",
    type: "date",
  },
  subtitle: {
    key: "subtitle",
    label: "Sarlavha / subtitr",
    type: "textarea",
    placeholder: "Rasmiy ishtirok sertifikati",
  },
  certificateId: {
    key: "certificateId",
    label: "Sertifikat ID",
    type: "text",
    placeholder: "CERT-2026-001",
  },
  signatoryTitle: {
    key: "signatoryTitle",
    label: "Imzo lavozimi",
    type: "text",
    placeholder: "Direktor",
  },
  venue: {
    key: "venue",
    label: "Joy / manzil",
    type: "text",
    placeholder: "Toshkent, Istiqlol Saroyi",
  },
  badgeRole: {
    key: "badgeRole",
    label: "Bejik turi",
    type: "select",
    options: [
      { value: "delegat", label: "Delegat" },
      { value: "vip", label: "VIP" },
      { value: "press", label: "Press" },
      { value: "speaker", label: "Spiker" },
    ],
  },
  qrUrl: {
    key: "qrUrl",
    label: "QR havola",
    type: "url",
    placeholder: "https://register.example.uz",
  },
  headline: {
    key: "headline",
    label: "Asosiy sarlavha",
    type: "text",
    placeholder: "Konferensiya 2026",
  },
  sessionTitle: {
    key: "sessionTitle",
    label: "Sessiya mavzusi",
    type: "text",
    placeholder: "Plenary session",
  },
  slogan: {
    key: "slogan",
    label: "Slogan / tagline",
    type: "text",
    placeholder: "Innovation for Future",
  },
  presenter: {
    key: "presenter",
    label: "Spiker / moderator",
    type: "text",
    placeholder: "Ism Familiya",
  },
  hashtag: {
    key: "hashtag",
    label: "Hashtag",
    type: "text",
    placeholder: "#konferensiya2026",
  },
  ctaText: {
    key: "ctaText",
    label: "CTA matni",
    type: "text",
    placeholder: "Ro‘yxatdan o‘ting",
  },
  brandName: {
    key: "brandName",
    label: "Brend nomi",
    type: "text",
    placeholder: "Gildia Forum",
  },
  primaryColor: {
    key: "primaryColor",
    label: "Asosiy rang",
    type: "color",
    placeholder: "#2563eb",
  },
  sponsorLevel: {
    key: "sponsorLevel",
    label: "Sponsor darajasi",
    type: "select",
    options: [
      { value: "platinum", label: "Platinum" },
      { value: "gold", label: "Gold" },
      { value: "silver", label: "Silver" },
    ],
  },
  videoDuration: {
    key: "videoDuration",
    label: "Davomiyligi",
    type: "text",
    placeholder: "00:15",
  },
}

/** Product id → ordered field keys */
const PRODUCT_FIELD_KEYS: Record<string, string[]> = {
  certificate: ["eventName", "fullName", "organization", "position", "date", "subtitle", "certificateId", "signatoryTitle"],
  diploma: ["eventName", "fullName", "organization", "position", "date", "subtitle", "signatoryTitle"],
  "thank-you-letter": ["eventName", "fullName", "organization", "date", "subtitle", "signatoryTitle"],
  badge: ["fullName", "organization", "position", "eventName", "badgeRole", "qrUrl"],
  "business-card": ["fullName", "organization", "position", "eventName", "qrUrl"],
  invitation: ["eventName", "fullName", "organization", "position", "date", "venue", "subtitle"],
  flyer: ["eventName", "headline", "date", "venue", "subtitle", "organization"],
  poster: ["eventName", "headline", "date", "venue", "subtitle"],
  "scientific-poster": ["eventName", "fullName", "organization", "sessionTitle", "subtitle"],
  "program-book": ["eventName", "date", "venue", "organization", "subtitle"],
  "proceedings-book": ["eventName", "date", "organization", "subtitle", "sessionTitle"],
  catalog: ["eventName", "organization", "subtitle", "date"],
  "report-book": ["eventName", "organization", "date", "subtitle"],
  "photo-album": ["eventName", "date", "organization", "subtitle"],
  folder: ["eventName", "organization", "subtitle"],
  "rollup-banner": ["eventName", "organization", "slogan", "subtitle"],
  "press-wall": ["eventName", "organization", "slogan", "subtitle"],
  "stage-backdrop": ["eventName", "organization", "slogan", "subtitle"],
  "led-screen-design": ["eventName", "headline", "slogan", "subtitle"],
  "opening-slide": ["eventName", "presenter", "date", "subtitle"],
  powerpoint: ["eventName", "presenter", "organization", "subtitle"],
  "table-tent": ["fullName", "organization", "position", "eventName"],
  "navigation-signs": ["eventName", "venue", "subtitle"],
  "registration-stand": ["eventName", "organization", "venue", "subtitle"],
  "qr-cards": ["fullName", "eventName", "organization", "qrUrl", "badgeRole"],
  "sponsor-banner": ["organization", "eventName", "sponsorLevel", "slogan"],
  "partner-banner": ["organization", "eventName", "slogan"],
  "social-media-post": ["eventName", "subtitle", "hashtag", "ctaText", "date"],
  "instagram-story": ["eventName", "subtitle", "hashtag", "ctaText"],
  "telegram-banner": ["eventName", "subtitle", "ctaText"],
  "linkedin-banner": ["eventName", "organization", "subtitle"],
  "email-banner": ["eventName", "subtitle", "ctaText", "date"],
  "press-kit": ["eventName", "organization", "brandName", "subtitle"],
  "video-intro": ["eventName", "subtitle", "videoDuration", "organization"],
  "video-outro": ["eventName", "subtitle", "ctaText", "organization"],
  "lower-thirds": ["fullName", "position", "organization", "eventName"],
  "brand-book": ["brandName", "eventName", "organization", "primaryColor", "subtitle"],
  "color-system": ["brandName", "primaryColor", "eventName"],
  "font-guide": ["brandName", "eventName", "organization"],
  letterhead: ["organization", "eventName", "subtitle", "date"],
  envelope: ["organization", "eventName", "subtitle"],
  "diploma-cover": ["eventName", "organization", "subtitle", "date"],
  "certificate-folder": ["eventName", "organization", "subtitle"],
  "souvenir-designs": ["brandName", "eventName", "slogan"],
  stickers: ["brandName", "eventName", "hashtag"],
  "name-tags": ["fullName", "organization", "position", "eventName"],
  "final-report": ["eventName", "organization", "date", "subtitle"],
  "photo-catalog": ["eventName", "date", "organization", "subtitle"],
  "video-presentation": ["eventName", "presenter", "subtitle", "organization"],
}

const DEFAULT_KEYS = ["eventName", "fullName", "organization", "position", "date", "subtitle"]

/** Category fallback when product id not in map */
const CATEGORY_FIELD_KEYS: Record<string, string[]> = {
  documents: DEFAULT_KEYS,
  identification: ["fullName", "organization", "position", "eventName", "badgeRole", "qrUrl"],
  "invitations-marketing": ["eventName", "headline", "fullName", "date", "venue", "subtitle", "organization"],
  programs: ["eventName", "date", "organization", "subtitle", "sessionTitle"],
  "large-format": ["eventName", "organization", "slogan", "subtitle"],
  presentations: ["eventName", "presenter", "subtitle", "organization", "date"],
  social: ["eventName", "subtitle", "hashtag", "ctaText", "date"],
  brand: ["brandName", "eventName", "organization", "primaryColor", "subtitle"],
  video: ["eventName", "subtitle", "fullName", "organization", "videoDuration"],
}

export function getFieldKeysForProduct(product: CatalogProduct): string[] {
  return PRODUCT_FIELD_KEYS[product.id] ?? CATEGORY_FIELD_KEYS[product.categorySlug] ?? DEFAULT_KEYS
}

export function getFieldsForProduct(product: CatalogProduct): FormFieldDefinition[] {
  const keys = getFieldKeysForProduct(product)
  return keys
    .map((key) => FORM_FIELD_LIBRARY[key])
    .filter((f): f is FormFieldDefinition => Boolean(f))
}

export function getDefaultFormValues(product: CatalogProduct): Record<string, string> {
  const keys = getFieldKeysForProduct(product)
  const defaults: Record<string, string> = {
    eventName: "Tashkent International AI Forum 2026",
    fullName: "Ism Familiya",
    organization: "Tashkilot nomi",
    position: "Lavozim",
    date: new Date().toISOString().slice(0, 10),
    subtitle: product.title,
    headline: product.title,
    sessionTitle: "Asosiy sessiya",
    slogan: "Innovation for Future",
    presenter: "Ism Familiya",
    hashtag: "#konferensiya",
    ctaText: "Batafsil",
    brandName: "Gildia",
    primaryColor: "#2563eb",
    certificateId: "CERT-2026-001",
    signatoryTitle: "Direktor",
    venue: "Toshkent",
    badgeRole: "delegat",
    qrUrl: "https://gildia.uz/register",
    sponsorLevel: "gold",
    videoDuration: "00:15",
  }
  const result: Record<string, string> = {}
  for (const key of keys) {
    result[key] = defaults[key] ?? ""
  }
  return result
}
