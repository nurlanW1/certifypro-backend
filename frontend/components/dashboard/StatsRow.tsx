'use client'

import { useEffect, useState } from 'react'
import { Calendar, Palette, Download, Crown, Users } from 'lucide-react'

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

  const stats = [
    { label: 'Tadbirlar', value: usage ? String(usage.eventsCount) : '—', icon: Calendar },
    { label: 'Dizaynlar', value: usage ? String(usage.designsCount) : '—', icon: Palette },
    { label: 'Eksportlar', value: exportsLabel, icon: Download },
    { label: 'Ishtirokchi', value: data ? String(data.participantsTotal) : '—', icon: Users },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 divide-x divide-divide border-b border-divide md:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="p-6">
            <div className="mb-1 text-3xl font-semibold tracking-tight text-text-primary">
              {value}
            </div>
            <div className="label-caps">{label}</div>
          </div>
        ))}
      </div>

      {data && (
        <div className="flex items-center gap-4 border-b border-divide p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-accent-dim text-accent-hover">
            <Crown className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{data.planName}</p>
            <p className="text-xs text-text-tertiary">
              Qolgan eksportlar: {data.remaining.exports}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
