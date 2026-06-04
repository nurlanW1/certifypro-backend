import { NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/platform-admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const admin = await requirePlatformAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const logs = await prisma.paymentWebhookLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
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
    console.error('Admin payment logs error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
