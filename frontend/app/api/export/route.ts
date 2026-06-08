export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { getOrCreateDbUser } from '@/lib/auth'
import { getBillingMe, billingError } from '@/lib/billing/service'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const billing = await getBillingMe(user.id, user.plan)
    if (!billing.canExport) {
      const err = billingError(
        'PLAN_LIMIT_EXPORTS',
        'Oylik eksport limiti tugadi. Pro rejimga o‘ting.',
        402
      )
      return NextResponse.json(err.body, { status: err.status })
    }

    const body = (await request.json()) as {
      designId?: string
      eventId?: string
      format?: 'pdf' | 'png'
    }
    const designId = body.designId ?? null
    const format = body.format ?? 'png'

    if (designId) {
      const owned = await prisma.design.findFirst({
        where: { id: designId, userId: user.id },
      })
      if (!owned) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
    }

    await prisma.exportLog.create({
      data: {
        userId: user.id,
        designId,
        eventId: body.eventId ?? null,
        format,
      },
    })

    return NextResponse.json({
      ok: true,
      format,
      designId,
      watermark: billing.requiresWatermark,
      highQuality: billing.limits.highQualityExport,
    })
  } catch (error) {
    console.error('Export log error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
