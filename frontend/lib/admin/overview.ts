import { monthPeriodStart } from '@/lib/analytics/period'
import { prisma } from '@/lib/prisma'

export async function getAdminOverview() {
  const monthStart = monthPeriodStart()

  const [
    usersCount,
    eventsCount,
    designsCount,
    participantsCount,
    templatesCount,
    exportsMonth,
    paidOrdersMonth,
    pendingOrders,
    orgCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.design.count(),
    prisma.participant.count(),
    prisma.template.count(),
    prisma.exportLog.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.paymentOrder.count({
      where: { status: 'PAID', paidAt: { gte: monthStart } },
    }),
    prisma.paymentOrder.count({ where: { status: 'PENDING' } }),
    prisma.organization.count(),
  ])

  const revenueMonth = await prisma.paymentOrder.aggregate({
    where: { status: 'PAID', paidAt: { gte: monthStart } },
    _sum: { amount: true },
  })

  const recentPaid = await prisma.paymentOrder.findMany({
    where: { status: 'PAID' },
    orderBy: { paidAt: 'desc' },
    take: 10,
    include: { user: { select: { email: true, name: true } } },
  })

  const planBreakdown = await prisma.user.groupBy({
    by: ['plan'],
    _count: { id: true },
  })

  return {
    totals: {
      users: usersCount,
      events: eventsCount,
      designs: designsCount,
      participants: participantsCount,
      templates: templatesCount,
      organizations: orgCount,
    },
    month: {
      start: monthStart.toISOString(),
      exports: exportsMonth,
      paidOrders: paidOrdersMonth,
      revenueUzs: revenueMonth._sum.amount ?? 0,
    },
    pendingOrders,
    planBreakdown: planBreakdown.map((p) => ({
      plan: p.plan,
      count: p._count.id,
    })),
    recentPaidOrders: recentPaid.map((o) => ({
      id: o.id,
      plan: o.plan,
      amount: o.amount,
      provider: o.provider,
      paidAt: o.paidAt?.toISOString() ?? null,
      userEmail: o.user.email,
    })),
  }
}
