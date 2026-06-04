import { NextRequest, NextResponse } from 'next/server'
import { fulfillPaymentOrder } from '@/lib/payments/fulfill-order'
import { verifyClickSignString } from '@/lib/payments/click/signature'
import { logPaymentWebhook } from '@/lib/payments/payme/webhook-log'
import { prisma } from '@/lib/prisma'

/**
 * Click SHOP API (prepare / complete).
 * action: 0 = prepare, 1 = complete
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    body = (await req.json()) as Record<string, unknown>
  } else {
    const form = await req.formData()
    body = Object.fromEntries(form.entries()) as Record<string, unknown>
    for (const [k, v] of Object.entries(body)) {
      body[k] = String(v)
    }
  }

  const secretKey = process.env.CLICK_SECRET_KEY?.trim() ?? ''
  if (!secretKey || !verifyClickSignString(body, secretKey)) {
    return NextResponse.json({
      error: -1,
      error_note: 'SIGN_CHECK_FAILED',
    })
  }

  const action = Number(body.action ?? -1)
  const orderId = String(body.merchant_trans_id ?? '')
  const amount = Number(body.amount ?? 0)

  try {
    const order = orderId
      ? await prisma.paymentOrder.findUnique({ where: { id: orderId } })
      : null

    if (action === 0) {
      if (!order || order.status !== 'PENDING') {
        return NextResponse.json({ error: -5, error_note: 'ORDER_NOT_FOUND' })
      }
      if (order.amount !== amount) {
        return NextResponse.json({ error: -2, error_note: 'WRONG_AMOUNT' })
      }
      await logPaymentWebhook({
        provider: 'CLICK',
        orderId,
        status: 'processed',
        payload: { action: 0 },
      })
      return NextResponse.json({
        click_trans_id: body.click_trans_id,
        merchant_trans_id: orderId,
        merchant_prepare_id: order.id,
        error: 0,
        error_note: 'Success',
      })
    }

    if (action === 1) {
      if (!order) {
        return NextResponse.json({ error: -5, error_note: 'ORDER_NOT_FOUND' })
      }
      if (order.status !== 'PAID') {
        await fulfillPaymentOrder(order.id)
      }
      await logPaymentWebhook({
        provider: 'CLICK',
        orderId,
        status: 'processed',
        payload: { action: 1 },
      })
      return NextResponse.json({
        click_trans_id: body.click_trans_id,
        merchant_trans_id: orderId,
        merchant_confirm_id: order.id,
        error: 0,
        error_note: 'Success',
      })
    }

    return NextResponse.json({ error: -8, error_note: 'UNKNOWN_ACTION' })
  } catch (error) {
    console.error('Click webhook error:', error)
    await logPaymentWebhook({
      provider: 'CLICK',
      orderId: orderId || null,
      status: 'failed',
      error: error instanceof Error ? error.message : 'unknown',
      payload: body,
    })
    return NextResponse.json({ error: -9, error_note: 'SYSTEM_ERROR' })
  }
}
