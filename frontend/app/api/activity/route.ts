export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { getOrCreateDbUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const logs = await prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      activities: logs.map((l) => ({
        id: l.id,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        meta: l.meta,
        createdAt: l.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Activity list error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
