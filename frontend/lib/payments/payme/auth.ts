import { PaymeRpcError } from '@/lib/payments/payme/errors'

export function verifyPaymeAuthorization(
  authorization: string | string[] | undefined
): void {
  const header = Array.isArray(authorization) ? authorization[0] : authorization
  if (!header?.startsWith('Basic ')) {
    throw PaymeRpcError.accessDenied()
  }

  const secretKey = process.env.PAYME_SECRET_KEY?.trim()
  const merchantId = process.env.PAYME_MERCHANT_ID?.trim()
  if (!secretKey) {
    throw PaymeRpcError.accessDenied()
  }

  let decoded: string
  try {
    decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
  } catch {
    throw PaymeRpcError.accessDenied()
  }

  const colon = decoded.indexOf(':')
  if (colon < 0) throw PaymeRpcError.accessDenied()

  const username = decoded.slice(0, colon)
  const password = decoded.slice(colon + 1)

  const validPaycom = username === 'Paycom' && password === secretKey
  const validMerchant = Boolean(merchantId) && username === merchantId && password === secretKey

  if (!validPaycom && !validMerchant) {
    throw PaymeRpcError.accessDenied()
  }
}
