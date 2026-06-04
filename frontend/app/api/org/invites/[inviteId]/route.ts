import { NextResponse } from 'next/server'
import { getOrCreateDbUser } from '@/lib/auth'
import { requireOrgAdmin } from '@/lib/org/get-membership'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: { inviteId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await requireOrgAdmin(user.id)
    if (!membership) {
      return NextResponse.json({ error: 'Ruxsat yo‘q' }, { status: 403 })
    }

    const invite = await prisma.orgInvite.findFirst({
      where: {
        id: params.inviteId,
        organizationId: membership.organizationId,
        acceptedAt: null,
      },
    })

    if (!invite) {
      return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
    }

    await prisma.orgInvite.delete({ where: { id: invite.id } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Org invite delete error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
