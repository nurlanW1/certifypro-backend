'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { TemplateSearch } from '@/components/templates/TemplateSearch'
import { CategoryTabs } from '@/components/templates/CategoryTabs'
import {
  FilterSidebarDesktop,
  FilterSidebarMobile,
} from '@/components/templates/FilterSidebar'
import { TemplateGrid } from '@/components/templates/TemplateGrid'
import { EventTemplateBanner } from '@/components/templates/EventTemplateBanner'
import { useTemplateStore } from '@/store/templateStore'
import { getCategoryCounts } from '@/lib/mock-templates'
import type { MockTemplate } from '@/lib/mock-templates'
import type { MaterialCategory } from '@/types/event'
import type { PriceFilterType } from '@/lib/filter-templates'

function priceFilterToPremium(priceType: PriceFilterType): string | null {
  if (priceType === 'FREE') return 'false'
  if (priceType === 'PREMIUM') return 'true'
  return null
}

export function TemplateGallery() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const categoryParam = searchParams.get('category') as MaterialCategory | null

  const [templates, setTemplates] = useState<MockTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [eventName, setEventName] = useState('')
  const categoryCounts = useMemo(() => getCategoryCounts(), [])

  const {
    searchQuery,
    activeCategory,
    sortBy,
    filters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    setActiveCategory,
  } = useTemplateStore()

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam)
    }
  }, [categoryParam, setActiveCategory])

  useEffect(() => {
    if (!eventId) return
    void fetch(`/api/events/${eventId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { event?: { name: string } } | null) => {
        if (d?.event?.name) setEventName(d.event.name)
      })
      .catch(() => {})
  }, [eventId])

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      const category =
        eventId && categoryParam ? categoryParam : activeCategory !== 'ALL' ? activeCategory : null
      if (category) params.set('category', category)
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
  }, [activeCategory, searchQuery, filters, sortBy, eventId, categoryParam])

  useEffect(() => {
    void fetchTemplates()
  }, [fetchTemplates])

  return (
    <div className="space-y-6">
      {eventId && categoryParam && eventName && (
        <EventTemplateBanner
          eventId={eventId}
          eventName={eventName}
          category={categoryParam}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {eventId ? 'Shablon tanlash' : 'Shablon katalogi'}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {eventId
              ? 'Tanlangan shablon tadbir materialiga bog‘lanadi'
              : 'Tadbir markazidan ochish tavsiya etiladi'}
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
          {!eventId && <CategoryTabs counts={categoryCounts} />}
          <TemplateGrid
            templates={templates}
            isLoading={isLoading}
            eventId={eventId ?? undefined}
            materialCategory={categoryParam ?? undefined}
          />
        </div>
      </div>

      <FilterSidebarMobile open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen} />
    </div>
  )
}
