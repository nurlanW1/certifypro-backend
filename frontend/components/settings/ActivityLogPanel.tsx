'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

interface Activity {
  id: string
  action: string
  entityType: string | null
  entityId: string | null
  createdAt: string
}

const ACTION_LABELS: Record<string, string> = {
  'event.created': 'Tadbir yaratildi',
  'participants.imported': 'Ishtirokchilar import',
  'bulk.certificates': 'Ommaviy sertifikat',
  'checkout.started': 'To‘lov boshlandi',
  'payment.paid': 'To‘lov qabul qilindi',
  'plan.upgraded': 'Reja yangilandi',
  'org.created': 'Agentlik yaratildi',
}

export function ActivityLogPanel() {
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetch('/api/activity')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { activities?: Activity[] } | null) => setItems(d?.activities ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-text-primary">So‘nggi harakatlar</h2>
      {loading ? (
        <p className="mt-3 text-sm text-text-muted">Yuklanmoqda...</p>
      ) : items.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">Hali yozuv yo‘q</p>
      ) : (
        <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex justify-between gap-2 border-b border-border py-2 text-sm last:border-0"
            >
              <span className="text-text-primary">
                {ACTION_LABELS[a.action] ?? a.action}
              </span>
              <span className="shrink-0 text-xs text-text-muted">
                {formatDate(a.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
