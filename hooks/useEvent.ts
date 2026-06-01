'use client'

import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useEventStore } from '@/store/eventStore'
import type { Event, EventFormData } from '@/types/event'

export function useEvent() {
  const { events, setEvents, addEvent, updateEvent, removeEvent, currentEvent, setCurrentEvent } =
    useEventStore()
  const [loading, setLoading] = useState(false)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error('Failed to fetch events')
      const data = (await res.json()) as Event[]
      setEvents(data)
    } catch {
      toast.error('Tadbirlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }, [setEvents])

  const createEvent = useCallback(
    async (form: EventFormData) => {
      setLoading(true)
      try {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Failed to create event')
        const event = (await res.json()) as Event
        addEvent(event)
        toast.success('Tadbir yaratildi')
        return event
      } catch {
        toast.error('Tadbir yaratishda xatolik')
        return null
      } finally {
        setLoading(false)
      }
    },
    [addEvent]
  )

  return {
    events,
    currentEvent,
    setCurrentEvent,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    removeEvent,
  }
}
