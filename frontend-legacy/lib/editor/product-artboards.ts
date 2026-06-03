/**
 * Product artboard formats — physical specs + editor canvas dimensions (aspect-accurate).
 * Editor longest side is scaled to MAX_EDITOR_SIDE for comfortable workspace viewing.
 */

export const MAX_EDITOR_SIDE = 560

export type ArtboardFormatId = string

export type ArtboardUnit = "mm" | "px"

export type ArtboardFormatCategory = "document" | "card" | "print" | "large" | "digital"

export type ArtboardFormatDefinition = {
  id: ArtboardFormatId
  label: string
  /** Short label for toolbar / status bar */
  shortLabel: string
  physicalWidth: number
  physicalHeight: number
  unit: ArtboardUnit
  category: ArtboardFormatCategory
}

export type ResolvedArtboard = {
  formatId: ArtboardFormatId
  width: number
  height: number
  label: string
  shortLabel: string
  physicalLabel: string
}

/** All supported formats (user-facing names) */
export const ARTBOARD_FORMATS: ArtboardFormatDefinition[] = [
  {
    id: "certificate-a4-landscape",
    label: "Certificate — A4 landscape",
    shortLabel: "A4 ⟷",
    physicalWidth: 297,
    physicalHeight: 210,
    unit: "mm",
    category: "document",
  },
  {
    id: "certificate-a4-portrait",
    label: "Certificate — A4 portrait",
    shortLabel: "A4 ↕",
    physicalWidth: 210,
    physicalHeight: 297,
    unit: "mm",
    category: "document",
  },
  {
    id: "badge-90x55",
    label: "Badge — 90 × 55 mm",
    shortLabel: "90×55 mm",
    physicalWidth: 90,
    physicalHeight: 55,
    unit: "mm",
    category: "card",
  },
  {
    id: "business-card-90x50",
    label: "Business card — 90 × 50 mm",
    shortLabel: "90×50 mm",
    physicalWidth: 90,
    physicalHeight: 50,
    unit: "mm",
    category: "card",
  },
  {
    id: "invitation-a5",
    label: "Invitation — A5",
    shortLabel: "A5",
    physicalWidth: 148,
    physicalHeight: 210,
    unit: "mm",
    category: "print",
  },
  {
    id: "flyer-a5",
    label: "Flyer — A5",
    shortLabel: "A5 flyer",
    physicalWidth: 148,
    physicalHeight: 210,
    unit: "mm",
    category: "print",
  },
  {
    id: "poster-a3",
    label: "Poster — A3 portrait",
    shortLabel: "A3",
    physicalWidth: 297,
    physicalHeight: 420,
    unit: "mm",
    category: "print",
  },
  {
    id: "poster-a2",
    label: "Poster — A2 portrait",
    shortLabel: "A2",
    physicalWidth: 420,
    physicalHeight: 594,
    unit: "mm",
    category: "print",
  },
  {
    id: "poster-a1",
    label: "Poster — A1 portrait",
    shortLabel: "A1",
    physicalWidth: 594,
    physicalHeight: 841,
    unit: "mm",
    category: "print",
  },
  {
    id: "scientific-poster-a0",
    label: "Scientific poster — A0",
    shortLabel: "A0",
    physicalWidth: 841,
    physicalHeight: 1189,
    unit: "mm",
    category: "print",
  },
  {
    id: "rollup-85x200",
    label: "Roll-up — 85 × 200 cm",
    shortLabel: "85×200 cm",
    physicalWidth: 850,
    physicalHeight: 2000,
    unit: "mm",
    category: "large",
  },
  {
    id: "press-wall-300x200",
    label: "Press wall — 300 × 200 cm",
    shortLabel: "300×200 cm",
    physicalWidth: 3000,
    physicalHeight: 2000,
    unit: "mm",
    category: "large",
  },
  {
    id: "stage-backdrop-1080p",
    label: "Stage backdrop — 1920 × 1080",
    shortLabel: "1920×1080",
    physicalWidth: 1920,
    physicalHeight: 1080,
    unit: "px",
    category: "digital",
  },
  {
    id: "led-screen-1080p",
    label: "LED screen — 1920 × 1080",
    shortLabel: "1920×1080",
    physicalWidth: 1920,
    physicalHeight: 1080,
    unit: "px",
    category: "digital",
  },
  {
    id: "instagram-post-1080",
    label: "Instagram post — 1080 × 1080",
    shortLabel: "IG 1:1",
    physicalWidth: 1080,
    physicalHeight: 1080,
    unit: "px",
    category: "digital",
  },
  {
    id: "instagram-story-1080",
    label: "Instagram Story — 1080 × 1920",
    shortLabel: "IG Story",
    physicalWidth: 1080,
    physicalHeight: 1920,
    unit: "px",
    category: "digital",
  },
  {
    id: "linkedin-banner",
    label: "LinkedIn banner — 1584 × 396",
    shortLabel: "LinkedIn",
    physicalWidth: 1584,
    physicalHeight: 396,
    unit: "px",
    category: "digital",
  },
  {
    id: "telegram-banner",
    label: "Telegram banner — 1280 × 720",
    shortLabel: "Telegram",
    physicalWidth: 1280,
    physicalHeight: 720,
    unit: "px",
    category: "digital",
  },
  {
    id: "email-banner",
    label: "Email banner — 1200 × 400",
    shortLabel: "Email",
    physicalWidth: 1200,
    physicalHeight: 400,
    unit: "px",
    category: "digital",
  },
  {
    id: "a4-portrait",
    label: "A4 portrait (generic)",
    shortLabel: "A4 ↕",
    physicalWidth: 210,
    physicalHeight: 297,
    unit: "mm",
    category: "document",
  },
  {
    id: "a4-landscape",
    label: "A4 landscape (generic)",
    shortLabel: "A4 ⟷",
    physicalWidth: 297,
    physicalHeight: 210,
    unit: "mm",
    category: "document",
  },
]

