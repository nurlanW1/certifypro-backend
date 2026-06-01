import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getOrCreateDbUser } from '@/lib/auth'
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
  _req: NextRequest,
  { params }: { params: { designId: string } }
) {
  const { designId } = params

  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const design = await prisma.design.findFirst({
      where: { id: designId, userId: user.id },
    })

    if (!design) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ design: mapDesign(design) })
  } catch {
    return NextResponse.json({
      design: {
        id: designId,
        userId: 'local',
        templateId: 'cert-001',
        name: 'Nomsiz dizayn',
        canvasData: {
          version: '5.3.0',
          width: 794,
          height: 1123,
          objects: [],
          background: '#ffffff',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } satisfies Design,
    })
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
    }

    const canvasJson = body.canvasData
      ? (JSON.parse(JSON.stringify(body.canvasData)) as Prisma.InputJsonValue)
      : undefined

    const design = await prisma.design.upsert({
      where: { id: designId },
      create: {
        id: designId,
        userId: user.id,
        templateId: 'cert-001',
        name: body.name ?? 'Nomsiz dizayn',
        canvasData: canvasJson ?? { version: '5.3.0', objects: [] },
      },
      update: {
        ...(body.name ? { name: body.name } : {}),
        ...(canvasJson !== undefined ? { canvasData: canvasJson } : {}),
      },
    })

    return NextResponse.json({ design: mapDesign(design) })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
