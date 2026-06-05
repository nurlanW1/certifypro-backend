'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowRight, CalendarPlus, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'
import { EventCardSkeleton } from '@/components/ui/Skeleton'
import { EVENT_TYPE_LABELS } from '@/types/event'
import type { Event } from '@/types/event'

export function RecentEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetch('/api/events')
      .then((r) => r.json())
      .then((d: { events: Event[] }) => {
        setEvents(d.events ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const recent = events.slice(0, 3)

  return (
    <section>
      <div className="flex items-center justify-between border-b border-divide py-4">
        <p className="label-caps">So&apos;nggi tadbirlar</p>
        <Link
          href="/events"
          className="flex items-center gap-1 text-xs text-text-tertiary transition-colors hover:text-text-secondary"
        >
          Barchasini ko&apos;rish
          <ArrowRight size={11} />
        </Link>
      </div>

      {loading ? (
        <div>
          {[1, 2, 3].map((i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={CalendarPlus}
            title="Hali tadbir yo'q"
            description="Birinchi tadbiringizni yarating"
            actionLabel="Yangi tadbir"
            onAction={() => {
              window.location.href = '/events/new'
            }}
          />
        </div>
      ) : (
        <div>
          {recent.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group flex cursor-pointer items-center gap-4 border-b border-divide py-4 transition-colors hover:bg-subtle"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-subtle text-xs font-medium text-text-tertiary"
                style={event.primaryColor ? { backgroundColor: event.primaryColor } : undefined}
              >
                {!event.primaryColor && event.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{event.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-text-tertiary">
                  <Clock size={10} />
                  {event.date ? formatDate(event.date) : 'Sana belgilanmagan'}
                  {event.location ? ` · ${event.location}` : ''}
                </p>
              </div>
              <span className="tag tag-default text-xs">
                {EVENT_TYPE_LABELS[event.type]}
              </span>
              <ArrowRight
                size={13}
                className="shrink-0 text-text-disabled transition-colors group-hover:text-text-tertiary"
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