export const FORMAT_BY_ID = Object.fromEntries(ARTBOARD_FORMATS.map((f) => [f.id, f])) as Record<
  string,
  ArtboardFormatDefinition
>

/** Default format per catalog product id */
export const PRODUCT_ARTBOARD_FORMAT: Record<string, ArtboardFormatId> = {
  certificate: "certificate-a4-landscape",
  diploma: "certificate-a4-portrait",
  "thank-you-letter": "a4-portrait",
  "diploma-cover": "a4-portrait",
  "letterhead": "a4-portrait",
  "final-report": "a4-portrait",
  "report-book": "a4-portrait",
  "proceedings-book": "a4-portrait",
  "program-book": "a4-portrait",
  catalog: "a4-portrait",
  "photo-album": "a4-landscape",
  "photo-catalog": "a4-landscape",
  folder: "a4-portrait",
  badge: "badge-90x55",
  "name-tags": "badge-90x55",
  "qr-cards": "badge-90x55",
  "business-card": "business-card-90x50",
  invitation: "invitation-a5",
  "table-tent": "invitation-a5",
  flyer: "flyer-a5",
  poster: "poster-a1",
  "scientific-poster": "scientific-poster-a0",
  "navigation-signs": "poster-a2",
  "rollup-banner": "rollup-85x200",
  "registration-stand": "rollup-85x200",
  "press-wall": "press-wall-300x200",
  "sponsor-banner": "press-wall-300x200",
  "partner-banner": "press-wall-300x200",
  "stage-backdrop": "stage-backdrop-1080p",
  "led-screen-design": "led-screen-1080p",
  "opening-slide": "led-screen-1080p",
  powerpoint: "led-screen-1080p",
  "video-presentation": "led-screen-1080p",
  "video-intro": "led-screen-1080p",
  "video-outro": "led-screen-1080p",
  "lower-thirds": "led-screen-1080p",
  "social-media-post": "instagram-post-1080",
  "instagram-story": "instagram-story-1080",
  "telegram-banner": "telegram-banner",
  "linkedin-banner": "linkedin-banner",
  "email-banner": "email-banner",
  "press-kit": "a4-portrait",
  "brand-book": "a4-portrait",
  "color-system": "a4-portrait",
  "font-guide": "a4-portrait",
  envelope: "a4-landscape",
  "certificate-folder": "a4-landscape",
  "souvenir-designs": "a4-portrait",
  stickers: "a4-portrait",
}

const DEFAULT_FORMAT_ID: ArtboardFormatId = "certificate-a4-landscape"

