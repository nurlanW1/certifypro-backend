'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { EventCard } from '@/components/events/EventCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useEvent } from '@/hooks/useEvent'

export default function EventsPage() {
  const { events, fetchEvents, loading } = useEvent()

  useEffect(() => {
    void fetchEvents()
  }, [fetchEvents])

  return (
    <>
      <TopBar title="Tadbirlar" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex justify-end">
          <Link href="/events/new">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              Yangi tadbir
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="Tadbirlar yo'q"
            description="Birinchi tadbiringizni yarating"
            actionLabel="Yangi tadbir"
            onAction={() => {
              window.location.href = '/events/new'
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
