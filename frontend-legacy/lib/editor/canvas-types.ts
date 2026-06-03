export type CanvasElementType =
  | "text"
  | "image"
  | "shape"
  | "qr"
  | "logo"
  | "signature"
  | "stamp"
  | "background"

export type ShapeKind = "rect" | "ellipse" | "line" | "triangle" | "star"

export type TextAlign = "left" | "center" | "right"

export type CanvasElement = {
  id: string
  type: CanvasElementType
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  locked: boolean
  /** When true, layer is not rendered on canvas but remains in the stack */
  hidden: boolean
  /** Text content or layer label fallback */
  label: string
  fontSize: number
  fontFamily: string
  color: string
  textAlign: TextAlign
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  /** Image / brand assets (data URL) */
  src?: string
  objectFit: "cover" | "contain"
  /** Shapes */
  shapeKind: ShapeKind
  fill: string
  stroke: string
  strokeWidth: number
  cornerRadius: number
  /** QR — foreground modules & quiet zone background */
  qrValue: string
  qrForeground: string
  qrBackground: string
}

export type EditorDesignStatus = "draft" | "saved"

export type EditorDesignState = {
  productName: string
  /** Catalog product id or event material category */
  productType?: string
  eventId?: string | null
  category?: string | null
  status?: EditorDesignStatus
  /** Primary canvas payload (mirrors elements for API compatibility) */
  canvasData: CanvasElement[]
  artboardWidth: number
  artboardHeight: number
  artboardBackground: string
  /** Canonical format id from product-artboards */
  artboardFormatId?: string
  /** @deprecated Use canvasData — kept for older saved designs */
  elements?: CanvasElement[]
  /** JPEG data URL preview */
  thumbnail?: string | null
  updatedAt: string
}

export const FONT_WEIGHT_OPTIONS = [
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semibold" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extra bold" },
] as const

export const FONT_FAMILIES = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Manrope, sans-serif", label: "Manrope" },
  { value: "Arial, sans-serif", label: "Arial" },
]

export const ARTBOARD_A4_LANDSCAPE = { width: 560, height: 396 }
