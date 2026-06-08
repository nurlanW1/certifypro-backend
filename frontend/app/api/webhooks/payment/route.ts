export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { fulfillPaymentOrder } from '@/lib/payments/fulfill-order'
import { prisma } from '@/lib/prisma'


/**
 * Universal webhook (Payme/Click callback proxy yoki dev).
 * Header: x-gildia-webhook-secret = PAYMENT_WEBHOOK_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-gildia-webhook-secret')
  const expected = process.env.PAYMENT_WEBHOOK_SECRET?.trim()
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = (await req.json()) as {
      orderId?: string
      status?: string
      provider?: string
    }

    if (!body.orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    }

    if (body.status === 'paid' || body.status === 'PAID' || body.status === '2') {
      await fulfillPaymentOrder(body.orderId)
      return NextResponse.json({ ok: true })
    }

    if (body.status === 'cancelled') {
      await prisma.paymentOrder.update({
        where: { id: body.orderId },
        data: { status: 'CANCELLED' },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
