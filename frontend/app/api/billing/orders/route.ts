import { NextResponse } from 'next/server'
import { getOrCreateDbUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.paymentOrder.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      orders: orders.map((o) => ({
        id: o.id,
        plan: o.plan,
        amount: o.amount,
        currency: o.currency,
        provider: o.provider,
        status: o.status,
        paidAt: o.paidAt?.toISOString() ?? null,
        createdAt: o.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Billing orders list error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
