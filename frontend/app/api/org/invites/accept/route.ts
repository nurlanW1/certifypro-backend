export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { logActivity } from '@/lib/activity/log'
import { getOrCreateDbUser } from '@/lib/auth'
import { normalizeInviteEmail } from '@/lib/org/invite-token'
import { prisma } from '@/lib/prisma'


export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as { token?: string }
    const token = body.token?.trim()
    if (!token) {
      return NextResponse.json({ error: 'Token kerak' }, { status: 400 })
    }

    const invite = await prisma.orgInvite.findUnique({
      where: { token },
      include: { organization: true },
    })

    if (!invite || invite.acceptedAt) {
      return NextResponse.json({ error: 'Taklif topilmadi yoki ishlatilgan' }, { status: 404 })
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Taklif muddati tugagan' }, { status: 410 })
    }

    if (normalizeInviteEmail(user.email) !== invite.email) {
      return NextResponse.json(
        { error: 'Bu taklif boshqa email uchun. Clerk hisobingiz emaili mos kelishi kerak.' },
        { status: 403 }
      )
    }

    const existingMember = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
    })
    if (existingMember) {
      return NextResponse.json({ error: 'Siz allaqachon boshqa agentlikda a’zosiz' }, { status: 400 })
    }

    await prisma.$transaction([
      prisma.organizationMember.create({
        data: {
          organizationId: invite.organizationId,
          userId: user.id,
          role: invite.role,
        },
      }),
      prisma.orgInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      }),
    ])

    await logActivity({
      userId: user.id,
      action: 'org.invite.accepted',
      entityType: 'organization',
      entityId: invite.organizationId,
      meta: { inviteId: invite.id },
    })

    return NextResponse.json({
      organization: {
        id: invite.organization.id,
        name: invite.organization.name,
        slug: invite.organization.slug,
        role: invite.role,
      },
    })
  } catch (error) {
    console.error('Org invite accept error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
