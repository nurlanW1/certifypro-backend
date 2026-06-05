'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { TemplateGrid } from '@/components/templates/TemplateGrid'
import { useTemplateStore } from '@/store/templateStore'
import type { MockTemplate } from '@/lib/mock-templates'
import type { MaterialCategory } from '@/types/event'
import type { PriceFilterType } from '@/lib/filter-templates'
import { useMaterialLabel } from '@/hooks/useMaterialLabel'

const CATEGORY_IDS = [
  'ALL',
  'CERTIFICATE',
  'BADGE',
  'INVITATION',
  'FLYER',
  'POSTER',
  'SOCIAL_MEDIA',
  'EMAIL_BANNER',
  'ROLL_UP',
  'TABLE_TENT',
] as const

const STYLE_IDS = ['ALL', 'MINIMALIST', 'CLASSIC', 'HITECH'] as const

function priceFilterToPremium(priceType: PriceFilterType): string | null {
  if (priceType === 'FREE') return 'false'
  if (priceType === 'PREMIUM') return 'true'
  return null
}

export function TemplatesPageClient() {
  const t = useTranslations('templates')
  const tStyles = useTranslations('styles')
  const materialLabel = useMaterialLabel()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId') ?? undefined
  const materialCategory = (searchParams.get('category') as MaterialCategory | null) ?? undefined

  const [templates, setTemplates] = useState<MockTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL')
  const [styleFilter, setStyleFilter] = useState('ALL')

  const { searchQuery, activeCategory, sortBy, filters, setActiveCategory, setSearchQuery } =
    useTemplateStore()

  const categories = useMemo(
    () =>
      CATEGORY_IDS.map((id) => ({
        id,
        label: id === 'ALL' ? t('allCategories') : materialLabel(id),
      })),
    [t, materialLabel]
  )

  const styles = useMemo(
    () => [
      { id: 'ALL' as const, label: t('allStyles'), dot: '' },
      { id: 'MINIMALIST' as const, label: tStyles('minimalist'), dot: 'bg-text-primary' },
      { id: 'CLASSIC' as const, label: tStyles('classic'), dot: 'bg-warn' },
      { id: 'HITECH' as const, label: tStyles('hitech'), dot: 'bg-accent' },
    ],
    [t, tStyles]
  )

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory !== 'ALL') params.set('category', activeCategory)
      if (searchQuery) params.set('search', searchQuery)
      const premium =
        priceFilter === 'FREE' ? 'false' : priceFilter === 'PREMIUM' ? 'true' : priceFilterToPremium(filters.priceType)
      if (premium) params.set('premium', premium)
      params.set('sort', sortBy)

      const res = await fetch(`/api/templates?${params.toString()}`)
      const data = (await res.json()) as { templates?: MockTemplate[] }
      let list = data.templates ?? []

      if (styleFilter !== 'ALL') {
        list = list.filter((tpl) => {
          const tags = tpl.tags.join(' ').toLowerCase()
          if (styleFilter === 'CLASSIC') return tags.includes('klassik')
          if (styleFilter === 'MINIMALIST') return tags.includes('minimal') || tags.includes('zamonaviy')
          return !tags.includes('klassik') && !tags.includes('minimal')
        })
      }

      setTemplates(list)
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory, searchQuery, sortBy, filters.priceType, priceFilter, styleFilter])

  useEffect(() => {
    void fetchTemplates()
  }, [fetchTemplates])

  return (
    <div className="-mx-6 -mt-8 flex min-h-screen gap-0 lg:-mx-10 xl:-mx-14">
      <aside className="sticky top-0 w-56 shrink-0 space-y-6 border-r border-divide p-5">
        <div>
          <p className="label-caps mb-3">{t('materialType')}</p>
          <div className="space-y-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as MaterialCategory | 'ALL')}
                className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm transition-all ${
                  activeCategory === cat.id
                    ? 'bg-subtle font-medium text-text-primary'
                    : 'text-text-tertiary hover:bg-subtle hover:text-text-secondary'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-divide pt-5">
          <p className="label-caps mb-3">{t('style')}</p>
          <div className="space-y-0.5">
            {styles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyleFilter(s.id)}
                className={`flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm transition-all ${
                  styleFilter === s.id
                    ? 'bg-subtle font-medium text-text-primary'
                    : 'text-text-tertiary hover:bg-subtle hover:text-text-secondary'
                }`}
              >
                {s.dot && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-divide pt-5">
          <p className="label-caps mb-3">{t('price')}</p>
          <div className="space-y-0.5">
            {(['ALL', 'FREE', 'PREMIUM'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriceFilter(p)}
                className={`w-full rounded px-3 py-2 text-left text-sm transition-all ${
                  priceFilter === p
                    ? 'bg-subtle font-medium text-text-primary'
                    : 'text-text-tertiary hover:bg-subtle hover:text-text-secondary'
                }`}
              >
                {p === 'ALL' ? t('allPrices') : p === 'FREE' ? t('free') : t('premium')}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-6 lg:p-10 xl:p-14">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="input py-2 pl-9 text-sm"
            />
          </div>
          <div className="flex-1" />
          <p className="text-sm text-text-tertiary">
            {templates.length} {t('results')}
          </p>
        </div>

        {eventId && materialCategory && (
          <p className="mb-4 rounded border border-accent-border bg-accent-dim px-3 py-2 text-sm text-accent-hover">
            {t('eventMaterialHint')}
          </p>
        )}

        <TemplateGrid
          templates={templates}
          isLoading={isLoading}
          eventId={eventId}
          materialCategory={materialCategory}
        />
      </div>
    </div>
  )
}
