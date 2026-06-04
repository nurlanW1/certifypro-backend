'use client'

import { useEffect, useState } from 'react'
import type { Event } from '@/types/event'

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) return
    setLoading(true)
    setError(null)
    void fetch(`/api/events/${eventId}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string }
          throw new Error(body.error ?? 'Tadbir yuklanmadi')
        }
        return res.json() as Promise<{ event: Event }>
      })
      .then((data) => setEvent(data.event))
      .catch((e: unknown) => {
        setEvent(null)
        setError(e instanceof Error ? e.message : 'Xatolik')
      })
      .finally(() => setLoading(false))
  }, [eventId])

  return { event, loading, error }
}
