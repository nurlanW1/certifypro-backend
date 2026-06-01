'use client'

import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { EVENT_TYPE_LABELS, type Event } from '@/types/event'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-medium text-text-primary">{event.name}</h3>
          <Badge>{EVENT_TYPE_LABELS[event.type]}</Badge>
        </div>
        <div className="space-y-1.5 text-sm text-text-muted">
          {event.date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(event.date)}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
