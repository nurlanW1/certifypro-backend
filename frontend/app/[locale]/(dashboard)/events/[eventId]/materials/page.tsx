'use client'

import { EventMaterialsGrid } from '@/components/events/EventMaterialsGrid'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'

export default function EventMaterialsPage() {
  const { event } = useEventWorkspace()
  return <EventMaterialsGrid event={event} />
}
