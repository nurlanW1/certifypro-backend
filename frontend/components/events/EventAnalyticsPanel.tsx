'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'

interface EventAnalytics {
  participantsCount: number
  materialsReady: number
  materialsTotal: number
  exportsThisMonth: number
  certificateEmailsSent: number
  claimLinksIssued: number
  certificateMaterialReady: boolean
  badgeMaterialReady: boolean
  nameTagMaterialReady: boolean
}

export function EventAnalyticsPanel() {
  const { event } = useEventWorkspace()
  const [data, setData] = useState<EventAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetch(`/api/analytics/events/${event.id}`)
      .then((r) => r.json())
      .then((d: { analytics?: EventAnalytics }) => setData(d.analytics ?? null))
      .finally(() => setLoading(false))
  }, [event.id])

  if (loading) return <Spinner className="py-6" />
  if (!data) return null

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-text-primary">Tadbir statistikasi</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Ishtirokchilar" value={String(data.participantsCount)} />
        <MiniStat
          label="Materiallar"
          value={`${data.materialsReady}/${data.materialsTotal}`}
        />
        <MiniStat label="Eksport (oy)" value={String(data.exportsThisMonth)} />
        <MiniStat label="Email yuborilgan" value={String(data.certificateEmailsSent)} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Claim havolalari: {data.claimLinksIssued} · Sertifikat:{' '}
        {data.certificateMaterialReady ? 'tayyor' : 'yo‘q'} · Nishon:{' '}
        {data.badgeMaterialReady ? 'tayyor' : 'yo‘q'} · Ism tag:{' '}
        {data.nameTagMaterialReady ? 'tayyor' : 'yo‘q'}
      </p>
    </Card>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-secondary px-3 py-2">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-semibold text-text-primary">{value}</p>
    </div>
  )
}
