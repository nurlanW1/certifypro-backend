export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { getOrCreateDbUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function GET(
  _req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.paymentOrder.findFirst({
      where: { id: params.orderId, userId: user.id },
    })
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        id: order.id,
        plan: order.plan,
        amount: order.amount,
        currency: order.currency,
        provider: order.provider,
        status: order.status,
        paidAt: order.paidAt?.toISOString() ?? null,
        createdAt: order.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Order get error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
