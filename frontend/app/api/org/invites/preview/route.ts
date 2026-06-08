export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'


/** Auth talab qilmaydi — taklif ma’lumotini ko‘rsatish. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')?.trim()
  if (!token) {
    return NextResponse.json({ error: 'Token kerak' }, { status: 400 })
  }

  const invite = await prisma.orgInvite.findUnique({
    where: { token },
    include: { organization: { select: { name: true, slug: true } } },
  })

  if (!invite || invite.acceptedAt) {
    return NextResponse.json({ valid: false })
  }

  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, expired: true })
  }

  return NextResponse.json({
    valid: true,
    email: invite.email,
    role: invite.role,
    organizationName: invite.organization.name,
    expiresAt: invite.expiresAt.toISOString(),
  })
}
