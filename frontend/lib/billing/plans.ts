import type { Plan } from '@prisma/client'

export interface PlanLimits {
  maxDesigns: number
  maxExports: number
  maxEvents: number
  maxMaterialsPerEvent: number
  maxParticipantsPerEvent: number
  watermark: boolean
  premiumTemplates: boolean
  highQualityExport: boolean
  participantLists: boolean
  fullPackageExport: boolean
  bulkCertificates: boolean
  maxBulkCertificatesPerRun: number
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    maxDesigns: 5,
    maxExports: 10,
    maxEvents: 3,
    maxMaterialsPerEvent: 5,
    maxParticipantsPerEvent: 50,
    watermark: true,
    premiumTemplates: false,
    highQualityExport: false,
    participantLists: false,
    fullPackageExport: false,
    bulkCertificates: false,
    maxBulkCertificatesPerRun: 0,
  },
  PRO: {
    maxDesigns: 200,
    maxExports: 500,
    maxEvents: 50,
    maxMaterialsPerEvent: 18,
    maxParticipantsPerEvent: 2000,
    watermark: false,
    premiumTemplates: true,
    highQualityExport: true,
    participantLists: true,
    fullPackageExport: true,
    bulkCertificates: true,
    maxBulkCertificatesPerRun: 200,
  },
  ENTERPRISE: {
    maxDesigns: 5000,
    maxExports: 10000,
    maxEvents: 1000,
    maxMaterialsPerEvent: 18,
    maxParticipantsPerEvent: 50000,
    watermark: false,
    premiumTemplates: true,
    highQualityExport: true,
    participantLists: true,
    fullPackageExport: true,
    bulkCertificates: true,
    maxBulkCertificatesPerRun: 2000,
  },
}

export const PLAN_LABELS: Record<Plan, string> = {
  FREE: 'Bepul',
  PRO: 'Pro',
  ENTERPRISE: 'Agentlik',
}

export const PLAN_PRICES_UZS: Record<Plan, number | null> = {
  FREE: 0,
  PRO: 299_000,
  ENTERPRISE: null,
}
