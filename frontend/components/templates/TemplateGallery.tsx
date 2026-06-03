'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { TemplateSearch } from '@/components/templates/TemplateSearch'
import { CategoryTabs } from '@/components/templates/CategoryTabs'
import {
  FilterSidebarDesktop,
  FilterSidebarMobile,
} from '@/components/templates/FilterSidebar'
import { TemplateGrid } from '@/components/templates/TemplateGrid'
import { useTemplateStore } from '@/store/templateStore'
import { getCategoryCounts } from '@/lib/mock-templates'
import type { MockTemplate } from '@/lib/mock-templates'
import type { PriceFilterType } from '@/lib/filter-templates'

function priceFilterToPremium(priceType: PriceFilterType): string | null {
  if (priceType === 'FREE') return 'false'
  if (priceType === 'PREMIUM') return 'true'
  return null
}

export function TemplateGallery() {
  const [templates, setTemplates] = useState<MockTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const categoryCounts = useMemo(() => getCategoryCounts(), [])

  const {
    searchQuery,
    activeCategory,
    sortBy,
    filters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
  } = useTemplateStore()

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory !== 'ALL') params.set('category', activeCategory)
      if (searchQuery) params.set('search', searchQuery)
      const premium = priceFilterToPremium(filters.priceType)
      if (premium) params.set('premium', premium)
      if (filters.materialTypes.length > 0) {
        params.set('materialTypes', filters.materialTypes.join(','))
      }
      if (filters.eventTypes.length > 0) {
        params.set('eventTypes', filters.eventTypes.join(','))
      }
      params.set('sort', sortBy)

      const res = await fetch(`/api/templates?${params.toString()}`)
      const data = (await res.json()) as { templates: MockTemplate[] }
      setTemplates(data.templates)
    } catch {
      setTemplates([])
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory, searchQuery, filters, sortBy])

  useEffect(() => {
    void fetchTemplates()
  }, [fetchTemplates])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Shablonlar</h1>
          <p className="mt-1 text-sm text-text-muted">
            Tadbiringiz uchun professional dizayn shablonlarini tanlang
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TemplateSearch className="flex-1 sm:flex-none" />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-150 hover:border-brand-200 hover:bg-brand-50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtr
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <FilterSidebarDesktop />

        <div className="min-w-0 flex-1 space-y-4">
          <CategoryTabs counts={categoryCounts} />
          <TemplateGrid templates={templates} isLoading={isLoading} />
        </div>
      </div>

      <FilterSidebarMobile open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen} />
    </div>
  )
}
