'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTemplateStore } from '@/store/templateStore'
import type { MockTemplate } from '@/lib/mock-templates'
import type { TemplateSortOption } from '@/lib/filter-templates'

const SORT_OPTIONS: { value: TemplateSortOption; label: string }[] = [
  { value: 'new', label: 'Yangi' },
  { value: 'popular', label: 'Mashhur' },
  { value: 'free', label: 'Bepul' },
]

interface TemplateGridProps {
  templates: MockTemplate[]
  isLoading?: boolean
}

function TemplateCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="aspect-[4/3] animate-pulse bg-surface-tertiary" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-tertiary" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-tertiary" />
      </div>
    </div>
  )
}

export function TemplateGrid({ templates, isLoading }: TemplateGridProps) {
  const router = useRouter()
  const {
    sortBy,
    setSortBy,
    previewTemplateId,
    setPreviewTemplate,
    setSelectedTemplate,
  } = useTemplateStore()

  const previewTemplate = useMemo(
    () => templates.find((t) => t.id === previewTemplateId) ?? null,
    [templates, previewTemplateId]
  )

  const handleSelect = (id: string) => {
    setSelectedTemplate(id)
    router.push(`/templates/${id}`)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TemplateCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          <span className="font-medium text-text-primary">{templates.length}</span> ta shablon
        </p>
        <div className="flex items-center gap-4 text-sm">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSortBy(opt.value)}
              className={cn(
                'font-medium transition-all duration-150',
                sortBy === opt.value
                  ? 'text-brand-600 underline decoration-brand-600 underline-offset-4'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Shablon topilmadi"
          description="Boshqa kalit so'z yoki filtr sinab ko'ring"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelect}
              onPreview={setPreviewTemplate}
            />
          ))}
        </div>
      )}

      <TemplatePreviewModal
        template={previewTemplate}
        open={previewTemplateId !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewTemplate(null)
        }}
        onSelect={handleSelect}
      />
    </>
  )
}
