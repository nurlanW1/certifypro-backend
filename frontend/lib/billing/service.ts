import type { Plan } from '@prisma/client'
import { PLAN_LIMITS, type PlanLimits } from '@/lib/billing/plans'
import { prisma } from '@/lib/prisma'

export interface BillingUsage {
  designsCount: number
  exportsCount: number
  eventsCount: number
}

export interface BillingMe {
  plan: Plan
  planName: string
  limits: PlanLimits
  usage: BillingUsage
  remaining: {
    designs: number
    exports: number
    events: number
  }
  canCreateDesign: boolean
  canCreateEvent: boolean
  canExport: boolean
  canUsePremiumTemplate: boolean
  canUseParticipantLists: boolean
  canUseFullPackageExport: boolean
  canUseBulkCertificates: boolean
  maxBulkCertificatesPerRun: number
  requiresWatermark: boolean
}

function periodStart(): Date {
  const d = new Date()
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export async function syncUsage(userId: string): Promise<BillingUsage> {
  const monthStart = periodStart()

  const [designsCount, eventsCount, exportsCount] = await Promise.all([
    prisma.design.count({ where: { userId } }),
    prisma.event.count({ where: { userId } }),
    prisma.exportLog.count({
      where: { userId, createdAt: { gte: monthStart } },
    }),
  ])

  return { designsCount, exportsCount, eventsCount }
}

export async function getBillingMe(userId: string, plan: Plan): Promise<BillingMe> {
  const limits = PLAN_LIMITS[plan]
  const usage = await syncUsage(userId)

  const remaining = {
    designs: Math.max(0, limits.maxDesigns - usage.designsCount),
    exports: Math.max(0, limits.maxExports - usage.exportsCount),
    events: Math.max(0, limits.maxEvents - usage.eventsCount),
  }

  return {
    plan,
    planName: plan === 'FREE' ? 'Bepul' : plan === 'PRO' ? 'Pro' : 'Agentlik',
    limits,
    usage,
    remaining,
    canCreateDesign: remaining.designs > 0,
    canCreateEvent: remaining.events > 0,
    canExport: remaining.exports > 0,
    canUsePremiumTemplate: limits.premiumTemplates,
    canUseParticipantLists: limits.participantLists,
    canUseFullPackageExport: limits.fullPackageExport,
    canUseBulkCertificates: limits.bulkCertificates,
    maxBulkCertificatesPerRun: limits.maxBulkCertificatesPerRun,
    requiresWatermark: limits.watermark,
  }
}

export function billingError(
  code: string,
  message: string,
  status = 402
): { status: number; body: { error: string; code: string } } {
  return { status, body: { error: message, code } }
}
