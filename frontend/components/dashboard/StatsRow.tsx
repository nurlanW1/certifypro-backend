'use client'

import { useEffect, useState } from 'react'
import { Calendar, Palette, Download, Crown } from 'lucide-react'
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

export function StatsRow() {
  const [eventCount, setEventCount] = useState(0)
  const [designCount, setDesignCount] = useState(0)

  useEffect(() => {
    void Promise.all([
      fetch('/api/events').then((r) => r.json()),
      fetch('/api/designs').then((r) => r.json()),
    ]).then(([eventsData, designsData]) => {
      setEventCount((eventsData as { events?: unknown[] }).events?.length ?? 0)
      setDesignCount((designsData as { designs?: unknown[] }).designs?.length ?? 0)
    })
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Calendar}
        value={String(eventCount)}
        label="Tadbir"
        iconClass="bg-brand-50 text-brand-600"
      />
      <StatCard
        icon={Palette}
        value={String(designCount)}
        label="Dizayn"
        iconClass="bg-brand-50 text-brand-600"
      />
      <StatCard
        icon={Download}
        value={String(designCount * 4)}
        label="Eksport"
        iconClass="bg-success-light text-success-dark"
      />
      <StatCard
        icon={Crown}
        value="Free"
        label="Rejim"
        iconClass="bg-warning-light text-warning-dark"
      />
    </div>
  )
}
