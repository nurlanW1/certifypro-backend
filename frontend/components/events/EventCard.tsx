'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { EVENT_TYPE_LABELS } from '@/types/event'
import type { Event } from '@/types/event'

interface EventCardProps {
  event: Event
  materialCount?: number
}

export function EventCard({ event, materialCount = 0 }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className="block">
      <article className="gildia-card group cursor-pointer overflow-hidden transition-all duration-150 hover:shadow-md">
        <div
          className="h-1 w-full"
          style={{ backgroundColor: event.primaryColor }}
          aria-hidden
        />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-text-primary transition-colors group-hover:text-brand-600">
              {event.name}
            </h3>
            <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-800">
              {EVENT_TYPE_LABELS[event.type]}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-text-muted">
            {event.date && (
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                {formatDate(event.date)}
              </p>
            )}
            {event.location && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </p>
            )}
            {event.participantCount != null && event.participantCount > 0 && (
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0" />
                {event.participantCount} ishtirokchi
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-text-muted">
              Materiallar:{' '}
              <span className="font-medium text-text-secondary">{materialCount || '—'}</span>
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-brand-600">
              Ochish
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
