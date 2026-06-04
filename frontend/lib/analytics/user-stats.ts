import { getBillingMe } from '@/lib/billing/service'
import { lastNDaysRanges, monthPeriodStart } from '@/lib/analytics/period'
import { prisma } from '@/lib/prisma'
import type { Plan } from '@prisma/client'

export async function getUserAnalytics(userId: string, plan: Plan) {
  const monthStart = monthPeriodStart()
  const billing = await getBillingMe(userId, plan)

  const [
    participantsTotal,
    materialsReady,
    claimEmailsSent,
    recentActivity,
  ] = await Promise.all([
    prisma.participant.count({
      where: { event: { userId } },
    }),
    prisma.eventMaterial.count({
      where: { event: { userId }, status: 'READY' },
    }),
    prisma.participantClaimToken.count({
      where: {
        emailedAt: { not: null },
        participant: { event: { userId } },
      },
    }),
    prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        action: true,
        entityType: true,
        createdAt: true,
      },
    }),
  ])

  const dayRanges = lastNDaysRanges(7)
  const exportTrend = await Promise.all(
    dayRanges.map(async (day) => ({
      date: day.date,
      exports: await prisma.exportLog.count({
        where: {
          userId,
          createdAt: { gte: day.start, lt: day.end },
        },
      }),
    }))
  )

  return {
    plan: billing.plan,
    planName: billing.planName,
    usage: billing.usage,
    remaining: billing.remaining,
    participantsTotal,
    materialsReady,
    certificateEmailsSent: claimEmailsSent,
    exportTrend,
    recentActivity: recentActivity.map((a) => ({
      id: a.id,
      action: a.action,
      entityType: a.entityType,
      createdAt: a.createdAt.toISOString(),
    })),
    periodStart: monthStart.toISOString(),
  }
}

export async function getEventAnalytics(userId: string, eventId: string) {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
    include: {
      _count: { select: { participants: true, designs: true } },
      materials: true,
    },
  })
  if (!event) return null

  const monthStart = monthPeriodStart()
  const [exportsCount, claimsWithEmail, claimsTotal] = await Promise.all([
    prisma.exportLog.count({
      where: { eventId, userId, createdAt: { gte: monthStart } },
    }),
    prisma.participantClaimToken.count({
      where: {
        emailedAt: { not: null },
        participant: { eventId },
      },
    }),
    prisma.participantClaimToken.count({
      where: { participant: { eventId } },
    }),
  ])

  const readyMaterials = event.materials.filter((m) => m.status === 'READY').length
  const certReady = event.materials.some(
    (m) => m.category === 'CERTIFICATE' && m.status === 'READY' && m.designId
  )
  const badgeReady = event.materials.some(
    (m) => m.category === 'BADGE' && m.status === 'READY' && m.designId
  )
  const nameTagReady = event.materials.some(
    (m) => m.category === 'NAME_TAG' && m.status === 'READY' && m.designId
  )

  return {
    eventId: event.id,
    eventName: event.name,
    participantsCount: event._count.participants,
    designsCount: event._count.designs,
    materialsTotal: event.materials.length,
    materialsReady: readyMaterials,
    exportsThisMonth: exportsCount,
    certificateEmailsSent: claimsWithEmail,
    claimLinksIssued: claimsTotal,
    certificateMaterialReady: certReady,
    badgeMaterialReady: badgeReady,
    nameTagMaterialReady: nameTagReady,
  }
}
