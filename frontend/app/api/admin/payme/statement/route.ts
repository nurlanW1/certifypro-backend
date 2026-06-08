export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { requirePlatformAdmin } from '@/lib/auth/platform-admin'
import { prisma } from '@/lib/prisma'


/** Payme tranzaksiyalar jadvali (platform admin). */
export async function GET(req: NextRequest) {
  try {
    const admin = await requirePlatformAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const fromParam = req.nextUrl.searchParams.get('from')
    const toParam = req.nextUrl.searchParams.get('to')
    const from = fromParam ? Number(fromParam) : Date.now() - 30 * 24 * 60 * 60 * 1000
    const to = toParam ? Number(toParam) : Date.now()

    const txns = await prisma.paymeTransaction.findMany({
      where: {
        createTime: { gte: BigInt(from), lte: BigInt(to) },
      },
      include: {
        order: {
          select: {
            id: true,
            plan: true,
            amount: true,
            status: true,
            user: { select: { email: true } },
          },
        },
      },
      orderBy: { createTime: 'desc' },
      take: 200,
    })

    return NextResponse.json({
      from,
      to,
      transactions: txns.map((t) => ({
        paymeId: t.paymeId,
        state: t.state,
        orderId: t.orderId,
        plan: t.order.plan,
        amount: t.order.amount,
        orderStatus: t.order.status,
        userEmail: t.order.user.email,
        createTime: Number(t.createTime),
        performTime: Number(t.performTime),
        cancelTime: Number(t.cancelTime),
      })),
    })
  } catch (error) {
    console.error('Payme statement error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
