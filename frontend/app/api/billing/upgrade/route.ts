export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import type { Plan } from '@prisma/client'
import { logActivity } from '@/lib/activity/log'
import { getOrCreateDbUser } from '@/lib/auth'
import { getBillingMe } from '@/lib/billing/service'
import { allowDevMocks } from '@/lib/env'
import { prisma } from '@/lib/prisma'


const ALLOWED: Plan[] = ['PRO', 'ENTERPRISE']

/** Mock checkout — faqat mahalliy dev. Production da Payme/Click orqali to‘lov. */
export async function POST(req: NextRequest) {
  if (!allowDevMocks()) {
    return NextResponse.json(
      { error: 'Bu rejim faqat sinov muhitida. Payme yoki Click orqali to‘lov qiling.' },
      { status: 403 }
    )
  }

  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as { plan?: Plan }
    const target = body.plan ?? 'PRO'
    if (!ALLOWED.includes(target)) {
      return NextResponse.json({ error: 'Noto‘g‘ri reja' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { plan: target },
    })

    await logActivity({
      userId: user.id,
      action: 'plan.upgraded',
      entityType: 'user',
      entityId: user.id,
      meta: { plan: target },
    })

    const billing = await getBillingMe(updated.id, updated.plan)
    return NextResponse.json({
      ok: true,
      message: 'Reja yangilandi (sinov rejimi — haqiqiy to‘lov ulanmagan)',
      billing,
    })
  } catch (error) {
    console.error('Upgrade error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
