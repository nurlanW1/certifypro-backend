import type { Plan } from '@prisma/client'
import { logActivity } from '@/lib/activity/log'
import { prisma } from '@/lib/prisma'

export async function fulfillPaymentOrder(orderId: string): Promise<boolean> {
  const order = await prisma.paymentOrder.findUnique({ where: { id: orderId } })
  if (!order || order.status === 'PAID') return false

  const paidAt = new Date()
  await prisma.paymentOrder.update({
    where: { id: orderId },
    data: { status: 'PAID', paidAt },
  })

  await prisma.user.update({
    where: { id: order.userId },
    data: { plan: order.plan },
  })

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: order.userId, role: 'OWNER' },
    include: { organization: true },
  })
  if (membership && order.plan === 'ENTERPRISE') {
    await prisma.organization.update({
      where: { id: membership.organizationId },
      data: { plan: 'ENTERPRISE' },
    })
  }

  await logActivity({
    userId: order.userId,
    action: 'payment.paid',
    entityType: 'order',
    entityId: orderId,
    meta: { plan: order.plan, provider: order.provider },
  })

  return true
}
