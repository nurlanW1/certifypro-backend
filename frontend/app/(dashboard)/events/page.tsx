'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarPlus, Search } from 'lucide-react'
import { EventCard } from '@/components/events/EventCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Event } from '@/types/event'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    void fetch('/api/events')
      .then((r) => r.json())
      .then((d: { events: Event[] }) => {
        setEvents(d.events ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return events
    return events.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.organization.toLowerCase().includes(q)
    )
  }, [events, search])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Tadbirlarim</h1>
          <p className="mt-0.5 text-sm text-text-muted">{events.length} ta tadbir</p>
        </div>
        <Link href="/events/new" className="gildia-btn-primary inline-flex items-center gap-2">
          <CalendarPlus className="h-4 w-4" />
          Yangi tadbir
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          className="gildia-input pl-9"
          placeholder="Tadbir qidiring..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Tadbir qidirish"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-surface-tertiary" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title={events.length === 0 ? "Hali tadbir yo'q" : 'Natija topilmadi'}
          description={
            events.length === 0
              ? 'Birinchi tadbiringizni yarating va barcha materiallarni bir joyda boshqaring'
              : 'Boshqa kalit so‘z bilan qidiring'
          }
          actionLabel={events.length === 0 ? 'Yangi tadbir yaratish' : undefined}
          onAction={
            events.length === 0
              ? () => {
                  window.location.href = '/events/new'
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              materialCount={event.materialCount ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
