import type { OrgRole } from '@prisma/client'

const RANK: Record<OrgRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
}

export function canManageMembers(role: OrgRole): boolean {
  return RANK[role] >= RANK.ADMIN
}

export function canInvite(role: OrgRole): boolean {
  return RANK[role] >= RANK.ADMIN
}
