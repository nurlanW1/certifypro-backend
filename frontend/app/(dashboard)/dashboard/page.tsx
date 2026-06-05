'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarPlus,
  Clock,
  Download,
  Layout,
  Layers,
  Zap,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { EventCardSkeleton } from '@/components/ui/Skeleton'
import { EVENT_TYPE_LABELS } from '@/types/event'
import type { Event } from '@/types/event'

interface Analytics {
  usage: { eventsCount: number; designsCount: number; exportsCount: number }
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void Promise.all([
      fetch('/api/events').then((r) => r.json()),
      fetch('/api/analytics/me').then((r) => r.json()),
    ])
      .then(([eventsData, analyticsData]) => {
        setEvents(eventsData.events ?? [])
        setAnalytics(analyticsData.analytics ?? null)
      })
      .finally(() => setLoading(false))
  }, [])

  const recent = events.slice(0, 3)
  const usage = analytics?.usage

  const stats = [
    {
      label: 'Jami tadbirlar',
      value: usage ? String(usage.eventsCount) : String(events.length),
      trend: `${events.length} faol`,
      icon: CalendarPlus,
    },
    {
      label: 'Jami dizaynlar',
      value: usage ? String(usage.designsCount) : '—',
      trend: 'barcha vaqt',
      icon: Layout,
    },
    {
      label: 'Eksportlar',
      value: usage ? String(usage.exportsCount) : '—',
      trend: 'bu oy',
      icon: Download,
    },
    {
      label: 'Tejangan vaqt',
      value: '24h',
      trend: 'taxminan',
      icon: Clock,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-8 border-b border-divide pb-8">
        <div>
          <p className="label-caps mb-2">Xush kelibsiz</p>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-text-primary">
            Bugun nima qilamiz?
          </h1>
          <p className="max-w-md text-sm text-text-secondary">
            Yangi tadbir yarating yoki mavjud dizaynlaringizni davom ettiring.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/templates" className="btn-secondary btn-md inline-flex items-center gap-2">
            <Layout size={14} />
            Shablonlar
          </Link>
          <Link href="/events/new" className="btn-primary btn-md inline-flex items-center gap-2">
            <CalendarPlus size={14} />
            Yangi tadbir
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px rounded border border-divide bg-divide lg:grid-cols-4">
        {stats.map(({ label, value, trend, icon: Icon }) => (
          <div key={label} className="bg-canvas p-6 transition-colors hover:bg-subtle">
            <div className="mb-4 flex items-start justify-between">
              <Icon size={16} className="text-text-disabled" />
              <span className="text-xs text-text-disabled">{trend}</span>
            </div>
            <div className="mb-1 text-3xl font-semibold tracking-tight text-text-primary">
              {value}
            </div>
            <p className="label-caps">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="overflow-hidden rounded border border-divide xl:col-span-2">
          <div className="flex items-center justify-between border-b border-divide px-5 py-4">
            <p className="text-sm font-semibold text-text-primary">So&apos;nggi tadbirlar</p>
            <Link
              href="/events"
              className="flex items-center gap-1 text-xs text-text-disabled transition-colors hover:text-text-secondary"
            >
              Barchasini ko&apos;rish <ArrowRight size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-12 border-b border-divide bg-subtle px-5 py-2.5">
            {['Tadbir', 'Uslub', 'Sana', 'Status', ''].map((h, i) => (
              <div
                key={h}
                className={`label-caps ${
                  i === 0
                    ? 'col-span-5'
                    : i === 1
                      ? 'col-span-2'
                      : i === 2
                        ? 'col-span-2'
                        : i === 3
                          ? 'col-span-2'
                          : 'col-span-1'
                }`}
              >
                {h}
              </div>
            ))}
          </div>

          {loading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : recent.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-text-tertiary">
              Hali tadbir yo&apos;q.{' '}
              <Link href="/events/new" className="text-accent hover:text-accent-hover">
                Birinchi tadbirni yarating
              </Link>
            </div>
          ) : (
            recent.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group grid grid-cols-12 items-center border-b border-divide px-5 py-4 transition-colors last:border-0 hover:bg-subtle"
              >
                <div className="col-span-5 flex min-w-0 items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-divide bg-subtle text-xs font-semibold text-text-tertiary">
                    {event.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">{event.name}</p>
                    <p className="text-xs text-text-disabled">
                      {event.materialCount ?? 0} ta dizayn
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="tag tag-default">{EVENT_TYPE_LABELS[event.type]}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-text-secondary">
                    {event.date ? formatDate(event.date) : '—'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="tag tag-ok">Faol</span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <ArrowRight
                    size={13}
                    className="text-text-disabled transition-colors group-hover:text-text-tertiary"
                  />
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded border border-divide">
            <div className="border-b border-divide px-5 py-4">
              <p className="text-sm font-semibold text-text-primary">Tezkor harakatlar</p>
            </div>
            <div className="divide-y divide-divide">
              {[
                { icon: CalendarPlus, label: 'Yangi tadbir', desc: 'Noldan boshlash', href: '/events/new' },
                { icon: Layout, label: 'Shablon tanlash', desc: '48+ dizayn', href: '/templates' },
                { icon: Layers, label: 'Brand Kit', desc: 'Rang va font', href: '/settings' },
                { icon: Zap, label: 'AI bilan yozish', desc: 'Matn generatsiya', href: '/events/new' },
              ].map(({ icon: Icon, label, desc, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-subtle"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-divide bg-subtle transition-all group-hover:border-accent-border group-hover:bg-accent-dim">
                    <Icon
                      size={13}
                      className="text-text-tertiary transition-colors group-hover:text-accent"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{label}</p>
                    <p className="text-xs text-text-disabled">{desc}</p>
                  </div>
                  <ArrowRight
                    size={12}
                    className="shrink-0 text-text-disabled transition-colors group-hover:text-text-tertiary"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded border border-divide p-5">
            <p className="label-caps mb-3">Aktiv uslub</p>
            <div className="grid grid-cols-3 gap-px rounded border border-divide bg-divide">
              {[
                { id: 'MIN', label: 'Minimal', dot: 'bg-text-primary' },
                { id: 'CLS', label: 'Klassik', dot: 'bg-warn' },
                { id: 'HIT', label: 'Hi-Tech', dot: 'bg-accent', active: true },
              ].map(({ id, label, dot, active }) => (
                <button
                  key={id}
                  type="button"
                  className={`bg-canvas py-2.5 text-xs font-medium transition-colors hover:bg-subtle ${
                    active ? 'text-text-primary' : 'text-text-disabled'
                  }`}
                >
                  <div className={`mx-auto mb-1.5 h-1.5 w-1.5 rounded-full ${dot}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
