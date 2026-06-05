'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EventWorkspaceContext } from '@/contexts/EventWorkspaceContext'
import { useEvent } from '@/hooks/useEvent'
import { formatDate, cn } from '@/lib/utils'
import type { Event, EventType } from '@/types/event'

const TAB_IDS = [
  { id: 'overview', suffix: '' },
  { id: 'materials', suffix: '/materials' },
  { id: 'participants', suffix: '/participants' },
  { id: 'branding', suffix: '/branding' },
  { id: 'export', suffix: '/export' },
  { id: 'settings', suffix: '/settings' },
] as const

function activeTabFromPath(pathname: string, eventId: string): string {
  const base = `/events/${eventId}`
  if (pathname === `${base}/materials`) return 'materials'
  if (pathname === `${base}/participants`) return 'participants'
  if (pathname === `${base}/branding`) return 'branding'
  if (pathname === `${base}/export`) return 'export'
  if (pathname === `${base}/settings`) return 'settings'
  return 'overview'
}

function tabLabelKey(
  id: string
): 'tabOverview' | 'materials' | 'tabParticipants' | 'tabBranding' | 'tabExport' | 'tabSettings' {
  if (id === 'overview') return 'tabOverview'
  if (id === 'materials') return 'materials'
  if (id === 'participants') return 'tabParticipants'
  if (id === 'branding') return 'tabBranding'
  if (id === 'export') return 'tabExport'
  return 'tabSettings'
}

export function EventWorkspaceShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('events')
  const tWizard = useTranslations('eventWizard')
  const params = useParams()
  const pathname = usePathname()
  const eventId = params.eventId as string
  const { event, loading, error } = useEvent(eventId)
  const [eventState, setEventState] = useState<Event | null>(null)
  const displayEvent = eventState ?? event

  useEffect(() => {
    if (event) setEventState(event)
  }, [event])

  const refresh = useCallback(() => {
    void fetch(`/api/events/${eventId}`)
      .then((r) => r.json())
      .then((d: { event: Event }) => setEventState(d.event))
      .catch(() => {})
  }, [eventId])

  const activeTab = activeTabFromPath(pathname, eventId)

  const eventTypeLabel = (type: EventType) => {
    try {
      return tWizard(`types.${type}`)
    } catch {
      return type
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-surface-tertiary" />
        <div className="h-8 animate-pulse rounded-lg bg-surface-tertiary" />
        <div className="h-48 animate-pulse rounded-xl bg-surface-tertiary" />
      </div>
    )
  }

  if (error || !displayEvent) {
    return (
      <div className="gildia-card mx-auto max-w-lg p-8 text-center">
        <p className="text-text-primary">{error ?? t('eventNotFound')}</p>
        <Link href="/events" className="mt-4 inline-block text-sm font-medium text-brand-600">
          ← {t('backToEvents')}
        </Link>
      </div>
    )
  }

  return (
    <EventWorkspaceContext.Provider
      value={{
        event: displayEvent,
        loading: false,
        error: null,
        refresh,
      }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <Badge>{eventTypeLabel(displayEvent.type)}</Badge>
            <h1 className="mt-2 text-2xl font-semibold text-text-primary">{displayEvent.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-text-secondary">
              {displayEvent.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(displayEvent.date)}
                </span>
              )}
              {displayEvent.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {displayEvent.location}
                </span>
              )}
            </div>
          </div>
          <div
            className="h-12 w-12 shrink-0 rounded-xl border border-border"
            style={{ backgroundColor: displayEvent.primaryColor }}
            aria-hidden
          />
        </div>

        <nav className="flex flex-wrap gap-1 border-b border-border pb-px">
          {TAB_IDS.map((tab) => {
            const href = `/events/${eventId}${tab.suffix}`
            const isActive = activeTab === tab.id
            return (
              <Link
                key={tab.id}
                href={href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-b-2 border-brand-600 text-brand-600'
                    : 'text-text-tertiary hover:text-text-primary'
                )}
              >
                {t(tabLabelKey(tab.id))}
                {tab.id === 'materials' && displayEvent.materialCount != null && (
                  <span className="ml-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-800">
                    {displayEvent.materialCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {children}
      </div>
    </EventWorkspaceContext.Provider>
  )
}
