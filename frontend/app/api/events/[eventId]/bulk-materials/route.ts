import { NextRequest, NextResponse } from 'next/server'
import { logActivity } from '@/lib/activity/log'
import { isBulkMaterialCategory } from '@/lib/bulk/material-config'
import { runBulkMaterialExport } from '@/lib/bulk/run-bulk-export'
import { getOrCreateDbUser } from '@/lib/auth'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { BULK_MATERIAL_CONFIG } from '@/lib/bulk/material-config'

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as { masterDesignId?: string; category?: string }
    if (!body.masterDesignId || !body.category || !isBulkMaterialCategory(body.category)) {
      return NextResponse.json(
        { error: 'masterDesignId va category (CERTIFICATE|BADGE|NAME_TAG) kerak' },
        { status: 400 }
      )
    }

    const config = BULK_MATERIAL_CONFIG[body.category]
    const rl = await checkRateLimit(
      `user:${user.id}:${config.rateLimitKey}`,
      10,
      60 * 60 * 1000
    )
    if (!rl.allowed) {
      return NextResponse.json(rateLimitResponse(rl.resetAt), { status: 429 })
    }

    const result = await runBulkMaterialExport({
      userId: user.id,
      userPlan: user.plan,
      eventId: params.eventId,
      masterDesignId: body.masterDesignId,
      category: body.category,
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: result.status }
      )
    }

    await logActivity({
      userId: user.id,
      action: config.activityAction,
      entityType: 'event',
      entityId: params.eventId,
      meta: {
        count: result.data.items.length,
        category: body.category,
        masterDesignId: body.masterDesignId,
      },
    })

    return NextResponse.json({
      category: body.category,
      zipSuffix: config.zipSuffix,
      ...result.data,
    })
  } catch (error) {
    console.error('Bulk materials error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
