import { NextRequest, NextResponse } from 'next/server'
import { allowDevMocks } from '@/lib/env'
import { fulfillPaymentOrder } from '@/lib/payments/fulfill-order'

/** Dev/mock to‘lovni yakunlash (PAYMENT_DEV_TOKEN). */
export async function GET(req: NextRequest) {
  if (!allowDevMocks()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orderId = req.nextUrl.searchParams.get('orderId')
  const token = req.nextUrl.searchParams.get('token')
  const devToken = process.env.PAYMENT_DEV_TOKEN || 'dev'

  if (!orderId || token !== devToken) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await fulfillPaymentOrder(orderId)
  return NextResponse.redirect(new URL('/upgrade?paid=1', req.url))
}
