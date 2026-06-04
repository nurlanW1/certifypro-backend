import { randomBytes } from 'crypto'

export function generateClaimToken(): string {
  return randomBytes(32).toString('hex')
}

export function claimExpiresAt(days = 30): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}
