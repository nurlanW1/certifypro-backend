export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { processPaymeWebhook } from '@/lib/payments/payme/rpc-handler'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/rate-limit/client-ip'


/** Payme Merchant API JSON-RPC (POST). */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = await checkRateLimit(`ip:${ip}:payme-wh`, 500, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(rateLimitResponse(rl.resetAt), { status: 429 })
    }
    const payload = await req.json()
    const headers: Record<string, string | string[] | undefined> = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })
    const response = await processPaymeWebhook(payload, headers)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Payme webhook error:', error)
    return NextResponse.json(
      {
        error: { code: -32400, message: 'System error' },
        id: null,
      },
      { status: 500 }
    )
  }
}
