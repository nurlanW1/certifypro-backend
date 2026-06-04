import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getOrCreateDbUser } from '@/lib/auth'
import { syncMaterialStatusFromCanvas } from '@/lib/event-design'
import { prisma } from '@/lib/prisma'
import type { Design } from '@/types/design'

function mapDesign(record: {
  id: string
  userId: string
  eventId: string | null
  templateId: string
  name: string
  canvasData: unknown
  exportedUrl: string | null
  createdAt: Date
  updatedAt: Date
}): Design {
  return {
    id: record.id,
    userId: record.userId,
    eventId: record.eventId,
    templateId: record.templateId,
    name: record.name,
    canvasData: record.canvasData as Design['canvasData'],
    exportedUrl: record.exportedUrl,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { designId: string } }
) {
  const { designId } = params
  const includeTemplate = req.nextUrl.searchParams.get('includeTemplate') === '1'

  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (includeTemplate) {
      const design = await prisma.design.findFirst({
        where: { id: designId, userId: user.id },
        include: { template: { select: { svgContent: true, name: true } } },
      })
      if (!design) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json({
        design: mapDesign(design),
        template: {
          svgContent: design.template.svgContent,
          name: design.template.name,
        },
      })
    }

    const design = await prisma.design.findFirst({
      where: { id: designId, userId: user.id },
    })

    if (!design) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ design: mapDesign(design) })
  } catch (error) {
    console.error('Design get error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { designId: string } }
) {
  const { designId } = params

  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      canvasData?: unknown
      name?: string
      templateId?: string
      eventId?: string
    }

    const canvasJson = body.canvasData
      ? (JSON.parse(JSON.stringify(body.canvasData)) as Prisma.InputJsonValue)
      : undefined

    const existing = await prisma.design.findFirst({
      where: { id: designId, userId: user.id },
    })

    const design = existing
      ? await prisma.design.update({
          where: { id: designId },
          data: {
            ...(body.name ? { name: body.name } : {}),
            ...(canvasJson !== undefined ? { canvasData: canvasJson } : {}),
            ...(body.eventId !== undefined ? { eventId: body.eventId } : {}),
          },
        })
      : await prisma.design.create({
          data: {
            id: designId,
            userId: user.id,
            templateId: body.templateId ?? 'cert-001',
            eventId: body.eventId ?? null,
            name: body.name ?? 'Nomsiz dizayn',
            canvasData: canvasJson ?? { version: '5.3.0', objects: [] },
          },
        })

    if (canvasJson !== undefined) {
      await syncMaterialStatusFromCanvas(designId, user.id, body.canvasData)
    }

    return NextResponse.json({ design: mapDesign(design) })
  } catch (error) {
    console.error('Design patch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
