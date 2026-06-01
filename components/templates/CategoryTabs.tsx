'use client'

import { cn } from '@/lib/utils'
import { useTemplateStore } from '@/store/templateStore'

const CATEGORIES = [
  { value: 'ALL', label: 'Hammasi' },
  { value: 'CERTIFICATE', label: 'Sertifikat' },
  { value: 'BADGE', label: 'Nishon' },
  { value: 'INVITATION', label: 'Taklifnoma' },
  { value: 'FLYER', label: 'Flayer' },
  { value: 'POSTER', label: 'Poster' },
  { value: 'SOCIAL_MEDIA', label: 'Ijt. tarmoq' },
  { value: 'EMAIL_BANNER', label: 'Email' },
  { value: 'TABLE_TENT', label: 'Stol kartasi' },
  { value: 'ROLL_UP', label: 'Roll-up' },
] as const

interface CategoryTabsProps {
  counts: Record<string, number>
}

export function CategoryTabs({ counts }: CategoryTabsProps) {
  const { activeCategory, setActiveCategory } = useTemplateStore()

  return (
    <div className="relative -mx-1">
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
        role="tablist"
        aria-label="Material kategoriyalari"
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.value
          const count = counts[cat.value] ?? 0
          return (
            <button
              key={cat.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-brand-600 text-text-inverse shadow-xs'
                  : 'text-text-muted hover:bg-surface-secondary hover:text-text-primary'
              )}
            >
              {cat.label}
              <span
                className={cn(
                  'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
                  active ? 'bg-white/20 text-text-inverse' : 'bg-surface-tertiary text-text-muted'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
