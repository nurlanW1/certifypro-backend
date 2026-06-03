import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getOrCreateDbUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Design, DesignCanvasData } from '@/types/design'

function toJsonValue(data: DesignCanvasData): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue
}

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
    canvasData: record.canvasData as DesignCanvasData,
    exportedUrl: record.exportedUrl,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')

  if (!id) {
    try {
      const user = await getOrCreateDbUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const designs = await prisma.design.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        take: 8,
      })

      if (designs.length > 0) {
        return NextResponse.json({
          designs: designs.map((d) => ({
            id: d.id,
            name: d.name,
            eventName: 'Tadbir',
            templateId: d.templateId,
            updatedAt: d.updatedAt.toISOString(),
          })),
        })
      }
    } catch {
      // fall through
    }

    const { MOCK_RECENT_DESIGNS } = await import('@/lib/mock-designs')
    return NextResponse.json({ designs: MOCK_RECENT_DESIGNS })
  }

  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const design = await prisma.design.findFirst({
      where: { id, userId: user.id },
    })

    if (!design) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ design: mapDesign(design) })
  } catch {
    return NextResponse.json({
      design: {
        id,
        userId: 'local',
        templateId: 'tpl-cert-1',
        name: 'Nomsiz dizayn',
        canvasData: {
          version: '1.0',
          width: 800,
          height: 600,
          objects: [],
          background: '#FFFFFF',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } satisfies Design,
    })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as {
      id: string
      name: string
      canvasData: DesignCanvasData
      templateId?: string
      eventId?: string
    }

    const design = await prisma.design.upsert({
      where: { id: body.id },
      create: {
        id: body.id,
        userId: user.id,
        templateId: body.templateId ?? 'tpl-cert-1',
        eventId: body.eventId ?? null,
        name: body.name,
        canvasData: toJsonValue(body.canvasData),
      },
      update: {
        name: body.name,
        canvasData: toJsonValue(body.canvasData),
      },
    })

    return NextResponse.json({ design: mapDesign(design) })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
