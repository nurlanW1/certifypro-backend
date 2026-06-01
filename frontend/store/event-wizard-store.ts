'use client'

import { create } from 'zustand'

import {
  emptyEventSetup,
  type EventSetup,
} from '@/lib/event-create/event-setup'
import {
  ALL_WIZARD_MATERIAL_IDS,
  DEFAULT_WIZARD_MATERIAL_IDS,
} from '@/lib/event-create/wizard-materials'

interface EventWizardStore {
  currentStep: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  setup: EventSetup
  updateSetup: (data: Partial<EventSetup>) => void
  patchColors: (data: Partial<EventSetup['brandColors']>) => void

  selectedMaterials: string[]
  toggleMaterial: (catalogId: string) => void
  selectAllMaterials: () => void
  clearMaterials: () => void

  resetWizard: () => void
}

export const useEventWizardStore = create<EventWizardStore>((set) => ({
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((s) => ({ currentStep: Math.min(s.currentStep + 1, 3) })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  setup: emptyEventSetup(),
  updateSetup: (data) =>
    set((s) => ({ setup: { ...s.setup, ...data } })),
  patchColors: (data) =>
    set((s) => ({
      setup: {
        ...s.setup,
        brandColors: { ...s.setup.brandColors, ...data },
      },
    })),

  selectedMaterials: [...DEFAULT_WIZARD_MATERIAL_IDS],
  toggleMaterial: (catalogId) =>
    set((s) => ({
      selectedMaterials: s.selectedMaterials.includes(catalogId)
        ? s.selectedMaterials.filter((id) => id !== catalogId)
        : [...s.selectedMaterials, catalogId],
    })),
  selectAllMaterials: () =>
    set({ selectedMaterials: [...ALL_WIZARD_MATERIAL_IDS] }),
  clearMaterials: () => set({ selectedMaterials: [] }),

  resetWizard: () =>
    set({
      currentStep: 1,
      setup: emptyEventSetup(),
      selectedMaterials: [...DEFAULT_WIZARD_MATERIAL_IDS],
    }),
}))
