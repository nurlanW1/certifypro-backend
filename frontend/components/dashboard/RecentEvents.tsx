'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarPlus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'
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
    <section className="gildia-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">So&apos;nggi tadbirlar</h2>
        <Link
          href="/events"
          className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          Barchasini ko&apos;rish
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-tertiary" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="Hali tadbir yo'q"
          description="Birinchi tadbiringizni yarating"
          actionLabel="Yangi tadbir"
          onAction={() => {
            window.location.href = '/events/new'
          }}
        />
      ) : (
        <ul className="space-y-3">
          {recent.map((event) => (
            <li key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-all duration-150 hover:border-brand-200 hover:bg-brand-50/30"
              >
                <span
                  className="h-10 w-10 shrink-0 rounded-full border-2 border-surface shadow-xs"
                  style={{ backgroundColor: event.primaryColor }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-text-primary">{event.name}</p>
                    <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs text-text-secondary">
                      {EVENT_TYPE_LABELS[event.type]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-text-muted">
                    {event.date ? formatDate(event.date) : 'Sana belgilanmagan'}
                    {event.location ? ` · ${event.location}` : ''}
                  </p>
                </div>
                <span className="hidden text-sm font-medium text-brand-600 sm:inline">
                  Ochish →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
