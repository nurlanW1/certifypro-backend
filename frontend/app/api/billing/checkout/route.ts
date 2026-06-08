export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import type { Plan } from '@prisma/client'
import { logActivity } from '@/lib/activity/log'
import { getOrCreateDbUser } from '@/lib/auth'
import { PLAN_PRICES_UZS } from '@/lib/billing/plans'
import { allowDevMocks } from '@/lib/env'
import { createPaymentSession } from '@/lib/payments/providers'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'


export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rl = await checkRateLimit(`user:${user.id}:checkout`, 15, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(rateLimitResponse(rl.resetAt), { status: 429 })
    }

    const body = (await req.json()) as { plan?: Plan; provider?: 'PAYME' | 'CLICK' | 'MOCK' }

    const plan = body.plan ?? 'PRO'
    if (plan === 'FREE') {
      return NextResponse.json({ error: 'Noto‘g‘ri reja' }, { status: 400 })
    }

    const amount = PLAN_PRICES_UZS[plan]
    if (amount == null) {
      return NextResponse.json({ error: 'Agentlik uchun bog‘laning' }, { status: 400 })
    }

    let provider = body.provider ?? 'MOCK'
    if (provider === 'PAYME' || provider === 'CLICK') {
      // keep requested
    } else if (!allowDevMocks()) {
      return NextResponse.json(
        { error: 'Sinov to‘lovi production da o‘chirilgan. Payme yoki Click tanlang.' },
        { status: 400 }
      )
    } else {
      provider = 'MOCK'
    }

    const order = await prisma.paymentOrder.create({
      data: {
        userId: user.id,
        plan,
        amount,
        provider,
        status: 'PENDING',
      },
    })

    const session = createPaymentSession({
      orderId: order.id,
      plan,
      provider,
    })

    if (!allowDevMocks() && !session.paymentUrl) {
      await prisma.paymentOrder.update({
        where: { id: order.id },
        data: { status: 'CANCELLED', meta: { error: session.instructions } },
      })
      return NextResponse.json({ error: session.instructions }, { status: 503 })
    }

    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: {
        provider: session.provider,
        providerRef: session.providerRef,
        meta: { paymentUrl: session.paymentUrl },
      },
    })

    await logActivity({
      userId: user.id,
      action: 'checkout.started',
      entityType: 'order',
      entityId: order.id,
      meta: { plan, provider: session.provider },
    })

    return NextResponse.json({
      orderId: order.id,
      plan,
      amount,
      currency: 'UZS',
      provider: session.provider,
      paymentUrl: session.paymentUrl,
      instructions: session.instructions,
      status: 'PENDING',
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
