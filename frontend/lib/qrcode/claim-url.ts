import { getAppBaseUrl } from '@/lib/payments/config'

export function buildClaimUrl(token: string): string {
  const base = getAppBaseUrl().replace(/\/$/, '')
  return `${base}/claim?token=${encodeURIComponent(token)}`
}
