import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateDbUser } from '@/lib/auth'
import { getBillingMe, billingError } from '@/lib/billing/service'
import { prisma } from '@/lib/prisma'
import { MATERIAL_LABELS } from '@/types/event'
import type { MaterialCategory } from '@/types/event'

export async function GET(
  _req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const billing = await getBillingMe(user.id, user.plan)
    if (!billing.canUseFullPackageExport) {
      const err = billingError(
        'PLAN_PACKAGE_EXPORT',
        'To‘liq paket eksporti Pro rejimda.',
        402
      )
      return NextResponse.json(err.body, { status: err.status })
    }

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, userId: user.id },
      include: {
        materials: { where: { designId: { not: null }, status: 'READY' } },
      },
    })
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const designIds = event.materials
      .map((m) => m.designId)
      .filter((id): id is string => Boolean(id))

    const designs = await prisma.design.findMany({
      where: { id: { in: designIds }, userId: user.id },
      select: {
        id: true,
        name: true,
        canvasData: true,
        templateId: true,
      },
    })

    const byDesign = new Map(designs.map((d) => [d.id, d]))

    const packageItems = event.materials
      .filter((m) => m.designId && byDesign.has(m.designId))
      .map((m) => {
        const d = byDesign.get(m.designId!)!
        return {
          materialCategory: m.category as MaterialCategory,
          materialLabel: MATERIAL_LABELS[m.category as MaterialCategory],
          designId: d.id,
          designName: d.name,
          canvasData: d.canvasData,
        }
      })

    await prisma.exportLog.create({
      data: {
        userId: user.id,
        eventId: params.eventId,
        format: 'package',
      },
    })

    return NextResponse.json({
      eventName: event.name,
      items: packageItems,
      watermark: billing.requiresWatermark,
    })
  } catch (error) {
    console.error('Package export error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
