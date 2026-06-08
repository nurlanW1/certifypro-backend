export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { ensureParticipantClaimToken } from '@/lib/claim/ensure-token'
import { buildClaimUrl } from '@/lib/qrcode/claim-url'
import { getOrCreateDbUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function GET(
  _req: Request,
  { params }: { params: { eventId: string; participantId: string } }

) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const participant = await prisma.participant.findFirst({
      where: {
        id: params.participantId,
        eventId: params.eventId,
        event: { userId: user.id },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const token = await ensureParticipantClaimToken(participant.id)
    const claimUrl = buildClaimUrl(token)
    const qrDataUrl = await QRCode.toDataURL(claimUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#1E40AF', light: '#ffffff' },
    })

    return NextResponse.json({
      participantId: participant.id,
      participantName: participant.fullName,
      claimUrl,
      qrDataUrl,
    })
  } catch (error) {
    console.error('Participant QR error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
