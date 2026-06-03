'use client'

import { create } from 'zustand'
import type { Event, EventFormData, MaterialCategory } from '@/types/event'
import {
  ALL_WIZARD_MATERIAL_CATEGORIES,
  DEFAULT_SELECTED_MATERIALS,
  FREE_MATERIAL_CATEGORIES,
} from '@/components/events/wizard/constants'

const defaultFormData: Partial<EventFormData> = {
  language: 'uz',
  primaryColor: '#534AB7',
  accentColor: '#26215C',
}

interface EventStore {
  events: Event[]
  currentEvent: Event | null
  isLoading: boolean
  setEvents: (events: Event[]) => void
  setCurrentEvent: (event: Event | null) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, data: Partial<EventFormData>) => void
  removeEvent: (id: string) => void
  setLoading: (loading: boolean) => void

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
  isLoading: false,
  setEvents: (events) => set({ events }),
  setCurrentEvent: (currentEvent) => set({ currentEvent }),
  addEvent: (event) =>
    set((state) => ({ events: [event, ...state.events] })),
  updateEvent: (id, data) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
      ),
      currentEvent:
        state.currentEvent?.id === id
          ? { ...state.currentEvent, ...data, updatedAt: new Date().toISOString() }
          : state.currentEvent,
    })),
  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
    })),
  setLoading: (isLoading) => set({ isLoading }),

  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 3) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  formData: { ...defaultFormData },
  updateFormData: (data) =>
    set((s) => ({ formData: { ...s.formData, ...data } })),

  selectedMaterials: [...DEFAULT_SELECTED_MATERIALS],
  toggleMaterial: (category) =>
    set((s) => ({
      selectedMaterials: s.selectedMaterials.includes(category)
        ? s.selectedMaterials.filter((m) => m !== category)
        : [...s.selectedMaterials, category],
    })),
  selectAllMaterials: () =>
    set({ selectedMaterials: [...ALL_WIZARD_MATERIAL_CATEGORIES] }),
  clearMaterials: () => set({ selectedMaterials: [] }),

  resetWizard: () =>
    set({
      currentStep: 1,
      formData: { ...defaultFormData },
      selectedMaterials: [...DEFAULT_SELECTED_MATERIALS],
    }),
}))

export function getWizardFreeMaterialCount(materials: MaterialCategory[]): number {
  return materials.filter((m) => FREE_MATERIAL_CATEGORIES.includes(m)).length
}

export function getWizardPremiumMaterialCount(materials: MaterialCategory[]): number {
  return materials.length - getWizardFreeMaterialCount(materials)
}
