import { isClerkConfigured } from '@/lib/clerk-config'

/** Production deployment (Vercel / Railway). */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** Clerk ulanmaguncha mehmon rejimi (dashboard va API ishlaydi). */
export function isGuestMode(): boolean {
  if (isClerkConfigured()) return false
  if (process.env.GILDIA_REQUIRE_CLERK === 'true') return false
  return true
}

/** Mock API fallbacks — mahalliy dev yoki mehmon rejimida. */
export function allowDevMocks(): boolean {
  return !isProduction() || isGuestMode()
}
