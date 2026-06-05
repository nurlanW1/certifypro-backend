import { STARTER_TEMPLATES, findStarterTemplate } from './starterTemplates'
import { renderStarterTemplateSvg } from './templateRenderer'
import type { StarterTemplate, TemplateCategory, TemplateElement, TemplateStyle } from './types'

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'certificate',
  'invitation',
  'badge',
  'flyer',
  'agenda',
  'event-program',
  'speaker-card',
  'sponsor-banner',
  'rollup-banner',
  'press-wall',
  'social-post',
  'qr-card',
  'ticket',
  'table-card',
  'id-card',
  'thank-you-certificate',
]

export const TEMPLATE_STYLES: TemplateStyle[] = ['minimalistic', 'classic', 'hitech-science']

export interface TemplateFilters {
  search?: string
  category?: TemplateCategory | 'all'
  style?: TemplateStyle | 'all'
  price?: 'all' | 'free' | 'premium'
}

export function getStarterTemplateOrThrow(templateId: string): StarterTemplate {
  const template = findStarterTemplate(templateId)
  if (!template) {
    throw new Error(`Template not found: ${templateId}`)
  }
  return template
}

export function filterStarterTemplates(filters: TemplateFilters): StarterTemplate[] {
  const search = filters.search?.trim().toLowerCase()
  return STARTER_TEMPLATES.filter((template) => {
    if (filters.category && filters.category !== 'all' && template.category !== filters.category) return false
    if (filters.style && filters.style !== 'all' && template.style !== filters.style) return false
    if (filters.price === 'free' && template.isPremium) return false
    if (filters.price === 'premium' && !template.isPremium) return false
    if (!search) return true

    return [
      template.title,
      template.description,
      template.category,
      template.style,
      ...template.tags,
    ]
      .join(' ')
      .toLowerCase()
      .includes(search)
  })
}

export function cloneTemplateElements(template: StarterTemplate): TemplateElement[] {
  return template.elements.map((element) => ({ ...element }))
}

export function starterTemplateToSvg(template: StarterTemplate): string {
  return renderStarterTemplateSvg(template)
}

export function elementLabel(element: TemplateElement): string {
  if (element.type === 'text') return element.text.replace(/[{}]/g, '').slice(0, 32) || 'Text'
  if ('label' in element && element.label) return element.label
  return element.id
}
