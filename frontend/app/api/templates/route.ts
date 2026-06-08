export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { allowDevMocks } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { MOCK_TEMPLATES } from '@/lib/mock-templates'
import { filterTemplates, findMockTemplate } from '@/lib/filter-templates'
import type { Template } from '@/types/template'
import type { MaterialCategory, EventType } from '@/types/event'
import type { TemplateSortOption } from '@/lib/filter-templates'
import { resolveTemplatePreviewUrl } from '@/lib/templates/preview-url'


function mapTemplate(record: {
  id: string
  name: string
  nameUz: string | null
  nameRu: string | null
  category: MaterialCategory
  eventType: EventType | null
  isPremium: boolean
  previewUrl: string
  tags: string[]
  createdAt: Date
}): Template {
  return {
    id: record.id,
    name: record.name,
    nameUz: record.nameUz,
    nameRu: record.nameRu,
    category: record.category,
    eventType: record.eventType,
    isPremium: record.isPremium,
    previewUrl: resolveTemplatePreviewUrl(record.id, record.previewUrl),
    tags: record.tags,
    createdAt: record.createdAt.toISOString(),
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const id = searchParams.get('id')

  if (id) {
    try {
      const template = await prisma.template.findUnique({ where: { id } })
      if (template) {
        return NextResponse.json({ template: mapTemplate(template) })
      }
    } catch (error) {
      console.error('Template get error:', error)
      if (allowDevMocks()) {
        const mock = findMockTemplate(id)
        if (mock) return NextResponse.json({ template: mock })
      }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const category = searchParams.get('category') ?? undefined
  const search = searchParams.get('search') ?? undefined
  const premium = searchParams.get('premium')
  const materialTypes = searchParams.get('materialTypes')?.split(',').filter(Boolean)
  const eventTypes = searchParams.get('eventTypes')?.split(',').filter(Boolean)
  const sort = (searchParams.get('sort') as TemplateSortOption) ?? 'new'

  try {
    const dbTemplates = await prisma.template.findMany({
      orderBy: { createdAt: 'desc' },
    })

    if (dbTemplates.length > 0) {
      const mapped = dbTemplates.map(mapTemplate)
      const filtered = filterTemplates(
        mapped.map((t) => ({
          ...t,
          description: '',
          popularity: 50,
        })),
        { category, search, premium, materialTypes, eventTypes, sort }
      )
      return NextResponse.json({ templates: filtered, total: filtered.length })
    }
  } catch (error) {
    console.error('Templates list error:', error)
    if (!allowDevMocks()) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
  }

  if (!allowDevMocks()) {
    return NextResponse.json({ templates: [], total: 0 })
  }

  const templates = filterTemplates(MOCK_TEMPLATES, {
    category,
    search,
    premium,
    materialTypes,
    eventTypes,
    sort,
  })

  return NextResponse.json({ templates, total: templates.length })
}
