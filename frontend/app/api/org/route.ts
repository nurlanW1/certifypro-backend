export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { logActivity } from '@/lib/activity/log'
import { getOrCreateDbUser } from '@/lib/auth'
import { uniqueOrgSlug } from '@/lib/org/slug'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
      include: {
        organization: {
          include: {
            _count: { select: { members: true, events: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    if (!membership) {
      return NextResponse.json({ organization: null })
    }

    const org = membership.organization
    return NextResponse.json({
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
        role: membership.role,
        memberCount: org._count.members,
        eventCount: org._count.events,
      },
    })
  } catch (error) {
    console.error('Org get error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.organizationMember.findFirst({
      where: { userId: user.id, role: 'OWNER' },
    })
    if (existing) {
      return NextResponse.json({ error: 'Sizda allaqachon agentlik bor' }, { status: 400 })
    }

    const body = (await req.json()) as { name?: string }
    const name = body.name?.trim() || `${user.name ?? 'Agentlik'} Agency`
    const slug = await uniqueOrgSlug(name, async (s) => {
      const row = await prisma.organization.findUnique({ where: { slug: s } })
      return Boolean(row)
    })

    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        plan: user.plan === 'ENTERPRISE' ? 'ENTERPRISE' : 'FREE',
        members: {
          create: { userId: user.id, role: 'OWNER' },
        },
      },
    })

    await logActivity({
      userId: user.id,
      action: 'org.created',
      entityType: 'organization',
      entityId: org.id,
      meta: { name, slug },
    })

    return NextResponse.json(
      {
        organization: {
          id: org.id,
          name: org.name,
          slug: org.slug,
          plan: org.plan,
          role: 'OWNER',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Org create error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
