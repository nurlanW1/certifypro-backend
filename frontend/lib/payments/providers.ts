import type { Plan } from '@prisma/client'
import { PLAN_PRICES_UZS } from '@/lib/billing/plans'
import { allowDevMocks } from '@/lib/env'
import { getAppBaseUrl, isClickConfigured, isPaymeConfigured } from '@/lib/payments/config'
import { somToTiyin } from '@/lib/payments/payme/amount'

export interface PaymentSession {
  provider: 'PAYME' | 'CLICK' | 'MOCK'
  paymentUrl: string | null
  instructions: string
  providerRef: string | null
}

export function createPaymentSession(params: {
  orderId: string
  plan: Plan
  provider: 'PAYME' | 'CLICK' | 'MOCK'
}): PaymentSession {
  const amount = PLAN_PRICES_UZS[params.plan] ?? 299_000
  const base = getAppBaseUrl()
  const returnUrl = `${base}/upgrade?order=${params.orderId}`

  if (params.provider === 'PAYME' && isPaymeConfigured()) {
    const merchant = process.env.PAYME_MERCHANT_ID!
    const ref = `gildia_${params.orderId}`
    const paymeReturn = `${base}/api/billing/payme/return`
    const checkoutParams = {
      m: merchant,
      ac: { order_id: params.orderId },
      a: somToTiyin(amount),
      c: paymeReturn,
      l: `Gildia ${params.plan}`,
    }
    const encoded = Buffer.from(JSON.stringify(checkoutParams)).toString('base64')
    const checkoutBase =
      process.env.PAYME_CHECKOUT_URL?.trim() || 'https://checkout.paycom.uz'
    const url = `${checkoutBase}/${encoded}`
    return {
      provider: 'PAYME',
      paymentUrl: url,
      instructions: 'Payme orqali to‘lovni yakunlang.',
      providerRef: ref,
    }
  }

  if (params.provider === 'CLICK' && isClickConfigured()) {
    const serviceId = process.env.CLICK_SERVICE_ID || process.env.CLICK_MERCHANT_ID!
    const merchantId = process.env.CLICK_MERCHANT_ID!
    const url = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${params.orderId}&return_url=${encodeURIComponent(returnUrl)}`
    return {
      provider: 'CLICK',
      paymentUrl: url,
      instructions: 'Click orqali to‘lovni yakunlang.',
      providerRef: params.orderId,
    }
  }

  if (!allowDevMocks()) {
    const hint =
      params.provider === 'PAYME'
        ? 'Payme sozlanmagan (PAYME_MERCHANT_ID va kalitlar).'
        : params.provider === 'CLICK'
          ? 'Click sozlanmagan (CLICK_MERCHANT_ID va kalitlar).'
          : 'To‘lov provayderi tanlanmagan.'
    return {
      provider: 'MOCK',
      paymentUrl: null,
      instructions: hint,
      providerRef: null,
    }
  }

  return {
    provider: 'MOCK',
    paymentUrl: `${base}/api/billing/complete?orderId=${params.orderId}&token=${process.env.PAYMENT_DEV_TOKEN || 'dev'}`,
    instructions:
      'Sinov rejimi: havolani oching yoki /upgrade sahifasida “Sinov: darhol Pro” ishlating.',
    providerRef: `mock_${params.orderId}`,
  }
}
