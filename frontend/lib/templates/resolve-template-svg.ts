import type { EventVariableContext } from '@/lib/editor/variables'
import { findMockTemplate } from '@/lib/filter-templates'
import { prisma } from '@/lib/prisma'
import { generateTemplateSvg } from '@/lib/templates/generate-template-svg'
import { applyTemplateVariables } from '@/lib/templates/template-variables'

export async function resolveTemplateSvgContent(
  templateId: string,
  variables?: EventVariableContext | null
): Promise<string | null> {
  try {
    const row = await prisma.template.findUnique({
      where: { id: templateId },
      select: { svgContent: true },
    })
    if (row?.svgContent?.trim()) {
      return applyTemplateVariables(row.svgContent, variables)
    }
  } catch {
    // DB unavailable — fall through to mock generator
  }

  const mock = findMockTemplate(templateId)
  if (!mock) return null

  const raw = generateTemplateSvg({
    id: mock.id,
    name: mock.nameUz ?? mock.name,
    category: mock.category,
    tags: mock.tags,
    isPremium: mock.isPremium,
  })
  return applyTemplateVariables(raw, variables)
}

/** Upsert a mock-catalog template into DB when missing (dev / partial seed). */
export async function ensureTemplateInDatabase(templateId: string) {
  const mock = findMockTemplate(templateId)
  if (!mock) return null

  const svgContent = generateTemplateSvg({
    id: mock.id,
    name: mock.nameUz ?? mock.name,
    category: mock.category,
    tags: mock.tags,
    isPremium: mock.isPremium,
  })

  try {
    return await prisma.template.upsert({
      where: { id: templateId },
      create: {
        id: mock.id,
        name: mock.name,
        nameUz: mock.nameUz,
        nameRu: mock.nameRu ?? null,
        category: mock.category,
        eventType: mock.eventType ?? null,
        isPremium: mock.isPremium,
        previewUrl: '',
        svgContent,
        tags: mock.tags,
      },
      update: {
        name: mock.name,
        nameUz: mock.nameUz,
        svgContent,
        tags: mock.tags,
        isPremium: mock.isPremium,
      },
    })
  } catch {
    return null
  }
}
