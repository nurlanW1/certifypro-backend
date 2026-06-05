import { PrismaClient } from '@prisma/client'
import { MOCK_TEMPLATES } from '../lib/mock-templates'
import { generateTemplateSvg } from '../lib/templates/generate-template-svg'

const prisma = new PrismaClient()

/** Legacy alias kept for old links */
const LEGACY_ALIASES: { id: string; targetId: string }[] = [
  { id: 'invite-001', targetId: 'inv-001' },
]

async function main() {
  const seeded = new Set<string>()

  for (const t of MOCK_TEMPLATES) {
    const svgContent = generateTemplateSvg({
      id: t.id,
      name: t.nameUz ?? t.name,
      category: t.category,
      tags: t.tags,
      isPremium: t.isPremium,
    })

    if (!svgContent.includes('{{eventName}}')) {
      throw new Error(`Seed SVG invalid: ${t.id}`)
    }

    await prisma.template.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        name: t.name,
        nameUz: t.nameUz,
        nameRu: t.nameRu ?? null,
        category: t.category,
        eventType: t.eventType ?? null,
        isPremium: t.isPremium,
        previewUrl: '',
        svgContent,
        tags: t.tags,
      },
      update: {
        name: t.name,
        nameUz: t.nameUz,
        nameRu: t.nameRu ?? null,
        category: t.category,
        eventType: t.eventType ?? null,
        isPremium: t.isPremium,
        svgContent,
        tags: t.tags,
      },
    })
    seeded.add(t.id)
  }

  for (const alias of LEGACY_ALIASES) {
    const target = MOCK_TEMPLATES.find((t) => t.id === alias.targetId)
    if (!target) continue
    const svgContent = generateTemplateSvg({
      id: target.id,
      name: target.nameUz ?? target.name,
      category: target.category,
      tags: target.tags,
      isPremium: target.isPremium,
    })
    await prisma.template.upsert({
      where: { id: alias.id },
      create: {
        id: alias.id,
        name: target.name,
        nameUz: target.nameUz,
        category: target.category,
        isPremium: target.isPremium,
        previewUrl: '',
        svgContent,
        tags: target.tags,
      },
      update: { svgContent, name: target.name, nameUz: target.nameUz },
    })
    seeded.add(alias.id)
  }

  console.log(`Seeded ${seeded.size} templates with category-specific SVG layouts`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
