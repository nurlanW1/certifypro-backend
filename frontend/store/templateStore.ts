'use client'

import { create } from 'zustand'
import type { TemplateSortOption, PriceFilterType } from '@/lib/filter-templates'

interface TemplateStore {
  searchQuery: string
  setSearchQuery: (q: string) => void

  activeCategory: string
  setActiveCategory: (cat: string) => void

  sortBy: TemplateSortOption
  setSortBy: (sort: TemplateSortOption) => void

  filters: {
    materialTypes: string[]
    eventTypes: string[]
    priceType: PriceFilterType
  }
  setMaterialFilter: (types: string[]) => void
  toggleMaterialFilter: (type: string) => void
  setEventFilter: (types: string[]) => void
  toggleEventFilter: (type: string) => void
  setPriceFilter: (type: PriceFilterType) => void
  clearFilters: () => void

  mobileFiltersOpen: boolean
  setMobileFiltersOpen: (open: boolean) => void

  previewTemplateId: string | null
  setPreviewTemplate: (id: string | null) => void

  selectedTemplateId: string | null
  setSelectedTemplate: (id: string | null) => void
}

const defaultFilters = {
  materialTypes: [] as string[],
  eventTypes: [] as string[],
  priceType: 'ALL' as PriceFilterType,
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  activeCategory: 'ALL',
  setActiveCategory: (activeCategory) => set({ activeCategory }),

  sortBy: 'new',
  setSortBy: (sortBy) => set({ sortBy }),

  filters: { ...defaultFilters },
  setMaterialFilter: (materialTypes) =>
    set((s) => ({ filters: { ...s.filters, materialTypes } })),
  toggleMaterialFilter: (type) =>
    set((s) => {
      const types = s.filters.materialTypes.includes(type)
        ? s.filters.materialTypes.filter((t) => t !== type)
        : [...s.filters.materialTypes, type]
      return { filters: { ...s.filters, materialTypes: types } }
    }),
  setEventFilter: (eventTypes) =>
    set((s) => ({ filters: { ...s.filters, eventTypes } })),
  toggleEventFilter: (type) =>
    set((s) => {
      const types = s.filters.eventTypes.includes(type)
        ? s.filters.eventTypes.filter((t) => t !== type)
        : [...s.filters.eventTypes, type]
      return { filters: { ...s.filters, eventTypes: types } }
    }),
  setPriceFilter: (priceType) =>
    set((s) => ({ filters: { ...s.filters, priceType } })),
  clearFilters: () => set({ filters: { ...defaultFilters } }),

  mobileFiltersOpen: false,
  setMobileFiltersOpen: (mobileFiltersOpen) => set({ mobileFiltersOpen }),

  previewTemplateId: null,
  setPreviewTemplate: (previewTemplateId) => set({ previewTemplateId }),

  selectedTemplateId: null,
  setSelectedTemplate: (selectedTemplateId) => set({ selectedTemplateId }),
}))
