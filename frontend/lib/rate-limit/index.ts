import { prisma } from '@/lib/prisma'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

/**
 * Oddiy DB rate limit (serverless-friendly).
 * @param key masalan `user:abc:checkout` yoki `ip:1.2.3:webhook`
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date()
  const row = await prisma.rateLimitEntry.findUnique({ where: { key } })

  if (!row || row.resetAt <= now) {
    const resetAt = new Date(now.getTime() + windowMs)
    await prisma.rateLimitEntry.upsert({
      where: { key },
      create: { key, count: 1, resetAt },
      update: { count: 1, resetAt },
    })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  if (row.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: row.resetAt }
  }

  const updated = await prisma.rateLimitEntry.update({
    where: { key },
    data: { count: { increment: 1 } },
  })

  return {
    allowed: true,
    remaining: Math.max(0, limit - updated.count),
    resetAt: row.resetAt,
  }
}

export function rateLimitResponse(resetAt: Date) {
  return {
    error: 'Juda ko‘p so‘rov. Keyinroq urinib ko‘ring.',
    code: 'RATE_LIMITED',
    retryAfter: resetAt.toISOString(),
  }
}
