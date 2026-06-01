'use client'

import { create } from 'zustand'
import type { Event, EventFormData } from '@/types/event'

interface EventState {
  events: Event[]
  currentEvent: Event | null
  setEvents: (events: Event[]) => void
  setCurrentEvent: (event: Event | null) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, data: Partial<EventFormData>) => void
  removeEvent: (id: string) => void
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  currentEvent: null,
  setEvents: (events) => set({ events }),
  setCurrentEvent: (currentEvent) => set({ currentEvent }),
  addEvent: (event) =>
    set((state) => ({ events: [event, ...state.events] })),
  updateEvent: (id, data) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
      ),
    })),
  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      currentEvent:
        state.currentEvent?.id === id ? null : state.currentEvent,
    })),
}))
