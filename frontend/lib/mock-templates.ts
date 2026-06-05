import type { Template } from '@/types/template'
import { STARTER_TEMPLATES } from '@/lib/templates/starterTemplates'

const now = Date.now()

function daysAgo(days: number): string {
  return new Date(now - days * 24 * 60 * 60 * 1000).toISOString()
}

export interface MockTemplate extends Template {
  description: string
  popularity: number
  style: string
  assetType: string
  isPrintable: boolean
  isOnlineReady: boolean
  sizeLabel: string
}

export const MOCK_TEMPLATES: MockTemplate[] = STARTER_TEMPLATES.map((template, index) => ({
  id: template.id,
  name: template.title,
  nameUz: template.title,
  nameRu: template.title,
  category: template.category,
  eventType: template.category === 'CERTIFICATE' ? 'CONFERENCE' : null,
  isPremium: template.isPremium,
  previewUrl: template.thumbnail,
  tags: template.tags,
  description: template.description,
  popularity: template.popularity,
  createdAt: daysAgo(index + 1),
  style: template.style,
  assetType: template.assetType,
  isPrintable: template.isPrintable,
  isOnlineReady: template.isOnlineReady,
  sizeLabel: template.size.label,
}))

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = { ALL: MOCK_TEMPLATES.length }
  for (const template of MOCK_TEMPLATES) {
    counts[template.category] = (counts[template.category] ?? 0) + 1
  }
  return counts
}
