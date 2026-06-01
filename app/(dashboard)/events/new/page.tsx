'use client'

import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { EventWizard } from '@/components/events/EventWizard'
import { useEvent } from '@/hooks/useEvent'
import type { EventFormData } from '@/types/event'

export default function NewEventPage() {
  const router = useRouter()
  const { createEvent, loading } = useEvent()

  const handleComplete = async (data: EventFormData) => {
    const event = await createEvent(data)
    if (event) router.push(`/events/${event.id}`)
  }

  return (
    <>
      <TopBar title="Yangi tadbir" />
      <div className="flex-1 overflow-auto p-6">
        <Card className="mx-auto max-w-xl">
          <EventWizard onComplete={handleComplete} loading={loading} />
        </Card>
      </div>
    </>
  )
}