export function physicalSizeLabel(def: ArtboardFormatDefinition): string {
  const w = def.physicalWidth
  const h = def.physicalHeight
  if (def.unit === "px") return `${w} × ${h} px`
  if (w >= 100 || h >= 100) {
    return `${w / 10} × ${h / 10} cm`
  }
  return `${w} × ${h} mm`
}

/** Editor pixel dimensions preserving aspect ratio */
export function editorDimensionsFromFormat(
  def: ArtboardFormatDefinition,
  maxSide = MAX_EDITOR_SIDE
): { width: number; height: number } {
  const w = def.physicalWidth
  const h = def.physicalHeight
  if (w <= 0 || h <= 0) return { width: maxSide, height: Math.round(maxSide * 0.7) }

  if (w >= h) {
    return {
      width: maxSide,
      height: Math.max(32, Math.round((maxSide * h) / w)),
    }
  }
  return {
    width: Math.max(32, Math.round((maxSide * w) / h)),
    height: maxSide,
  }
}

export function resolveArtboardFormat(formatId: ArtboardFormatId): ResolvedArtboard {
  const def = FORMAT_BY_ID[formatId] ?? FORMAT_BY_ID[DEFAULT_FORMAT_ID]
  const { width, height } = editorDimensionsFromFormat(def)
  const physicalLabel = physicalSizeLabel(def)

  return {
    formatId: def.id,
    width,
    height,
    label: `${def.shortLabel} · ${physicalLabel}`,
    shortLabel: def.shortLabel,
    physicalLabel,
  }
}

export function resolveArtboardForProduct(productId: string | null | undefined): ResolvedArtboard {
  const formatId =
    (productId && PRODUCT_ARTBOARD_FORMAT[productId]) || DEFAULT_FORMAT_ID
  return resolveArtboardFormat(formatId)
}

export function findFormatIdByEditorSize(
  width: number,
  height: number
): ArtboardFormatId | null {
  const match = ARTBOARD_FORMATS.find((def) => {
    const { width: ew, height: eh } = editorDimensionsFromFormat(def)
    return ew === width && eh === height
  })
  return match?.id ?? null
}

export function resolveArtboardFromSaved(
  productId: string | null | undefined,
  saved?: {
    artboardFormatId?: string | null
    artboardWidth?: number
    artboardHeight?: number
  }
): ResolvedArtboard {
  if (saved?.artboardFormatId && FORMAT_BY_ID[saved.artboardFormatId]) {
    return resolveArtboardFormat(saved.artboardFormatId)
  }
  if (saved?.artboardWidth && saved?.artboardHeight) {
    const bySize = findFormatIdByEditorSize(saved.artboardWidth, saved.artboardHeight)
    if (bySize) return resolveArtboardFormat(bySize)
    return {
      formatId: "custom",
      width: saved.artboardWidth,
      height: saved.artboardHeight,
      label: `${saved.artboardWidth} × ${saved.artboardHeight} px (maxsus)`,
      shortLabel: "Maxsus",
      physicalLabel: `${saved.artboardWidth} × ${saved.artboardHeight} px`,
    }
  }
  return resolveArtboardForProduct(productId)
}

export const ARTBOARD_FORMAT_GROUPS: {
  category: ArtboardFormatCategory
  title: string
  ids: ArtboardFormatId[]
}[] = [
  {
    category: "document",
    title: "Hujjatlar",
    ids: ["certificate-a4-landscape", "certificate-a4-portrait", "a4-portrait", "a4-landscape"],
  },
  {
    category: "card",
    title: "Kartalar",
    ids: ["badge-90x55", "business-card-90x50"],
  },
  {
    category: "print",
    title: "Chop etish",
    ids: [
      "invitation-a5",
      "flyer-a5",
      "poster-a3",
      "poster-a2",
      "poster-a1",
      "scientific-poster-a0",
    ],
  },
  {
    category: "large",
    title: "Katta format",
    ids: ["rollup-85x200", "press-wall-300x200"],
  },
  {
    category: "digital",
    title: "Raqamli",
    ids: [
      "stage-backdrop-1080p",
      "led-screen-1080p",
      "instagram-post-1080",
      "instagram-story-1080",
      "linkedin-banner",
      "telegram-banner",
      "email-banner",
    ],
  },
]
