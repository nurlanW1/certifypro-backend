'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { ArrowRight, CalendarPlus, Filter, Grid, List, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { EventCardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Event, EventType } from '@/types/event'

export default function EventsPage() {
  const t = useTranslations('events')
  const tWizard = useTranslations('eventWizard')
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [search, setSearch] = useState('')

  useEffect(() => {
    void fetch('/api/events')
      .then((r) => r.json())
      .then((d: { events: Event[] }) => setEvents(d.events ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return events
    return events.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.organization?.toLowerCase().includes(q)
    )
  }, [events, search])

  const eventTypeLabel = (type: EventType) => {
    try {
      return tWizard(`types.${type}`)
    } catch {
      return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-divide pb-6">
        <div>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-text-primary">
            {t('title')}
          </h1>
          <p className="text-sm text-text-secondary">{t('projectsCount', { count: events.length })}</p>
        </div>
        <Link href="/events/new" className="btn-primary btn-md inline-flex items-center gap-2">
          <CalendarPlus size={14} />
          {t('newEvent')}
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="input py-2 pl-9 text-sm"
          />
        </div>
        <button type="button" className="btn-secondary btn-sm inline-flex items-center gap-1.5">
          <Filter size={13} />
          {t('filter')}
        </button>
        <div className="flex overflow-hidden rounded border border-divide">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`px-3 py-2 transition-colors ${
              view === 'list'
                ? 'bg-subtle text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`border-l border-divide px-3 py-2 transition-colors ${
              view === 'grid'
                ? 'bg-subtle text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Grid size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="overflow-hidden rounded border border-divide">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title={events.length === 0 ? t('noEvents') : t('noResults')}
          description={events.length === 0 ? t('createFirst') : t('noResultsDesc')}
          actionLabel={events.length === 0 ? t('newEvent') : undefined}
          onAction={events.length === 0 ? () => router.push('/events/new') : undefined}
        />
      ) : view === 'list' ? (
        <div className="overflow-hidden rounded border border-divide">
          <div className="grid grid-cols-12 border-b border-divide bg-subtle px-5 py-3">
            {[
              { label: t('eventName'), span: 'col-span-4' },
              { label: t('style'), span: 'col-span-2' },
              { label: t('materials'), span: 'col-span-2' },
              { label: t('date'), span: 'col-span-2' },
              { label: t('status'), span: 'col-span-1' },
              { label: '', span: 'col-span-1' },
            ].map(({ label, span }) => (
              <div key={label || 'action'} className={`label-caps ${span}`}>
                {label}
              </div>
            ))}
          </div>

          {filtered.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group grid grid-cols-12 items-center border-b border-divide px-5 py-4 transition-colors last:border-0 hover:bg-subtle"
            >
              <div className="col-span-4 flex min-w-0 items-center gap-3">
                <div className="h-8 w-2 shrink-0 rounded-sm bg-accent-dim" />
                <p className="truncate text-sm font-medium text-text-primary">{event.name}</p>
              </div>
              <div className="col-span-2">
                <span className="tag tag-default">{eventTypeLabel(event.type)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-text-secondary">
                  {event.materialCount ?? 0} {t('designs')}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-text-secondary">
                  {event.date ? formatDate(event.date) : '—'}
                </span>
              </div>
              <div className="col-span-1">
                <span className="tag tag-ok">{t('active')}</span>
              </div>
              <div className="col-span-1 flex justify-end">
                <ArrowRight
                  size={14}
                  className="text-text-tertiary transition-colors group-hover:text-text-secondary"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group block rounded border border-divide p-5 transition-colors hover:bg-subtle"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-divide bg-subtle text-sm font-semibold text-text-tertiary">
                  {event.name.charAt(0)}
                </div>
                <span className="tag tag-ok">{t('active')}</span>
              </div>
              <h3 className="mb-1 truncate text-sm font-semibold text-text-primary">{event.name}</h3>
              <p className="mb-4 text-sm text-text-tertiary">
                {event.date ? formatDate(event.date) : t('noDate')}
                {event.location ? ` · ${event.location}` : ''}
              </p>
              <div className="flex items-center justify-between">
                <span className="tag tag-default">{eventTypeLabel(event.type)}</span>
                <ArrowRight
                  size={13}
                  className="text-text-tertiary transition-colors group-hover:text-text-secondary"
                />
              </div>
            </Link>
          ))}
          <Link
            href="/events/new"
            className="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded border border-dashed border-divide p-5 text-text-tertiary transition-all hover:border-text-tertiary hover:bg-subtle hover:text-text-secondary"
          >
            <CalendarPlus size={20} />
            <span className="text-sm font-medium">{t('newEvent')}</span>
          </Link>
        </div>
      )}
    </div>
  )
}
