import { claimExpiresAt, generateClaimToken } from '@/lib/claim/token'
import { prisma } from '@/lib/prisma'

const CLAIM_DAYS = Number(process.env.CERTIFICATE_CLAIM_DAYS ?? 30)

/** Ishtirokchi uchun claim token (mavjud yoki yangi). */
export async function ensureParticipantClaimToken(participantId: string): Promise<string> {
  const existing = await prisma.participantClaimToken.findUnique({
    where: { participantId },
  })

  if (existing && existing.expiresAt > new Date()) {
    return existing.token
  }

  const token = generateClaimToken()
  const expiresAt = claimExpiresAt(CLAIM_DAYS)

  await prisma.participantClaimToken.upsert({
    where: { participantId },
    create: { participantId, token, expiresAt },
    update: { token, expiresAt },
  })

  return token
}
