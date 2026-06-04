'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

interface OrderRow {
  id: string
  plan: string
  amount: number
  currency: string
  provider: string | null
  status: string
  paidAt: string | null
  createdAt: string
}

interface WebhookLogRow {
  id: string
  provider: string
  orderId: string | null
  status: string
  error: string | null
  createdAt: string
}

export function BillingHistoryPanel() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [logs, setLogs] = useState<WebhookLogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/billing/orders').then((r) => r.json()),
      fetch('/api/billing/webhook-logs').then((r) => r.json()),
    ])
      .then(([o, l]) => {
        setOrders((o as { orders?: OrderRow[] }).orders ?? [])
        setLogs((l as { logs?: WebhookLogRow[] }).logs ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner className="py-8" />

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="font-semibold text-text-primary">To‘lovlar tarixi</h2>
        {orders.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            Hali buyurtmalar yo‘q.{' '}
            <Link href="/upgrade" className="text-brand-600 hover:underline">
              Pro rejimga o‘ting
            </Link>
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-2 pr-4">Reja</th>
                  <th className="py-2 pr-4">Summa</th>
                  <th className="py-2 pr-4">Holat</th>
                  <th className="py-2">Sana</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/60">
                    <td className="py-2 pr-4">{o.plan}</td>
                    <td className="py-2 pr-4">
                      {o.amount.toLocaleString('uz-UZ')} {o.currency}
                    </td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-2 text-text-muted">
                      {new Date(o.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {logs.length > 0 && (
        <Card className="p-5">
          <h2 className="font-semibold text-text-primary">Webhook jurnali</h2>
          <ul className="mt-3 space-y-2 text-xs text-text-muted">
            {logs.slice(0, 10).map((l) => (
              <li key={l.id} className="rounded bg-surface-secondary px-2 py-1.5">
                {l.provider} · {l.status}
                {l.orderId ? ` · ${l.orderId.slice(0, 8)}…` : ''}
                {l.error ? ` · ${l.error}` : ''} ·{' '}
                {new Date(l.createdAt).toLocaleString('uz-UZ')}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'PAID'
      ? 'text-success'
      : status === 'PENDING'
        ? 'text-warning-dark'
        : 'text-text-muted'
  return <span className={cls}>{status}</span>
}
