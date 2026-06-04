export type PaymentProviderId = 'PAYME' | 'CLICK' | 'MOCK'

export function isPaymeConfigured(): boolean {
  return Boolean(process.env.PAYME_MERCHANT_ID?.trim() && process.env.PAYME_SECRET_KEY?.trim())
}

export function isClickConfigured(): boolean {
  return Boolean(process.env.CLICK_MERCHANT_ID?.trim() && process.env.CLICK_SECRET_KEY?.trim())
}

export function getAppBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000'
}
