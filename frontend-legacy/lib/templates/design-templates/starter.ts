import { createBackgroundElement, createTextElement } from "@/lib/editor/canvas-factory"
import { resolveArtboardForProduct } from "@/lib/editor/product-artboards"
import { getProductById } from "@/lib/templates/product-catalog"
import type { ProductFormData } from "@/lib/templates/types"
import { tokensFromPreview } from "./tokens"
import type { CompiledDesignTemplate } from "./types"

const TEXT_PRIMARY = "#0f172a"
const TEXT_SECONDARY = "#475569"
const TEXT_MUTED = "#64748b"

/** Default layout: white artboard, text layers only (no frames, shapes, or brand chrome) */
export function compileProductStarterTemplate(
  productId: string,
  preview?: Partial<ProductFormData>
): CompiledDesignTemplate {
  const product = getProductById(productId)
  const artboard = resolveArtboardForProduct(productId)
  const tokens = tokensFromPreview(preview ?? {})
  const w = artboard.width
  const h = artboard.height
  const margin = Math.max(32, Math.round(Math.min(w, h) * 0.08))
  const innerW = w - margin * 2

  const elements = [
    createBackgroundElement({
      id: "bg",
      name: "Fon",
      x: 0,
      y: 0,
      width: w,
      height: h,
      fill: "#ffffff",
      locked: true,
    }),
    createTextElement({
      id: "eyebrow",
      name: "Tur",
      label: product?.title ?? productId,
      x: margin,
      y: margin,
      width: innerW,
      height: 24,
      fontSize: Math.max(10, Math.round(h * 0.024)),
      fontWeight: 600,
      color: TEXT_MUTED,
      textAlign: "center",
      fontFamily: "Inter, sans-serif",
    }),
    createTextElement({
      id: "title",
      name: "Sarlavha",
      label: tokens.eventName,
      x: margin,
      y: margin + Math.round(h * 0.22),
      width: innerW,
      height: Math.max(44, Math.round(h * 0.12)),
      fontSize: Math.max(20, Math.round(h * 0.06)),
      fontWeight: 700,
      color: TEXT_PRIMARY,
      textAlign: "center",
      fontFamily: "Inter, sans-serif",
    }),
    createTextElement({
      id: "subtitle",
      name: "Subtitr",
      label: tokens.subtitle,
      x: margin + 16,
      y: margin + Math.round(h * 0.38),
      width: innerW - 32,
      height: 32,
      fontSize: Math.max(12, Math.round(h * 0.03)),
      fontWeight: 500,
      color: TEXT_SECONDARY,
      textAlign: "center",
      fontFamily: "Inter, sans-serif",
    }),
    createTextElement({
      id: "name",
      name: "Ism",
      label: tokens.fullName,
      x: margin + 24,
      y: margin + Math.round(h * 0.52),
      width: innerW - 48,
      height: 40,
      fontSize: Math.max(16, Math.round(h * 0.042)),
      fontWeight: 600,
      color: TEXT_PRIMARY,
      textAlign: "center",
      fontFamily: "Inter, sans-serif",
    }),
    createTextElement({
      id: "body",
      name: "Matn",
      label: tokens.position
        ? `${tokens.position} — matn qo‘shing yoki tahrirlang.`
        : "Matn qo‘shing yoki chap paneldan tahrirlang.",
      x: margin + 20,
      y: margin + Math.round(h * 0.64),
      width: innerW - 40,
      height: Math.max(48, Math.round(h * 0.1)),
      fontSize: Math.max(11, Math.round(h * 0.026)),
      fontWeight: 400,
      color: TEXT_SECONDARY,
      textAlign: "center",
      fontFamily: "Inter, sans-serif",
      lineHeight: 1.45,
    }),
    createTextElement({
      id: "meta",
      name: "Meta",
      label: [tokens.organization, tokens.date].filter(Boolean).join(" · ") || "Tashkilot · Sana",
      x: margin,
      y: h - margin - 28,
      width: innerW,
      height: 22,
      fontSize: 10,
      fontWeight: 500,
      color: TEXT_MUTED,
      textAlign: "center",
      fontFamily: "Inter, sans-serif",
    }),
  ]

  return {
    productId,
    title: product?.title ?? productId,
    artboardWidth: w,
    artboardHeight: h,
    artboardLabel: artboard.label,
    elements,
  }
}
