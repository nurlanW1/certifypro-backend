export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { logActivity } from '@/lib/activity/log'
import { runBulkMaterialExport } from '@/lib/bulk/run-bulk-export'
import { getOrCreateDbUser } from '@/lib/auth'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'


/** @deprecated — `/bulk-materials` category=BADGE ishlating */
export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rl = await checkRateLimit(`user:${user.id}:bulk-badges`, 10, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(rateLimitResponse(rl.resetAt), { status: 429 })
    }

    const body = (await req.json()) as { masterDesignId?: string }
    if (!body.masterDesignId) {
      return NextResponse.json({ error: 'masterDesignId required' }, { status: 400 })
    }

    const result = await runBulkMaterialExport({
      userId: user.id,
      userPlan: user.plan,
      eventId: params.eventId,
      masterDesignId: body.masterDesignId,
      category: 'BADGE',
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: result.status }
      )
    }

    await logActivity({
      userId: user.id,
      action: 'bulk.badges',
      entityType: 'event',
      entityId: params.eventId,
      meta: { count: result.data.items.length, masterDesignId: body.masterDesignId },
    })

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Bulk badges error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
