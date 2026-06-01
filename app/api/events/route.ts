import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateDbUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { EventFormData, Event, EventType, MaterialCategory } from '@/types/event'

function mapEvent(record: {
  id: string
  userId: string
  name: string
  type: EventType
  date: Date | null
  location: string | null
  organization: string | null
  language: string
  logoUrl: string | null
  primaryColor: string
  accentColor: string
  createdAt: Date
  updatedAt: Date
}): Event {
  return {
    id: record.id,
    userId: record.userId,
    name: record.name,
    type: record.type,
    date: record.date?.toISOString() ?? '',
    location: record.location ?? '',
    organization: record.organization ?? '',
    language: record.language as Event['language'],
    logoUrl: record.logoUrl ?? undefined,
    primaryColor: record.primaryColor,
    accentColor: record.accentColor,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ events: events.map(mapEvent) })
  } catch (error) {
    console.error('Events list error:', error)
    return NextResponse.json({ events: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      formData?: EventFormData
      selectedMaterials?: MaterialCategory[]
      email?: string
    } & Partial<EventFormData>

    const formData: EventFormData =
      body.formData ??
      ({
        name: body.name ?? '',
        type: body.type ?? 'CONFERENCE',
        date: body.date ?? '',
        location: body.location ?? '',
        organization: body.organization ?? '',
        language: body.language ?? 'uz',
        primaryColor: body.primaryColor ?? '#534AB7',
        accentColor: body.accentColor ?? '#26215C',
        logoUrl: body.logoUrl,
        participantCount: body.participantCount,
      } as EventFormData)

    const selectedMaterials = body.selectedMaterials ?? []

    const event = await prisma.event.create({
      data: {
        userId: user.id,
        name: formData.name,
        type: formData.type,
        date: formData.date ? new Date(formData.date) : null,
        location: formData.location || null,
        organization: formData.organization || null,
        language: formData.language || 'uz',
        primaryColor: formData.primaryColor || '#534AB7',
        accentColor: formData.accentColor || '#26215C',
        logoUrl: formData.logoUrl ?? null,
      },
    })

    return NextResponse.json(
      { event: mapEvent(event), selectedMaterials },
      { status: 201 }
    )
  } catch (error) {
    console.error('Event create error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
