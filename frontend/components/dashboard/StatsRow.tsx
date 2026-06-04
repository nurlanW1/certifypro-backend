'use client'

import { useEffect, useState } from 'react'
import { Calendar, Palette, Download, Crown, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  value: string
  label: string
  iconClass: string
}

function StatCard({ icon: Icon, value, label, iconClass }: StatCardProps) {
  return (
    <div className="gildia-card flex items-center gap-4 p-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-text-primary">{value}</p>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  )
}

interface AnalyticsPayload {
  planName: string
  usage: { eventsCount: number; designsCount: number; exportsCount: number }
  remaining: { exports: number }
  participantsTotal: number
}

export function StatsRow() {
  const [data, setData] = useState<AnalyticsPayload | null>(null)

  useEffect(() => {
    void fetch('/api/analytics/me')
      .then((r) => r.json())
      .then((d: { analytics?: AnalyticsPayload }) => setData(d.analytics ?? null))
      .catch(() => setData(null))
  }, [])

  const usage = data?.usage
  const exportsLabel = usage
    ? `${usage.exportsCount} / ${usage.exportsCount + (data?.remaining.exports ?? 0)}`
    : '—'

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Calendar}
        value={usage ? String(usage.eventsCount) : '—'}
        label="Tadbir"
        iconClass="bg-brand-50 text-brand-600"
      />
      <StatCard
        icon={Palette}
        value={usage ? String(usage.designsCount) : '—'}
        label="Dizayn"
        iconClass="bg-brand-50 text-brand-600"
      />
      <StatCard
        icon={Download}
        value={exportsLabel}
        label="Eksport (oy)"
        iconClass="bg-success-light text-success-dark"
      />
      <StatCard
        icon={Users}
        value={data ? String(data.participantsTotal) : '—'}
        label="Ishtirokchi"
        iconClass="bg-brand-50 text-brand-600"
      />
      {data && (
        <div className="gildia-card flex items-center gap-4 p-4 sm:col-span-2 xl:col-span-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning-light text-warning-dark">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">{data.planName}</p>
            <p className="text-sm text-text-muted">
              Qolgan eksportlar: {data.remaining.exports}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
