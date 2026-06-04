import { prisma } from '@/lib/prisma'

export async function getUserOrgMembership(userId: string) {
  return prisma.organizationMember.findFirst({
    where: { userId },
    include: {
      organization: {
        include: { _count: { select: { members: true, events: true } } },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function requireOrgAdmin(userId: string) {
  const membership = await getUserOrgMembership(userId)
  if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
    return null
  }
  return membership
}
