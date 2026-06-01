'use client'

import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useEventStore } from '@/store/eventStore'
import type { Event, EventFormData, MaterialCategory } from '@/types/event'

export function useEvent() {
  const store = useEventStore()
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    store.setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error('Tadbirlarni yuklab bo‘lmadi')
      const data = (await res.json()) as { events: Event[] }
      store.setEvents(data.events)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Xatolik yuz berdi'
      setError(message)
      toast.error(message)
    } finally {
      store.setLoading(false)
    }
  }, [store])

  const createEvent = useCallback(
    async (form: EventFormData, selectedMaterials?: MaterialCategory[]) => {
      store.setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: form,
            selectedMaterials: selectedMaterials ?? store.selectedMaterials,
          }),
        })
        if (!res.ok) throw new Error('Tadbir yaratib bo‘lmadi')
        const data = (await res.json()) as { event: Event }
        store.addEvent(data.event)
        toast.success('Tadbir yaratildi')
        return data.event
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Xatolik yuz berdi'
        setError(message)
        toast.error(message)
        return null
      } finally {
        store.setLoading(false)
      }
    },
    [store]
  )

  return { ...store, error, fetchEvents, createEvent }
}
