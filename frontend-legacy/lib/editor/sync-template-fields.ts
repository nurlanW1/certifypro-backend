import type { CanvasElement } from "@/lib/editor/canvas-types"
import { applyTemplateTokens, tokensFromPreview } from "@/lib/templates/design-templates/tokens"
import { toPreviewFormData } from "@/lib/templates/product-draft-storage"

/** Apply catalog form values to canvas text/QR layers (live preview in editor) */
export function syncFormValuesToElements(
  elements: CanvasElement[],
  values: Record<string, string>,
  productTitle: string
): CanvasElement[] {
  const tokens = tokensFromPreview(values)

  return elements.map((el) => {
    if (el.type === "text") {
      const label = resolveTextLabel(el, values, tokens, productTitle)
      if (label === el.label) return el
      return { ...el, label }
    }
    if (el.type === "qr" && values.qrUrl?.trim()) {
      const url = values.qrUrl.trim()
      if (el.qrValue === url) return el
      return { ...el, qrValue: url, label: url }
    }
    return el
  })
}

function resolveTextLabel(
  el: CanvasElement,
  values: Record<string, string>,
  tokens: ReturnType<typeof tokensFromPreview>,
  productTitle: string
): string {
  const id = el.id.toLowerCase()

  if (id === "eyebrow" || id === "product-label") {
    return productTitle
  }
  if (id === "title" || id === "headline") {
    return pick(values.eventName, values.headline, values.brandName, tokens.eventName)
  }
  if (id === "subtitle") {
    return pick(values.subtitle, values.headline, values.slogan, values.ctaText, tokens.subtitle)
  }
  if (id === "name" || id === "full-name") {
    return pick(values.fullName, values.presenter, tokens.fullName)
  }
  if (id === "body" || id === "presented" || id === "matn") {
    return pick(
      values.sessionTitle,
      values.slogan,
      values.ctaText,
      values.position ? `${values.position}` : "",
      values.signatoryTitle,
      "Matn qo‘shing yoki tahrirlang."
    )
  }
  if (id === "meta") {
    const parts = [values.organization, values.date, values.venue, values.certificateId].filter(
      (p) => p?.trim()
    )
    if (parts.length) return parts.join(" · ")
    return [tokens.organization, tokens.date].filter(Boolean).join(" · ") || "Tashkilot · Sana"
  }

  if (el.label.includes("{{")) {
    return applyTemplateTokens(el.label, tokens)
  }

  return el.label
}

function pick(...candidates: (string | undefined)[]): string {
  for (const c of candidates) {
    if (c?.trim()) return c.trim()
  }
  return ""
}

export function previewFormDataFromValues(values: Record<string, string>) {
  return toPreviewFormData(values)
}
