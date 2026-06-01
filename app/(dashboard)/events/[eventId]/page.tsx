'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EVENT_TYPE_LABELS } from '@/types/event'
import { useEventStore } from '@/store/eventStore'
import { formatDate } from '@/lib/utils'

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const router = useRouter()
  const event = useEventStore((s) => s.events.find((e) => e.id === eventId))

  if (!event) {
    return (
      <>
        <TopBar title="Tadbir" />
        <div className="p-6">
          <Card>
            <p className="text-text-muted">Tadbir topilmadi</p>
            <Button className="mt-4" onClick={() => router.push('/events')}>
              Orqaga
            </Button>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar title={event.name} />
      <div className="flex-1 overflow-auto p-6">
        <Card className="max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Badge>{EVENT_TYPE_LABELS[event.type]}</Badge>
          </div>
          {event.date && (
            <p className="text-sm text-text-secondary">
              Sana: {formatDate(event.date)}
            </p>
          )}
          {event.location && (
            <p className="mt-1 text-sm text-text-secondary">Joy: {event.location}</p>
          )}
          <div className="mt-6">
            <Link href={`/events/${eventId}/materials`}>
              <Button>Materiallar</Button>
            </Link>
          </div>
        </Card>
      </div>
    </>
  )
}
