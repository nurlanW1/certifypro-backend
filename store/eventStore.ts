'use client'

import { create } from 'zustand'
import type { Event, EventFormData, MaterialCategory } from '@/types/event'

const DEFAULT_MATERIALS: MaterialCategory[] = [
  'CERTIFICATE',
  'BADGE',
  'INVITATION',
  'FLYER',
  'SOCIAL_MEDIA',
]

const ALL_MATERIALS: MaterialCategory[] = [
  'CERTIFICATE',
  'BADGE',
  'INVITATION',
  'FLYER',
  'POSTER',
  'SOCIAL_MEDIA',
  'EMAIL_BANNER',
  'TABLE_TENT',
  'ROLL_UP',
  'PRESS_WALL',
  'NAME_TAG',
  'SPONSOR_BANNER',
]

const defaultFormData: Partial<EventFormData> = {
  language: 'uz',
  primaryColor: '#534AB7',
  accentColor: '#26215C',
}

interface EventStore {
  events: Event[]
  currentEvent: Event | null
  setEvents: (events: Event[]) => void
  setCurrentEvent: (event: Event | null) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, data: Partial<EventFormData>) => void
  removeEvent: (id: string) => void

  currentStep: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  formData: Partial<EventFormData>
  updateFormData: (data: Partial<EventFormData>) => void

  selectedMaterials: MaterialCategory[]
  toggleMaterial: (category: MaterialCategory) => void
  selectAllMaterials: () => void
  clearMaterials: () => void

  resetWizard: () => void
}

export const useEventStore = create<EventStore>((set, get) => ({
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

  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((s) => ({ currentStep: Math.min(s.currentStep + 1, 3) })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  formData: { ...defaultFormData },
  updateFormData: (data) =>
    set((s) => ({ formData: { ...s.formData, ...data } })),

  selectedMaterials: [...DEFAULT_MATERIALS],
  toggleMaterial: (category) =>
    set((s) => ({
      selectedMaterials: s.selectedMaterials.includes(category)
        ? s.selectedMaterials.filter((m) => m !== category)
        : [...s.selectedMaterials, category],
    })),
  selectAllMaterials: () => set({ selectedMaterials: [...ALL_MATERIALS] }),
  clearMaterials: () => set({ selectedMaterials: [] }),

  resetWizard: () =>
    set({
      currentStep: 1,
      formData: { ...defaultFormData },
      selectedMaterials: [...DEFAULT_MATERIALS],
    }),
}))

export { ALL_MATERIALS, DEFAULT_MATERIALS }
