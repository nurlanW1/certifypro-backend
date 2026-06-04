import { NextResponse } from 'next/server'
import { getOrCreateDbUser } from '@/lib/auth'
import { getBillingMe, billingError } from '@/lib/billing/service'
import { buildParticipantsCsv } from '@/lib/participants/export-csv'
import { prisma } from '@/lib/prisma'

/** Ishtirokchilar hisoboti (CSV). */
export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const billing = await getBillingMe(user.id, user.plan)
    if (!billing.canUseParticipantLists) {
      const err = billingError('PLAN_PARTICIPANTS', 'Pro rejim kerak', 402)
      return NextResponse.json(err.body, { status: err.status })
    }

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, userId: user.id },
      select: { name: true },
    })
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const participants = await prisma.participant.findMany({
      where: { eventId: params.eventId },
      orderBy: { fullName: 'asc' },
      include: { claimToken: true },
    })

    const csv = buildParticipantsCsv(
      participants.map((p) => ({
        fullName: p.fullName,
        email: p.email,
        organization: p.organization,
        role: p.role,
        hasClaimLink: Boolean(p.claimToken),
        emailSent: Boolean(p.claimToken?.emailedAt),
      }))
    )

    const safeName = event.name.replace(/[^\w\-]+/g, '_').slice(0, 40)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeName}-ishtirokchilar.csv"`,
      },
    })
  } catch (error) {
    console.error('Participants export error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
