import { nanoid } from 'nanoid'
import { Prisma } from '@prisma/client'
import { getKitTokens } from '@/lib/branding/kits'
import { findMockTemplate } from '@/lib/filter-templates'
import { prisma } from '@/lib/prisma'
import type { BrandingKitId, MaterialCategory } from '@/types/event'

const DEFAULT_CANVAS = {
  version: '5.3.0',
  width: 794,
  height: 1123,
  objects: [] as object[],
  background: '#ffffff',
}

export type TemplateMeta = {
  id: string
  name: string
  nameUz: string | null
  category: MaterialCategory
  isPremium: boolean
}

export async function resolveTemplateMeta(
  templateId: string
): Promise<TemplateMeta | null> {
  try {
    const row = await prisma.template.findUnique({ where: { id: templateId } })
    if (row) {
      return {
        id: row.id,
        name: row.name,
        nameUz: row.nameUz,
        category: row.category as MaterialCategory,
        isPremium: row.isPremium,
      }
    }
  } catch {
    // fall through to mock catalog in dev
  }
  const mock = findMockTemplate(templateId)
  if (!mock) return null
  return {
    id: mock.id,
    name: mock.name,
    nameUz: mock.nameUz ?? null,
    category: mock.category as MaterialCategory,
    isPremium: mock.isPremium,
  }
}

export function buildInitialCanvas(event: {
  primaryColor: string
  accentColor: string
  name: string
  organization: string | null
  brandingKit?: BrandingKitId | null
}) {
  const kit = getKitTokens(event.brandingKit)
  const objects: object[] = [
    {
      type: 'i-text',
      text: '{{eventName}}',
      left: 80,
      top: 140,
      fontSize: kit.titleSize,
      fill: '#ffffff',
      fontFamily: kit.titleFont,
    },
    {
      type: 'i-text',
      text: '{{participantName}}',
      left: 80,
      top: 280,
      fontSize: kit.titleSize + 4,
      fill: '#ffffff',
      fontFamily: kit.titleFont,
    },
    {
      type: 'i-text',
      text: '{{organization}}',
      left: 80,
      top: 220,
      fontSize: kit.bodySize,
      fill: '#f0f0f0',
      fontFamily: kit.bodyFont,
    },
    {
      type: 'i-text',
      text: '{{date}}',
      left: 80,
      top: 360,
      fontSize: kit.bodySize,
      fill: '#e8e8e8',
      fontFamily: kit.bodyFont,
    },
  ]

  if (kit.accentBar) {
    objects.unshift({
      type: 'rect',
      left: 0,
      top: 0,
      width: 794,
      height: 24,
      fill: event.accentColor,
      selectable: false,
    })
  }

  return {
    ...DEFAULT_CANVAS,
    background: event.primaryColor,
    objects,
  }
}

export async function startEventMaterialDesign(params: {
  userId: string
  eventId: string
  category: MaterialCategory
  templateId: string
}) {
  const { userId, eventId, category, templateId } = params

  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
    include: { materials: true },
  })
  if (!event) return { error: 'not_found' as const }

  const material = event.materials.find((m) => m.category === category)
  if (!material) return { error: 'material_not_in_event' as const }

  const meta = await resolveTemplateMeta(templateId)
  if (meta && meta.category !== category) {
    return { error: 'category_mismatch' as const }
  }

  const designId = material.designId ?? nanoid()
  const canvasData = buildInitialCanvas({
    primaryColor: event.primaryColor,
    accentColor: event.accentColor,
    name: event.name,
    organization: event.organization,
    brandingKit: event.brandingKit,
  })

  const designName = meta?.nameUz ?? meta?.name ?? MATERIAL_FALLBACK_NAME[category]

  const design = material.designId
    ? await prisma.design.update({
        where: { id: designId },
        data: {
          templateId,
          name: designName,
          canvasData: canvasData as Prisma.InputJsonValue,
        },
      })
    : await prisma.design.create({
        data: {
          id: designId,
          userId,
          eventId,
          templateId,
          name: designName,
          canvasData: canvasData as Prisma.InputJsonValue,
        },
      })

  const updatedMaterial = await prisma.eventMaterial.update({
    where: { id: material.id },
    data: {
      designId: design.id,
      status: 'IN_PROGRESS',
    },
  })

  return { design, material: updatedMaterial }
}

const MATERIAL_FALLBACK_NAME: Record<MaterialCategory, string> = {
  CERTIFICATE: 'Sertifikat',
  BADGE: 'Nishon',
  INVITATION: 'Taklifnoma',
  FLYER: 'Flayer',
  POSTER: 'Poster',
  SCIENTIFIC_POSTER: 'Ilmiy poster',
  PROGRAM_BOOK: 'Dastur',
  ROLL_UP: 'Roll-up',
  PRESS_WALL: 'Press wall',
  STAGE_BACKDROP: 'Sahna fon',
  LED_SCREEN: 'LED',
  TABLE_TENT: 'Stol kartasi',
  NAVIGATION: 'Navigatsiya',
  SOCIAL_MEDIA: 'Ijtimoiy tarmoq',
  EMAIL_BANNER: 'Email',
  SOUVENIR: 'Suvenir',
  NAME_TAG: 'Ism tag',
  SPONSOR_BANNER: 'Sponsor',
}

export async function syncMaterialStatusFromCanvas(
  designId: string,
  userId: string,
  canvasData: unknown
) {
  const design = await prisma.design.findFirst({
    where: { id: designId, userId },
  })
  if (!design?.eventId) return

  const objects = (canvasData as { objects?: unknown[] })?.objects ?? []
  const hasContent = objects.length > 0

  await prisma.eventMaterial.updateMany({
    where: { eventId: design.eventId, designId },
    data: { status: hasContent ? 'READY' : 'IN_PROGRESS' },
  })
}
