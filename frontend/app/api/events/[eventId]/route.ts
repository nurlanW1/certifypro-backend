import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateDbUser } from '@/lib/auth'
import { mapEvent } from '@/lib/events-api'
import { prisma } from '@/lib/prisma'
import type { BrandingKitId, EventFormData } from '@/types/event'

export async function GET(
  _req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, userId: user.id },
      include: {
        materials: { orderBy: { category: 'asc' } },
        _count: { select: { materials: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ event: mapEvent(event) })
  } catch (error) {
    console.error('Event get error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as Partial<EventFormData> & {
      brandingKit?: BrandingKitId
    }

    const existing = await prisma.event.findFirst({
      where: { id: params.eventId, userId: user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const event = await prisma.event.update({
      where: { id: params.eventId },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.type !== undefined ? { type: body.type } : {}),
        ...(body.date !== undefined
          ? { date: body.date ? new Date(body.date) : null }
          : {}),
        ...(body.location !== undefined ? { location: body.location || null } : {}),
        ...(body.organization !== undefined
          ? { organization: body.organization || null }
          : {}),
        ...(body.language !== undefined ? { language: body.language } : {}),
        ...(body.participantCount !== undefined
          ? { participantCount: body.participantCount ?? null }
          : {}),
        ...(body.primaryColor !== undefined ? { primaryColor: body.primaryColor } : {}),
        ...(body.accentColor !== undefined ? { accentColor: body.accentColor } : {}),
        ...(body.logoUrl !== undefined ? { logoUrl: body.logoUrl ?? null } : {}),
        ...(body.brandingKit !== undefined ? { brandingKit: body.brandingKit } : {}),
      },
      include: {
        materials: { orderBy: { category: 'asc' } },
        _count: { select: { materials: true } },
      },
    })

    return NextResponse.json({ event: mapEvent(event) })
  } catch (error) {
    console.error('Event patch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
