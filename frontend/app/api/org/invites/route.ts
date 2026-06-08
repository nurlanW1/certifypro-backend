export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { logActivity } from '@/lib/activity/log'
import { getOrCreateDbUser } from '@/lib/auth'
import { generateInviteToken, normalizeInviteEmail } from '@/lib/org/invite-token'
import { requireOrgAdmin } from '@/lib/org/get-membership'
import { canInvite } from '@/lib/org/permissions'
import { sendOrgInviteEmail } from '@/lib/email/send'
import { getAppBaseUrl } from '@/lib/payments/config'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import type { OrgRole } from '@prisma/client'


const INVITE_DAYS = 7

export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await requireOrgAdmin(user.id)
    if (!membership) {
      return NextResponse.json({ error: 'Ruxsat yo‘q' }, { status: 403 })
    }

    const invites = await prisma.orgInvite.findMany({
      where: {
        organizationId: membership.organizationId,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      invites: invites.map((i) => ({
        id: i.id,
        email: i.email,
        role: i.role,
        expiresAt: i.expiresAt.toISOString(),
        createdAt: i.createdAt.toISOString(),
        emailSentAt: i.emailSentAt?.toISOString() ?? null,
      })),
    })
  } catch (error) {
    console.error('Org invites list error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await requireOrgAdmin(user.id)
    if (!membership || !canInvite(membership.role)) {
      return NextResponse.json({ error: 'Ruxsat yo‘q' }, { status: 403 })
    }

    const rl = await checkRateLimit(`user:${user.id}:org-invite`, 30, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(rateLimitResponse(rl.resetAt), { status: 429 })
    }

    const body = (await req.json()) as { email?: string; role?: OrgRole }

    const email = normalizeInviteEmail(body.email ?? '')
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email kerak' }, { status: 400 })
    }

    const role = body.role === 'ADMIN' ? 'ADMIN' : 'MEMBER'

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      const member = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: membership.organizationId,
            userId: existingUser.id,
          },
        },
      })
      if (member) {
        return NextResponse.json({ error: 'Bu foydalanuvchi allaqachon a’zo' }, { status: 400 })
      }
    }

    const pending = await prisma.orgInvite.findFirst({
      where: {
        organizationId: membership.organizationId,
        email,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
    })
    if (pending) {
      return NextResponse.json({ error: 'Taklif allaqachon yuborilgan' }, { status: 400 })
    }

    const token = generateInviteToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + INVITE_DAYS)

    const invite = await prisma.orgInvite.create({
      data: {
        organizationId: membership.organizationId,
        email,
        role,
        token,
        invitedById: user.id,
        expiresAt,
      },
    })

    const acceptUrl = `${getAppBaseUrl()}/invite?token=${token}`

    const emailResult = await sendOrgInviteEmail({
      to: email,
      organizationName: membership.organization.name,
      acceptUrl,
      role,
      expiresAt,
    })

    if (emailResult.ok) {
      await prisma.orgInvite.update({
        where: { id: invite.id },
        data: { emailSentAt: new Date() },
      })
    }

    await logActivity({
      userId: user.id,
      action: 'org.invite.sent',
      entityType: 'invite',
      entityId: invite.id,
      meta: { email, role, emailProvider: emailResult.provider },
    })

    return NextResponse.json(
      {
        invite: {
          id: invite.id,
          email: invite.email,
          role: invite.role,
          expiresAt: invite.expiresAt.toISOString(),
          acceptUrl,
          emailSent: emailResult.ok,
          emailError: emailResult.ok ? undefined : emailResult.error,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Org invite create error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
