'use client'

import { useEffect, useState } from 'react'
import { ExportTrendChart } from '@/components/dashboard/ExportTrendChart'

export function DashboardTrend() {
  const [trend, setTrend] = useState<{ date: string; exports: number }[]>([])

  useEffect(() => {
    void fetch('/api/analytics/me')
      .then((r) => r.json())
      .then(
        (d: { analytics?: { exportTrend?: { date: string; exports: number }[] } }) => {
          setTrend(d.analytics?.exportTrend ?? [])
        }
      )
  }, [])

  if (trend.length === 0) return null
  return <ExportTrendChart trend={trend} />
}
