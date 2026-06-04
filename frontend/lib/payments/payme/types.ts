export const PaymeState = {
  CREATED: 1,
  COMPLETED: 2,
  CANCELLED: -1,
  CANCELLED_AFTER_COMPLETE: -2,
} as const

export type PaymeAccount = {
  order_id?: string
  [key: string]: string | undefined
}

export type PaymeRpcRequest = {
  jsonrpc?: string
  id?: number | string | null
  method?: string
  params?: Record<string, unknown>
}

export type PaymeRpcErrorBody = {
  code: number
  message: { ru: string; uz: string; en: string } | string
  data?: string
}

export type PaymeRpcResponse = {
  jsonrpc?: '2.0'
  result?: Record<string, unknown>
  error?: PaymeRpcErrorBody
  id: number | string | null
}

export function parsePaymeRpcRequest(payload: unknown): PaymeRpcRequest {
  if (!payload || typeof payload !== 'object') return {}
  return payload as PaymeRpcRequest
}

export function paymeSuccess(
  id: number | string | null,
  result: Record<string, unknown>
): PaymeRpcResponse {
  return { jsonrpc: '2.0', result, id: id ?? null }
}
