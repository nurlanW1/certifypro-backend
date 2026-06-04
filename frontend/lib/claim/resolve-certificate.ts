import {
  buildMaterialForParticipant,
  buildParticipantContext,
} from '@/lib/bulk-participant-assets'
import { getBillingMe } from '@/lib/billing/service'
import { prisma } from '@/lib/prisma'

export interface ResolvedCertificate {
  participantName: string
  eventName: string
  canvasData: object
  watermark: boolean
  highQuality: boolean
}

export async function resolveCertificateByClaimToken(
  token: string
): Promise<ResolvedCertificate | null> {
  const claim = await prisma.participantClaimToken.findUnique({
    where: { token },
    include: {
      participant: {
        include: {
          event: {
            include: {
              materials: true,
              user: { select: { plan: true, name: true } },
            },
          },
        },
      },
    },
  })

  if (!claim || claim.expiresAt < new Date()) return null

  const event = claim.participant.event
  const certMaterial = event.materials.find((m) => m.category === 'CERTIFICATE')
  if (!certMaterial?.designId) return null

  const master = await prisma.design.findFirst({
    where: { id: certMaterial.designId, eventId: event.id },
  })
  if (!master) return null

  const billing = await getBillingMe(event.userId, event.user.plan)
  const masterCanvas = master.canvasData as { objects?: Record<string, unknown>[] }
  const ctx = buildParticipantContext(event, claim.participant)
  const canvasData = buildMaterialForParticipant(masterCanvas, ctx)

  return {
    participantName: claim.participant.fullName,
    eventName: event.name,
    canvasData,
    watermark: billing.requiresWatermark,
    highQuality: billing.limits.highQualityExport,
  }
}
