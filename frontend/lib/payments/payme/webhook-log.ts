import type { PaymentProvider } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function logPaymentWebhook(params: {
  provider: PaymentProvider
  orderId?: string | null
  status: 'processed' | 'failed'
  payload?: unknown
  error?: string | null
}) {
  try {
    await prisma.paymentWebhookLog.create({
      data: {
        provider: params.provider,
        orderId: params.orderId ?? null,
        status: params.status,
        error: params.error ?? null,
        payload: params.payload != null ? (params.payload as object) : undefined,
      },
    })
  } catch (e) {
    console.error('[webhook-log]', e)
  }
}
