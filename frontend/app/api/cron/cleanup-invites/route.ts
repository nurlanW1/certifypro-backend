import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** Muddati o‘tgan takliflarni tozalash. Header: Authorization: Bearer CRON_SECRET */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  const auth = req.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null

  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const now = new Date()
  const deleted = await prisma.orgInvite.deleteMany({
    where: {
      acceptedAt: null,
      expiresAt: { lt: now },
    },
  })

  return NextResponse.json({
    ok: true,
    deletedInvites: deleted.count,
    at: now.toISOString(),
  })
}
