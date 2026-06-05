'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { TemplateGrid } from '@/components/templates/TemplateGrid'
import { useTemplateStore } from '@/store/templateStore'
import type { MockTemplate } from '@/lib/mock-templates'
import type { MaterialCategory } from '@/types/event'
import type { PriceFilterType } from '@/lib/filter-templates'

const CATEGORIES = [
  { id: 'ALL', label: 'Hammasi' },
  { id: 'CERTIFICATE', label: 'Sertifikat' },
  { id: 'BADGE', label: 'Nishon' },
  { id: 'INVITATION', label: 'Taklifnoma' },
  { id: 'FLYER', label: 'Flayer' },
  { id: 'SOCIAL_MEDIA', label: 'Ijt. tarmoq' },
  { id: 'ROLL_UP', label: 'Roll-up' },
  { id: 'TABLE_TENT', label: 'Stol kartasi' },
] as const

const STYLES = [
  { id: 'ALL', label: 'Barcha uslub', dot: '' },
  { id: 'MINIMALIST', label: 'Minimalist', dot: 'bg-text-primary' },
  { id: 'CLASSIC', label: 'Klassik', dot: 'bg-warn' },
  { id: 'HITECH', label: 'Hi-Tech', dot: 'bg-accent' },
]

function priceFilterToPremium(priceType: PriceFilterType): string | null {
  if (priceType === 'FREE') return 'false'
  if (priceType === 'PREMIUM') return 'true'
  return null
}

export function TemplatesPageClient() {
  const [templates, setTemplates] = useState<MockTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL')
  const [styleFilter, setStyleFilter] = useState('ALL')

  const { searchQuery, activeCategory, sortBy, filters, setActiveCategory, setSearchQuery } =
    useTemplateStore()

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
        list = list.filter((t) => {
          const tags = t.tags.join(' ').toLowerCase()
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

  const counts = CATEGORIES.map((c) => ({
    ...c,
    count:
      c.id === 'ALL'
        ? templates.length
        : templates.filter((t) => t.category === c.id).length,
  }))

  return (
    <div className="-mx-6 -mt-8 flex min-h-screen gap-0 lg:-mx-10 xl:-mx-14">
      <aside className="sticky top-0 w-56 shrink-0 space-y-6 border-r border-divide p-5">
        <div>
          <p className="label-caps mb-3">Material turi</p>
          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as MaterialCategory | 'ALL')}
                className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm transition-all ${
                  activeCategory === cat.id
                    ? 'bg-subtle font-medium text-text-primary'
                    : 'text-text-disabled hover:bg-subtle hover:text-text-secondary'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-divide pt-5">
          <p className="label-caps mb-3">Uslub</p>
          <div className="space-y-0.5">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyleFilter(s.id)}
                className={`flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm transition-all ${
                  styleFilter === s.id
                    ? 'bg-subtle font-medium text-text-primary'
                    : 'text-text-disabled hover:bg-subtle hover:text-text-secondary'
                }`}
              >
                {s.dot && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-divide pt-5">
          <p className="label-caps mb-3">Narx</p>
          <div className="space-y-0.5">
            {(['ALL', 'FREE', 'PREMIUM'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriceFilter(p)}
                className={`w-full rounded px-3 py-2 text-left text-sm transition-all ${
                  priceFilter === p
                    ? 'bg-subtle font-medium text-text-primary'
                    : 'text-text-disabled hover:bg-subtle hover:text-text-secondary'
                }`}
              >
                {p === 'ALL' ? 'Barchasi' : p === 'FREE' ? 'Bepul' : 'Premium'}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-6 lg:p-10 xl:p-14">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Shablon qidiring..."
              className="input py-2 pl-9 text-sm"
            />
          </div>
          <div className="flex-1" />
          <p className="text-xs text-text-tertiary">{templates.length} ta natija</p>
        </div>

        <TemplateGrid templates={templates} isLoading={isLoading} />
      </div>
    </div>
  )
}
