import { MOCK_TEMPLATES, type MockTemplate } from '@/lib/mock-templates'

export type FilterableTemplate = MockTemplate
import type { EventType, MaterialCategory } from '@/types/event'

export type TemplateSortOption = 'new' | 'popular' | 'free'
export type PriceFilterType = 'ALL' | 'FREE' | 'PREMIUM'

export interface TemplateQueryParams {
  category?: string
  search?: string
  premium?: string | null
  eventTypes?: string[]
  materialTypes?: string[]
  sort?: TemplateSortOption
}

export function filterTemplates(
  templates: FilterableTemplate[],
  params: TemplateQueryParams
): FilterableTemplate[] {
  let result = [...templates]

  const category = params.category
  if (category && category !== 'ALL') {
    result = result.filter((t) => t.category === category)
  }

  if (params.materialTypes && params.materialTypes.length > 0) {
    result = result.filter((t) => params.materialTypes!.includes(t.category))
  }

  if (params.eventTypes && params.eventTypes.length > 0) {
    result = result.filter(
      (t) => t.eventType && params.eventTypes!.includes(t.eventType)
    )
  }

  if (params.premium === 'true') {
    result = result.filter((t) => t.isPremium)
  } else if (params.premium === 'false') {
    result = result.filter((t) => !t.isPremium)
  }

  if (params.search) {
    const q = params.search.toLowerCase()
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.nameUz?.toLowerCase().includes(q) ?? false) ||
        t.tags.some((tag) => tag.includes(q)) ||
        t.category.toLowerCase().includes(q)
    )
  }

  if (params.sort === 'popular') {
    result.sort((a, b) => b.popularity - a.popularity)
  } else if (params.sort === 'free') {
    result.sort((a, b) => Number(a.isPremium) - Number(b.isPremium))
  } else {
    result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  return result
}

export function findMockTemplate(id: string): MockTemplate | undefined {
  return MOCK_TEMPLATES.find((t) => t.id === id)
}

export type { MaterialCategory, EventType }
