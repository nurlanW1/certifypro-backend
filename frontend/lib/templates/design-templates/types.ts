import type { ShapeKind, TextAlign } from "@/lib/editor/canvas-types"

/** Merge fields applied when seeding editor or live preview */
export type TemplateTokens = {
  eventName: string
  fullName: string
  organization: string
  position: string
  date: string
  subtitle: string
}

export type TemplateArtboard = {
  width: number
  height: number
  label: string
}

export type BackgroundLayerSpec = {
  kind: "background"
  id: string
  name?: string
  shape?: "rect"
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke?: string
  strokeWidth?: number
  rotation?: number
  opacity?: number
  locked?: boolean
}

export type ShapeLayerSpec = {
  kind: "shape"
  id: string
  name?: string
  shape: ShapeKind
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke?: string
  strokeWidth?: number
  rotation?: number
  opacity?: number
  locked?: boolean
}

export type TextLayerSpec = {
  kind: "text"
  id: string
  name: string
  placeholder: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  fontWeight?: number
  color: string
  textAlign?: TextAlign
  fontFamily?: string
  opacity?: number
  locked?: boolean
}

export type ImageLayerSpec = {
  kind: "image" | "logo" | "signature" | "stamp"
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  objectFit?: "cover" | "contain"
  opacity?: number
  locked?: boolean
}

export type QrLayerSpec = {
  kind: "qr"
  id: string
  name?: string
  placeholder?: string
  x: number
  y: number
  width: number
  height: number
  locked?: boolean
}

export type TemplateLayerSpec =
  | BackgroundLayerSpec
  | ShapeLayerSpec
  | TextLayerSpec
  | ImageLayerSpec
  | QrLayerSpec

export type DesignTemplateDefinition = {
  productId: string
  title: string
  artboard: TemplateArtboard
  layers: TemplateLayerSpec[]
}

export type CompiledDesignTemplate = {
  productId: string
  title: string
  artboardWidth: number
  artboardHeight: number
  artboardLabel: string
  elements: import("@/lib/editor/canvas-types").CanvasElement[]
}
