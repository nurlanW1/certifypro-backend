export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { logActivity } from '@/lib/activity/log'
import { getOrCreateDbUser } from '@/lib/auth'
import { getBillingMe, billingError } from '@/lib/billing/service'
import { allowDevMocks } from '@/lib/env'
import { mapEvent } from '@/lib/events-api'
import { prisma } from '@/lib/prisma'
import type { BrandingKitId, EventFormData, MaterialCategory } from '@/types/event'


export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { materials: true } },
      },
    })

    return NextResponse.json({ events: events.map(mapEvent) })
  } catch (error) {
    console.error('Events list error:', error)
    if (allowDevMocks()) {
      return NextResponse.json({ events: [] })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
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
      brandingKit?: BrandingKitId
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
        primaryColor: body.primaryColor ?? '#2563EB',
        accentColor: body.accentColor ?? '#1E40AF',
        logoUrl: body.logoUrl,
        participantCount: body.participantCount,
      } as EventFormData)

    const selectedMaterials = body.selectedMaterials ?? []
    const brandingKit = body.brandingKit ?? body.formData?.brandingKit
    if (selectedMaterials.length === 0) {
      return NextResponse.json({ error: 'Kamida bitta material tanlang' }, { status: 400 })
    }

    const billing = await getBillingMe(user.id, user.plan)
    if (!billing.canCreateEvent) {
      const err = billingError(
        'PLAN_LIMIT_EVENTS',
        'Tadbirlar limiti tugadi. Pro rejimga o‘ting.',
        402
      )
      return NextResponse.json(err.body, { status: err.status })
    }
    if (selectedMaterials.length > billing.limits.maxMaterialsPerEvent) {
      const err = billingError(
        'PLAN_LIMIT_MATERIALS',
        `Bepul rejimda tadbir uchun maksimum ${billing.limits.maxMaterialsPerEvent} ta material.`,
        402
      )
      return NextResponse.json(err.body, { status: err.status })
    }

    const orgMember = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
    })

    const event = await prisma.event.create({
      data: {
        userId: user.id,
        organizationId: orgMember?.organizationId ?? null,
        name: formData.name,
        type: formData.type,
        date: formData.date ? new Date(formData.date) : null,
        location: formData.location || null,
        organization: formData.organization || null,
        language: formData.language || 'uz',
        participantCount: formData.participantCount ?? null,
        primaryColor: formData.primaryColor || '#2563EB',
        accentColor: formData.accentColor || '#1E40AF',
        logoUrl: formData.logoUrl ?? null,
        brandingKit: brandingKit ?? null,
        materials: {
          create: selectedMaterials.map((category) => ({ category })),
        },
      },
      include: { materials: true },
    })

    await logActivity({
      userId: user.id,
      action: 'event.created',
      entityType: 'event',
      entityId: event.id,
      meta: { materials: selectedMaterials.length, brandingKit },
    })

    return NextResponse.json({ event: mapEvent(event) }, { status: 201 })
  } catch (error) {
    console.error('Event create error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
