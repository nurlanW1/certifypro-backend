import {
  buildMaterialForParticipant,
  buildParticipantContext,
} from '@/lib/bulk-participant-assets'
import { getBillingMe } from '@/lib/billing/service'
import {
  BULK_MATERIAL_CONFIG,
  type BulkMaterialCategory,
} from '@/lib/bulk/material-config'
import { prisma } from '@/lib/prisma'

export interface BulkExportResult {
  eventName: string
  items: { participantId: string; participantName: string; canvasData: object }[]
  watermark: boolean
  highQuality: boolean
  skipped: number
}

export async function runBulkMaterialExport(params: {
  userId: string
  userPlan: import('@prisma/client').Plan
  eventId: string
  masterDesignId: string
  category: BulkMaterialCategory
}): Promise<{ ok: true; data: BulkExportResult } | { ok: false; status: number; error: string; code?: string }> {
  const config = BULK_MATERIAL_CONFIG[params.category]
  const billing = await getBillingMe(params.userId, params.userPlan)

  if (!billing.canUseBulkCertificates) {
    return {
      ok: false,
      status: 402,
      error: `Ommaviy ${config.label.toLowerCase()} eksporti Pro rejimda.`,
      code: 'PLAN_BULK_REQUIRED',
    }
  }

  const event = await prisma.event.findFirst({
    where: { id: params.eventId, userId: params.userId },
    include: {
      participants: { orderBy: { fullName: 'asc' } },
      materials: true,
    },
  })
  if (!event) {
    return { ok: false, status: 404, error: 'Not found' }
  }

  const master = await prisma.design.findFirst({
    where: { id: params.masterDesignId, userId: params.userId, eventId: event.id },
  })
  if (!master) {
    return { ok: false, status: 404, error: 'Asosiy dizayn topilmadi' }
  }

  const material = event.materials.find((m) => m.category === params.category)
  if (!material?.designId || material.designId !== master.id) {
    return {
      ok: false,
      status: 400,
      error: `${config.label} materiali uchun asosiy dizayn tanlang`,
    }
  }

  if (event.participants.length === 0) {
    return { ok: false, status: 400, error: 'Ishtirokchilar ro‘yxati bo‘sh' }
  }

  const maxRun = billing.maxBulkCertificatesPerRun
  const slice = event.participants.slice(0, maxRun)

  if (slice.length > billing.remaining.exports) {
    return {
      ok: false,
      status: 402,
      error: `Eksport limiti: ${billing.remaining.exports} qoldi`,
      code: 'PLAN_LIMIT_EXPORTS',
    }
  }

  const masterCanvas = master.canvasData as { objects?: Record<string, unknown>[] }

  const items = slice.map((p) => {
    const ctx = buildParticipantContext(event, p)
    const canvasData = buildMaterialForParticipant(masterCanvas, ctx, {
      maxTextWidth: config.maxTextWidth,
    })
    return {
      participantId: p.id,
      participantName: p.fullName,
      canvasData,
    }
  })

  for (let i = 0; i < items.length; i++) {
    await prisma.exportLog.create({
      data: {
        userId: params.userId,
        eventId: event.id,
        designId: master.id,
        format: config.exportFormat,
      },
    })
  }

  return {
    ok: true,
    data: {
      eventName: event.name,
      items,
      watermark: billing.requiresWatermark,
      highQuality: billing.limits.highQualityExport,
      skipped: event.participants.length - slice.length,
    },
  }
}
