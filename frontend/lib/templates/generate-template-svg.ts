import type { MaterialCategory } from '@/types/event'
import { findStarterTemplate, STARTER_TEMPLATES } from '@/lib/templates/starterTemplates'
import { renderStarterTemplateSvg } from '@/lib/templates/templateRenderer'

export interface TemplateSvgInput {
  id: string
  name: string
  category: MaterialCategory | string
  tags?: string[]
  isPremium?: boolean
}

export function generateTemplateSvg(input: TemplateSvgInput): string {
  const starter =
    findStarterTemplate(input.id) ??
    STARTER_TEMPLATES.find((template) => template.category === input.category)

  if (starter) {
    return renderStarterTemplateSvg(starter)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123" viewBox="0 0 794 1123">
    <rect width="794" height="1123" fill="#ffffff"/>
    <rect x="48" y="48" width="698" height="1027" fill="none" stroke="#2563eb" stroke-width="3" stroke-dasharray="12 10"/>
    <text x="397" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#0f172a" font-weight="700">${input.name}</text>
    <text x="397" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#0f172a">{{event_name}}</text>
    <text x="397" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#64748b">{{organization}}</text>
    <text x="397" y="490" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#64748b">{{date}} · {{location}}</text>
  </svg>`
}

/** @deprecated Use generateTemplateSvg */
export function buildBrandedTemplateSvg(options: {
  title: string
  category: string
  primary?: string
  accent?: string
}): string {
  return generateTemplateSvg({
    id: 'legacy',
    name: options.title,
    category: options.category,
  })
}
