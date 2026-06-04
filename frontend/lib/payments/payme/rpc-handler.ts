import type { PaymentOrder } from '@prisma/client'
import { fulfillPaymentOrder } from '@/lib/payments/fulfill-order'
import { paymeAmountsMatch } from '@/lib/payments/payme/amount'
import { verifyPaymeAuthorization } from '@/lib/payments/payme/auth'
import { PaymeRpcError } from '@/lib/payments/payme/errors'
import { logPaymentWebhook } from '@/lib/payments/payme/webhook-log'
import {
  parsePaymeRpcRequest,
  PaymeState,
  paymeSuccess,
  type PaymeAccount,
  type PaymeRpcRequest,
  type PaymeRpcResponse,
} from '@/lib/payments/payme/types'
import { prisma } from '@/lib/prisma'

function extractOrderId(account: PaymeAccount): string | null {
  return account.order_id?.trim() || null
}

async function loadOrder(orderId: string): Promise<PaymentOrder | null> {
  return prisma.paymentOrder.findUnique({ where: { id: orderId } })
}

function requireValidOrder(
  order: PaymentOrder | null,
  amountTiyin: number
): PaymentOrder {
  if (!order) throw PaymeRpcError.orderNotFound('order_id')
  if (!paymeAmountsMatch(order.amount, amountTiyin)) {
    throw PaymeRpcError.wrongAmount('amount')
  }
  if (order.status === 'PAID') throw PaymeRpcError.terminalState()
  if (order.status === 'CANCELLED' || order.status === 'EXPIRED') {
    throw PaymeRpcError.unableToComplete()
  }
  return order
}

async function checkPerformTransaction(params: Record<string, unknown>) {
  const account = (params.account ?? {}) as PaymeAccount
  const orderId = extractOrderId(account)
  if (!orderId) throw PaymeRpcError.orderNotFound('order_id')
  const order = requireValidOrder(
    await loadOrder(orderId),
    Number(params.amount ?? 0)
  )
  return { allow: true, additional: { order_id: order.id } }
}

async function createTransaction(params: Record<string, unknown>) {
  const account = (params.account ?? {}) as PaymeAccount
  const orderId = extractOrderId(account)
  if (!orderId) throw PaymeRpcError.orderNotFound('order_id')
  const order = requireValidOrder(
    await loadOrder(orderId),
    Number(params.amount ?? 0)
  )

  const paymeId = String(params.id ?? '')
  const time = Number(params.time ?? Date.now())
  if (!paymeId) throw PaymeRpcError.systemError()

  const existing = await prisma.paymeTransaction.findUnique({ where: { paymeId } })
  if (existing) {
    return {
      create_time: Number(existing.createTime),
      transaction: existing.id,
      state: existing.state,
    }
  }

  const txn = await prisma.paymeTransaction.create({
    data: {
      orderId: order.id,
      paymeId,
      state: PaymeState.CREATED,
      createTime: BigInt(time),
    },
  })

  return {
    create_time: time,
    transaction: txn.id,
    state: PaymeState.CREATED,
  }
}

async function performTransaction(params: Record<string, unknown>) {
  const paymeId = String(params.id ?? '')
  const txn = await prisma.paymeTransaction.findUnique({ where: { paymeId } })
  if (!txn) throw PaymeRpcError.transactionNotFound()

  if (txn.state === PaymeState.COMPLETED) {
    return {
      transaction: txn.id,
      perform_time: Number(txn.performTime),
      state: PaymeState.COMPLETED,
    }
  }

  if (txn.state < 0) throw PaymeRpcError.unableToComplete()

  const order = await loadOrder(txn.orderId)
  if (!order) throw PaymeRpcError.orderNotFound('order_id')
  if (order.status === 'PAID') {
    return {
      transaction: txn.id,
      perform_time: Number(txn.performTime) || Date.now(),
      state: PaymeState.COMPLETED,
    }
  }

  const performTime = Date.now()
  await prisma.paymeTransaction.update({
    where: { id: txn.id },
    data: {
      state: PaymeState.COMPLETED,
      performTime: BigInt(performTime),
    },
  })

  await fulfillPaymentOrder(order.id)

  return {
    transaction: txn.id,
    perform_time: performTime,
    state: PaymeState.COMPLETED,
  }
}

