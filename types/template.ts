import type { EventType, MaterialCategory } from '@/types/event'

export interface Template {
  id: string
  name: string
  nameUz?: string | null
  nameRu?: string | null
  category: MaterialCategory
  eventType?: EventType | null
  isPremium: boolean
  previewUrl: string
  svgContent: string
  tags: string[]
  createdAt: string
}

export interface TemplateFilter {
  category?: MaterialCategory
  eventType?: EventType
  search?: string
  premiumOnly?: boolean
}
