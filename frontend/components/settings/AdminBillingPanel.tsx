'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

interface PaymeTxn {
  paymeId: string
  state: number
  orderId: string
  plan: string
  amount: number
  orderStatus: string
  userEmail: string
  createTime: number
}

export function AdminBillingPanel() {
  const [txns, setTxns] = useState<PaymeTxn[]>([])
  const [logs, setLogs] = useState<
    { id: string; provider: string; status: string; orderId: string | null; createdAt: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/payme/statement').then((r) => {
        if (r.status === 403) {
          setForbidden(true)
          return { transactions: [] }
        }
        return r.json()
      }),
      fetch('/api/admin/payment-logs').then((r) => {
        if (r.status === 403) return { logs: [] }
        return r.json()
      }),
    ])
      .then(([s, l]) => {
        setTxns((s as { transactions?: PaymeTxn[] }).transactions ?? [])
        setLogs((l as { logs?: typeof logs }).logs ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (forbidden) return null
  if (loading) return <Spinner className="py-6" />

  return (
    <div className="space-y-4">
      <Card className="border-warning/30 p-5">
        <h2 className="text-sm font-semibold text-text-primary">Platform admin</h2>
        <p className="mt-1 text-xs text-text-muted">Payme statement (oxirgi 30 kun)</p>
        {txns.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">Tranzaksiyalar yo‘q</p>
        ) : (
          <div className="mt-3 max-h-48 overflow-auto text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-text-muted">
                  <th className="py-1 text-left">Email</th>
                  <th className="py-1">Holat</th>
                  <th className="py-1 text-right">Summa</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.paymeId} className="border-t border-border/50">
                    <td className="py-1">{t.userEmail}</td>
                    <td className="py-1 text-center">{t.orderStatus}</td>
                    <td className="py-1 text-right">
                      {t.amount.toLocaleString('uz-UZ')}
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
          <h3 className="text-sm font-semibold">Barcha webhooklar</h3>
          <ul className="mt-2 max-h-40 overflow-auto text-xs text-text-muted">
            {logs.slice(0, 20).map((l) => (
              <li key={l.id}>
                {l.provider} {l.status} {new Date(l.createdAt).toLocaleString('uz-UZ')}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
