import { NextResponse } from 'next/server'
import { getOrCreateDbUser } from '@/lib/auth'
import { getUserOrgMembership } from '@/lib/org/get-membership'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await getUserOrgMembership(user.id)
    if (!membership) {
      return NextResponse.json({ members: [] })
    }

    const rows = await prisma.organizationMember.findMany({
      where: { organizationId: membership.organizationId },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({
      members: rows.map((m) => ({
        id: m.id,
        userId: m.userId,
        email: m.user.email,
        name: m.user.name,
        role: m.role,
        joinedAt: m.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Org members error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
