'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTemplateStore } from '@/store/templateStore'
import { FilterCheckbox, FilterRadio } from '@/components/templates/FilterCheckbox'
import type { PriceFilterType } from '@/lib/filter-templates'

const MATERIAL_FILTERS = [
  { value: 'CERTIFICATE', label: 'Sertifikat' },
  { value: 'BADGE', label: 'Nishon' },
  { value: 'INVITATION', label: 'Taklifnoma' },
  { value: 'FLYER', label: 'Flayer' },
  { value: 'POSTER', label: 'Poster' },
  { value: 'SOCIAL_MEDIA', label: 'Ijtimoiy tarmoq' },
  { value: 'ROLL_UP', label: 'Roll-up banner' },
  { value: 'TABLE_TENT', label: 'Stol kartasi' },
] as const

const EVENT_FILTERS = [
  { value: 'CONFERENCE', label: 'Konferentsiya' },
  { value: 'SEMINAR', label: 'Seminar' },
  { value: 'CORPORATE', label: 'Korporativ' },
  { value: 'SCIENTIFIC', label: 'Ilmiy' },
  { value: 'EDUCATIONAL', label: "Ta'lim" },
] as const

const PRICE_FILTERS: { value: PriceFilterType; label: string }[] = [
  { value: 'ALL', label: 'Barchasi' },
  { value: 'FREE', label: 'Bepul' },
  { value: 'PREMIUM', label: 'Premium' },
]

function FilterSections({ onClose }: { onClose?: () => void }) {
  const {
    filters,
    toggleMaterialFilter,
    toggleEventFilter,
    setPriceFilter,
    clearFilters,
  } = useTemplateStore()

  const clearSection = (section: 'material' | 'event' | 'price') => {
    if (section === 'material') {
      useTemplateStore.getState().setMaterialFilter([])
    } else if (section === 'event') {
      useTemplateStore.getState().setEventFilter([])
    } else {
      setPriceFilter('ALL')
    }
  }

  return (
    <div className="space-y-6">
      <FilterGroup
        title="Material turi"
        onClear={() => clearSection('material')}
        showClear={filters.materialTypes.length > 0}
      >
        {MATERIAL_FILTERS.map((item) => (
          <FilterCheckbox
            key={item.value}
            id={`material-${item.value}`}
            label={item.label}
            checked={filters.materialTypes.includes(item.value)}
            onChange={() => toggleMaterialFilter(item.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        title="Tadbir turi"
        onClear={() => clearSection('event')}
        showClear={filters.eventTypes.length > 0}
      >
        {EVENT_FILTERS.map((item) => (
          <FilterCheckbox
            key={item.value}
            id={`event-${item.value}`}
            label={item.label}
            checked={filters.eventTypes.includes(item.value)}
            onChange={() => toggleEventFilter(item.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        title="Narx"
        onClear={() => clearSection('price')}
        showClear={filters.priceType !== 'ALL'}
      >
        {PRICE_FILTERS.map((item) => (
          <FilterRadio
            key={item.value}
            id={`price-${item.value}`}
            name="price-filter"
            label={item.label}
            checked={filters.priceType === item.value}
            onChange={() => setPriceFilter(item.value)}
          />
        ))}
      </FilterGroup>

      <button
        type="button"
        onClick={() => {
          clearFilters()
          onClose?.()
        }}
        className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-text-secondary transition-all duration-150 hover:border-brand-200 hover:bg-brand-50"
      >
        Barcha filtrlarni tozalash
      </button>
    </div>
  )
}

function FilterGroup({
  title,
  children,
  onClear,
  showClear,
}: {
  title: string
  children: React.ReactNode
  onClear: () => void
  showClear: boolean
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {title}
        </h3>
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-brand-600 hover:text-brand-800"
          >
            Tozalash
          </button>
        )}
      </div>
      <div className="space-y-0.5">{children}</div>
    </section>
  )
}

export function FilterSidebarDesktop() {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-24 rounded-xl border border-border bg-surface p-4 shadow-xs">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Filtrlar</h2>
        <FilterSections />
      </div>
    </aside>
  )
}

interface FilterSidebarMobileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterSidebarMobile({ open, onOpenChange }: FilterSidebarMobileProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-900/40 backdrop-blur-sm lg:hidden" />
        <Dialog.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl',
            'border border-border bg-surface p-6 shadow-lg focus:outline-none lg:hidden'
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-text-primary">
              Filtrlar
            </Dialog.Title>
            <Dialog.Close
              className="rounded-lg p-2 text-text-muted hover:bg-brand-50"
              aria-label="Yopish"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <FilterSections onClose={() => onOpenChange(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
