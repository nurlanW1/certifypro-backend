import { NextRequest, NextResponse } from 'next/server'

/** Payme checkout qaytish — upgrade sahifasiga yo‘naltirish. */
export async function GET(req: NextRequest) {
  const orderId =
    req.nextUrl.searchParams.get('order_id') ??
    req.nextUrl.searchParams.get('order') ??
    ''
  const target = new URL('/upgrade', req.url)
  if (orderId) target.searchParams.set('order', orderId)
  const success =
    req.nextUrl.searchParams.get('success') === '1' ||
    req.nextUrl.searchParams.get('status') === 'success'
  if (success) target.searchParams.set('paid', '1')
  return NextResponse.redirect(target)
}
