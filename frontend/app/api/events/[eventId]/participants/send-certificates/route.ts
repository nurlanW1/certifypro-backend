import { NextRequest, NextResponse } from 'next/server'
import { logActivity } from '@/lib/activity/log'
import { ensureParticipantClaimToken } from '@/lib/claim/ensure-token'
import { buildClaimUrl } from '@/lib/qrcode/claim-url'
import { getOrCreateDbUser } from '@/lib/auth'
import { sendCertificateReadyEmail } from '@/lib/email/send'
import { getBillingMe, billingError } from '@/lib/billing/service'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'

const MAX_EMAILS_PER_RUN = 50
export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rl = await checkRateLimit(`user:${user.id}:send-certs`, 5, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(rateLimitResponse(rl.resetAt), { status: 429 })
    }

    const billing = await getBillingMe(user.id, user.plan)
    if (!billing.canUseBulkCertificates) {
      const err = billingError(
        'PLAN_BULK_REQUIRED',
        'Sertifikat emaillari Pro rejimda.',
        402
      )
      return NextResponse.json(err.body, { status: err.status })
    }

    const body = (await req.json()) as { masterDesignId?: string }
    if (!body.masterDesignId) {
      return NextResponse.json({ error: 'masterDesignId required' }, { status: 400 })
    }

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, userId: user.id },
      include: {
        participants: { orderBy: { fullName: 'asc' } },
        materials: true,
      },
    })
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const certMaterial = event.materials.find((m) => m.category === 'CERTIFICATE')
    if (!certMaterial?.designId || certMaterial.designId !== body.masterDesignId) {
      return NextResponse.json(
        { error: 'Sertifikat asosiy dizayni tanlang' },
        { status: 400 }
      )
    }

    const withEmail = event.participants.filter((p) => p.email?.trim())
    if (withEmail.length === 0) {
      return NextResponse.json(
        { error: 'Email manzili bor ishtirokchilar yo‘q' },
        { status: 400 }
      )
    }

    const slice = withEmail.slice(0, MAX_EMAILS_PER_RUN)
    let sent = 0
    let failed = 0
    const results: { participantId: string; ok: boolean; error?: string }[] = []

    for (const p of slice) {
      const token = await ensureParticipantClaimToken(p.id)
      const claimUrl = buildClaimUrl(token)
      const emailResult = await sendCertificateReadyEmail({
        to: p.email!.trim(),
        participantName: p.fullName,
        eventName: event.name,
        claimUrl,
        organizerName: user.name,
      })

      if (emailResult.ok) {
        sent++
        await prisma.participantClaimToken.update({
          where: { participantId: p.id },
          data: { emailedAt: new Date() },
        })
        results.push({ participantId: p.id, ok: true })
      } else {
        failed++
        results.push({
          participantId: p.id,
          ok: false,
          error: emailResult.error,
        })
      }
    }

    await logActivity({
      userId: user.id,
      action: 'participants.certificate_email',
      entityType: 'event',
      entityId: event.id,
      meta: { sent, failed, total: slice.length },
    })

    return NextResponse.json({
      sent,
      failed,
      skipped: withEmail.length - slice.length,
      noEmail: event.participants.length - withEmail.length,
      results,
    })
  } catch (error) {
    console.error('Send certificates error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
