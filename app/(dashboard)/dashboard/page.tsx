'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Plus, Calendar, LayoutTemplate } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { EventCard } from '@/components/events/EventCard'
import { useEvent } from '@/hooks/useEvent'

export default function DashboardPage() {
  const { events, fetchEvents, loading } = useEvent()

  useEffect(() => {
    void fetchEvents()
  }, [fetchEvents])

  return (
    <>
      <TopBar title="Bosh sahifa" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link href="/events/new">
            <Card className="flex items-center gap-4 transition-shadow hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-text-primary">Yangi tadbir</p>
                <p className="text-sm text-text-muted">Tadbir yaratish</p>
              </div>
            </Card>
          </Link>
          <Link href="/templates">
            <Card className="flex items-center gap-4 transition-shadow hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-text-primary">Shablonlar</p>
                <p className="text-sm text-text-muted">Kutubxonani ko&apos;rish</p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-text-primary">
            <Calendar className="h-5 w-5 text-brand-600" />
            So&apos;nggi tadbirlar
          </h2>
          <Link href="/events" className="text-sm text-brand-600 hover:text-brand-800">
            Barchasini ko&apos;rish
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-text-muted">Yuklanmoqda...</p>
        ) : events.length === 0 ? (
          <Card>
            <p className="text-sm text-text-muted">Hali tadbirlar yo&apos;q</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
