'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Search } from 'lucide-react'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { TemplateSkeleton } from '@/components/ui/Skeleton'
import { useTemplateStore } from '@/store/templateStore'
import { startTemplateDesignForEvent } from '@/lib/start-template-design'
import type { MockTemplate } from '@/lib/mock-templates'
import type { MaterialCategory } from '@/types/event'
import type { TemplateSortOption } from '@/lib/filter-templates'

const SORT_OPTIONS: { value: TemplateSortOption; labelKey: 'sortNew' | 'sortPopular' | 'sortFree' }[] = [
  { value: 'new', labelKey: 'sortNew' },
  { value: 'popular', labelKey: 'sortPopular' },
  { value: 'free', labelKey: 'sortFree' },
]

interface TemplateGridProps {
  templates: MockTemplate[]
  isLoading?: boolean
  eventId?: string
  materialCategory?: MaterialCategory
}

export function TemplateGrid({
  templates,
  isLoading,
  eventId,
  materialCategory,
}: TemplateGridProps) {
  const t = useTranslations('templates')
  const router = useRouter()
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const {
    sortBy,
    setSortBy,
    previewTemplateId,
    setPreviewTemplate,
    setSelectedTemplate,
  } = useTemplateStore()

  const previewTemplate = useMemo(
    () => templates.find((tpl) => tpl.id === previewTemplateId) ?? null,
    [templates, previewTemplateId]
  )

  const handleSelect = async (id: string) => {
    setSelectedTemplate(id)

    if (eventId && materialCategory) {
      setSelectingId(id)
      const result = await startTemplateDesignForEvent(eventId, materialCategory, id)
      setSelectingId(null)
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      toast.success(t('designCreated'))
      router.push(`/editor/${result.designId}?eventId=${eventId}&asset=1`)
      return
    }

    const designId = nanoid()
    setSelectingId(id)
    try {
      await fetch(`/api/designs/${designId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: id,
          name: templates.find((template) => template.id === id)?.nameUz ?? 'Gildia starter template',
          canvasData: { version: '5.3.0', objects: [], background: '#ffffff' },
        }),
      })
    } finally {
      setSelectingId(null)
      router.push(`/editor/${designId}?templateId=${id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TemplateSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          {t('templateCount', { count: templates.length })}
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
                  ? 'text-accent underline decoration-accent underline-offset-4'
                  : 'text-text-tertiary hover:text-text-primary'
              )}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('noResults')}
          description={t('noResultsDesc')}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelect}
              onPreview={setPreviewTemplate}
              isSelecting={selectingId === template.id}
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
