import { randomBytes } from 'crypto'

export function generateInviteToken(): string {
  return randomBytes(24).toString('hex')
}

export function normalizeInviteEmail(email: string): string {
  return email.trim().toLowerCase()
}
