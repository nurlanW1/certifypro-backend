import { NextResponse } from 'next/server'
import { resolveCertificateByClaimToken } from '@/lib/claim/resolve-certificate'

/** Ochiq sertifikat (token orqali, auth shart emas). */
export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const resolved = await resolveCertificateByClaimToken(params.token)
    if (!resolved) {
      return NextResponse.json(
        { error: 'Havola topilmadi yoki muddati tugagan', code: 'CLAIM_INVALID' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      participantName: resolved.participantName,
      eventName: resolved.eventName,
      canvasData: resolved.canvasData,
      watermark: resolved.watermark,
      highQuality: resolved.highQuality,
    })
  } catch (error) {
    console.error('Claim get error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
