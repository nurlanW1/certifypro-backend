import { getOrCreateDbUser } from '@/lib/auth'

export function isPlatformAdminEmail(email: string): boolean {
  const raw = process.env.GILDIA_ADMIN_EMAILS?.trim()
  if (!raw) return false
  const normalized = email.trim().toLowerCase()
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized)
}

export async function requirePlatformAdmin() {
  const user = await getOrCreateDbUser()
  if (!user || !isPlatformAdminEmail(user.email)) return null
  return user
}
