export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { getOrCreateDbUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function GET(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = req.nextUrl.searchParams.get('orderId')?.trim()
    const myOrderIds = await prisma.paymentOrder.findMany({
      where: { userId: user.id },
      select: { id: true },
    })
    const allowed = new Set(myOrderIds.map((o) => o.id))

    const logs = await prisma.paymentWebhookLog.findMany({
      where: orderId
        ? allowed.has(orderId)
          ? { orderId }
          : { orderId: '__none__' }
        : { orderId: { in: [...allowed] } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })

    return NextResponse.json({
      logs: logs.map((l) => ({
        id: l.id,
        provider: l.provider,
        orderId: l.orderId,
        status: l.status,
        error: l.error,
        createdAt: l.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Webhook logs error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
