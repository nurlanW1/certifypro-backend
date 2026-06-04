import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function logActivity(params: {
  userId: string
  action: string
  entityType?: string
  entityId?: string
  meta?: Record<string, unknown>
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType ?? null,
        entityId: params.entityId ?? null,
        meta: params.meta
          ? (JSON.parse(JSON.stringify(params.meta)) as Prisma.InputJsonValue)
          : undefined,
      },
    })
  } catch (e) {
    console.error('Activity log failed:', e)
  }
}
