'use client'

import Link from 'next/link'
import { CalendarPlus } from 'lucide-react'
import { EventMaterialsGrid } from '@/components/events/EventMaterialsGrid'
import { EventAnalyticsPanel } from '@/components/events/EventAnalyticsPanel'
import { EventSuggestionsPanel } from '@/components/events/EventSuggestionsPanel'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'

export default function EventDetailPage() {
  const { event } = useEventWorkspace()

  const readyCount = event.materials?.filter((m) => m.status === 'READY').length ?? 0
  const total = event.materialCount ?? event.materials?.length ?? 0

  return (
    <div className="space-y-6">
      <EventAnalyticsPanel />
      <EventSuggestionsPanel />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Materiallar
          </p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">{total}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Tayyor</p>
          <p className="mt-1 text-2xl font-semibold text-success-dark">{readyCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Qolgan</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            {Math.max(0, total - readyCount)}
          </p>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">So‘nggi materiallar</h2>
        <EventMaterialsGrid event={event} />
      </div>

      <Card className="border-dashed border-brand-200 bg-brand-50/50 p-6">
        <p className="font-medium text-brand-900">Tadbir markazi</p>
        <p className="mt-1 text-sm text-text-muted">
          Brending, eksport va sozlamalar yuqoridagi tablardan boshqariladi.
        </p>
        <Link href={`/events/${event.id}/materials`} className="mt-4 inline-flex">
          <Button>
            <CalendarPlus className="h-4 w-4" />
            Barcha materiallar
          </Button>
        </Link>
      </Card>
    </div>
  )
}