async function cancelTransaction(params: Record<string, unknown>) {
  const paymeId = String(params.id ?? '')
  const reason = Number(params.reason ?? 0)
  const txn = await prisma.paymeTransaction.findUnique({ where: { paymeId } })
  if (!txn) throw PaymeRpcError.transactionNotFound()

  if (txn.state < 0) {
    return {
      transaction: txn.id,
      cancel_time: Number(txn.cancelTime),
      state: txn.state,
    }
  }

  if (txn.state === PaymeState.COMPLETED) throw PaymeRpcError.cantCancel()

  const cancelTime = Date.now()
  await prisma.paymeTransaction.update({
    where: { id: txn.id },
    data: {
      state: PaymeState.CANCELLED,
      cancelTime: BigInt(cancelTime),
      reason,
    },
  })

  await prisma.paymentOrder.update({
    where: { id: txn.orderId },
    data: { status: 'CANCELLED' },
  })

  return {
    transaction: txn.id,
    cancel_time: cancelTime,
    state: PaymeState.CANCELLED,
  }
}

async function checkTransaction(params: Record<string, unknown>) {
  const paymeId = String(params.id ?? '')
  const txn = await prisma.paymeTransaction.findUnique({ where: { paymeId } })
  if (!txn) throw PaymeRpcError.transactionNotFound()

  const order = await loadOrder(txn.orderId)
  return {
    create_time: Number(txn.createTime),
    perform_time: Number(txn.performTime),
    cancel_time: Number(txn.cancelTime),
    transaction: txn.id,
    state: txn.state,
    reason: txn.reason,
    account: { order_id: order?.id ?? txn.orderId },
  }
}

async function getStatement(params: Record<string, unknown>) {
  const from = Number(params.from ?? 0)
  const to = Number(params.to ?? Date.now())

  const txns = await prisma.paymeTransaction.findMany({
    where: {
      createTime: { gte: BigInt(from), lte: BigInt(to) },
    },
    include: { order: true },
    take: 100,
  })

  const transactions = txns.map((t) => ({
    id: t.paymeId,
    time: Number(t.createTime),
    amount: t.order.amount * 100,
    account: { order_id: t.orderId },
    create_time: Number(t.createTime),
    perform_time: Number(t.performTime),
    cancel_time: Number(t.cancelTime),
    transaction: t.id,
    state: t.state,
    reason: t.reason,
  }))

  return { transactions }
}

export async function processPaymeWebhook(
  payload: unknown,
  headers: Record<string, string | string[] | undefined>
): Promise<PaymeRpcResponse> {
  const request = parsePaymeRpcRequest(payload)
  const id = request.id ?? null
  const auth = headers.authorization

  try {
    verifyPaymeAuthorization(auth)
    const method = String(request.method ?? '')
    const params = (request.params ?? {}) as Record<string, unknown>

    let result: Record<string, unknown>
    switch (method) {
      case 'CheckPerformTransaction':
        result = await checkPerformTransaction(params)
        break
      case 'CreateTransaction':
        result = await createTransaction(params)
        break
      case 'PerformTransaction':
        result = await performTransaction(params)
        break
      case 'CancelTransaction':
        result = await cancelTransaction(params)
        break
      case 'CheckTransaction':
        result = await checkTransaction(params)
        break
      case 'GetStatement':
        result = await getStatement(params)
        break
      default:
        throw PaymeRpcError.methodNotFound()
    }

    const orderId = extractOrderId((params.account ?? {}) as PaymeAccount)
    await logPaymentWebhook({
      provider: 'PAYME',
      orderId,
      status: 'processed',
      payload: { method, id: request.id },
    })

    return paymeSuccess(id, result)
  } catch (err) {
    if (err instanceof PaymeRpcError) {
      await logPaymentWebhook({
        provider: 'PAYME',
        status: 'failed',
        error: err.message,
        payload: request,
      })
      return err.toJsonRpc(id)
    }
    console.error('[payme-webhook]', err)
    await logPaymentWebhook({
      provider: 'PAYME',
      status: 'failed',
      error: err instanceof Error ? err.message : 'unknown',
      payload: request,
    })
    return PaymeRpcError.systemError().toJsonRpc(id)
  }
}
