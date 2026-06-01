import type { ProductFormData } from "@/lib/templates/types"
import { DEFAULT_PRODUCT_FORM } from "@/lib/templates/types"
import type { TemplateTokens } from "./types"

const TOKEN_RE = /\{\{(\w+)\}\}/g

const TOKEN_ALIASES: Record<string, keyof TemplateTokens> = {
  event_name: "eventName",
  full_name: "fullName",
  organization: "organization",
  position: "position",
  date: "date",
  subtitle: "subtitle",
  eventName: "eventName",
  fullName: "fullName",
}

export function tokensFromPreview(data: Partial<ProductFormData>): TemplateTokens {
  return {
    eventName: data.eventName ?? DEFAULT_PRODUCT_FORM.eventName,
    fullName: data.fullName ?? DEFAULT_PRODUCT_FORM.fullName,
    organization: data.organization ?? DEFAULT_PRODUCT_FORM.organization,
    position: data.position ?? DEFAULT_PRODUCT_FORM.position,
    date: data.date ?? DEFAULT_PRODUCT_FORM.date,
    subtitle: data.subtitle ?? DEFAULT_PRODUCT_FORM.subtitle,
  }
}

export function applyTemplateTokens(text: string, tokens: TemplateTokens): string {
  return text.replace(TOKEN_RE, (_, key: string) => {
    const field = TOKEN_ALIASES[key]
    if (!field) return `{{${key}}}`
    return tokens[field] ?? `{{${key}}}`
  })
}
