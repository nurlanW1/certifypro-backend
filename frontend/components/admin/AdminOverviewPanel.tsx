'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

interface Overview {
  totals: {
    users: number
    events: number
    designs: number
    participants: number
    templates: number
    organizations: number
  }
  month: { exports: number; paidOrders: number; revenueUzs: number }
  pendingOrders: number
  planBreakdown: { plan: string; count: number }[]
  recentPaidOrders: {
    id: string
    plan: string
    amount: number
    userEmail: string
    paidAt: string | null
  }[]
}

export function AdminOverviewPanel() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [forbidden, setForbidden] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetch('/api/admin/overview')
      .then((r) => {
        if (r.status === 403) {
          setForbidden(true)
          return null
        }
        return r.json()
      })
      .then((d: { overview?: Overview } | null) => setOverview(d?.overview ?? null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner className="py-16" />

  if (forbidden) {
    return (
      <Card className="p-8 text-center">
        <p className="text-text-primary">Admin ruxsati yo‘q.</p>
        <p className="mt-2 text-sm text-text-muted">
          `GILDIA_ADMIN_EMAILS` da emailingiz bo‘lishi kerak.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-accent hover:text-accent-hover">
          Bosh sahifa
        </Link>
      </Card>
    )
  }

  if (!overview) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-7 w-7 text-accent" />
        <h1 className="text-2xl font-semibold text-text-primary">Platform admin</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Foydalanuvchilar" value={overview.totals.users} />
        <Stat label="Tadbirlar" value={overview.totals.events} />
        <Stat label="Ishtirokchilar" value={overview.totals.participants} />
        <Stat label="Dizaynlar" value={overview.totals.designs} />
        <Stat label="Shablonlar" value={overview.totals.templates} />
        <Stat label="Agentliklar" value={overview.totals.organizations} />
      </div>

      <Card className="p-5">
        <h2 className="font-semibold text-text-primary">Shu oy</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Stat label="Eksportlar" value={overview.month.exports} />
          <Stat label="To‘lovlar" value={overview.month.paidOrders} />
          <Stat
            label="Daromad (UZS)"
            value={overview.month.revenueUzs.toLocaleString('uz-UZ')}
          />
        </div>
        <p className="mt-2 text-xs text-text-muted">
          Kutilayotgan buyurtmalar: {overview.pendingOrders}
        </p>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold text-text-primary">Rejalar</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {overview.planBreakdown.map((p) => (
            <li key={p.plan}>
              {p.plan}: {p.count}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold text-text-primary">So‘nggi to‘lovlar</h2>
        <ul className="mt-2 max-h-48 overflow-auto text-xs text-text-muted">
          {overview.recentPaidOrders.map((o) => (
            <li key={o.id} className="border-b border-divide/60 py-1">
              {o.userEmail} — {o.plan} — {o.amount.toLocaleString('uz-UZ')} UZS
            </li>
          ))}
        </ul>
        <Link
          href="/settings/billing"
          className="mt-3 inline-block text-sm text-accent hover:text-accent-hover"
        >
          Billing sozlamalar →
        </Link>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="gildia-card p-4">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-xl font-semibold text-text-primary">{value}</p>
    </div>
  )
}
