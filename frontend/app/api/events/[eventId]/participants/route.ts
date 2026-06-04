import { NextRequest, NextResponse } from 'next/server'
import { logActivity } from '@/lib/activity/log'
import { getOrCreateDbUser } from '@/lib/auth'
import { getBillingMe, billingError } from '@/lib/billing/service'
import { parseParticipantsCsv } from '@/lib/parse-csv'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, userId: user.id },
    })
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const participants = await prisma.participant.findMany({
      where: { eventId: params.eventId },
      orderBy: { fullName: 'asc' },
    })

    return NextResponse.json({
      participants: participants.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        email: p.email,
        organization: p.organization,
        role: p.role,
        createdAt: p.createdAt.toISOString(),
      })),
      total: participants.length,
    })
  } catch (error) {
    console.error('Participants list error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const billing = await getBillingMe(user.id, user.plan)
    if (!billing.canUseParticipantLists) {
      const err = billingError(
        'PLAN_PARTICIPANTS_REQUIRED',
        'Ishtirokchilar ro‘yxati Pro rejimda mavjud.',
        402
      )
      return NextResponse.json(err.body, { status: err.status })
    }

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, userId: user.id },
    })
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = (await req.json()) as { csv?: string; replace?: boolean }
    if (!body.csv?.trim()) {
      return NextResponse.json({ error: 'CSV matn kiritilmagan' }, { status: 400 })
    }

    const rows = parseParticipantsCsv(body.csv)
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Qator topilmadi' }, { status: 400 })
    }

    const existing = await prisma.participant.count({
      where: { eventId: params.eventId },
    })
    const max = billing.limits.maxParticipantsPerEvent
    if (!body.replace && existing + rows.length > max) {
      return NextResponse.json(
        {
          error: `Limit: ${max} ishtirokchi (hozir ${existing}, qo‘shilmoqchi ${rows.length})`,
          code: 'PLAN_LIMIT_PARTICIPANTS',
        },
        { status: 402 }
      )
    }

    if (body.replace) {
      await prisma.participant.deleteMany({ where: { eventId: params.eventId } })
    }

    const toInsert = body.replace ? rows : rows.slice(0, Math.max(0, max - existing))

    await prisma.participant.createMany({
      data: toInsert.map((r) => ({
        eventId: params.eventId,
        fullName: r.fullName,
        email: r.email ?? null,
        organization: r.organization ?? null,
        role: r.role ?? null,
      })),
    })

    const total = await prisma.participant.count({ where: { eventId: params.eventId } })

    await logActivity({
      userId: user.id,
      action: 'participants.imported',
      entityType: 'event',
      entityId: params.eventId,
      meta: { imported: toInsert.length, total },
    })

    return NextResponse.json({
      imported: toInsert.length,
      total,
      skipped: rows.length - toInsert.length,
    })
  } catch (error) {
    console.error('Participants import error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
