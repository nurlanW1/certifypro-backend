'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Eye, Zap, Lock, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MATERIAL_LABELS } from '@/types/event'
import type { MaterialCategory } from '@/types/event'
import type { MockTemplate } from '@/lib/mock-templates'

interface TemplateCardProps {
  template: MockTemplate
  onSelect: (id: string) => void
  onPreview: (id: string) => void
}

export function TemplateCard({ template, onSelect, onPreview }: TemplateCardProps) {
  const [imageError, setImageError] = useState(false)
  const showPlaceholder = !template.previewUrl || imageError
  const categoryLabel =
    MATERIAL_LABELS[template.category as MaterialCategory] ?? template.category

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-border bg-surface',
        'transition-all duration-150 hover:border-brand-200 hover:shadow-md'
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-secondary">
        {showPlaceholder ? (
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-100"
            aria-hidden
          />
        ) : (
          <Image
            src={template.previewUrl}
            alt={template.nameUz ?? template.name}
            fill
            className={cn(
              'object-cover transition-all duration-150',
              template.isPremium && 'blur-[2px] group-hover:blur-0'
            )}
            sizes="(max-width: 640px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        )}

        {template.isPremium && (
          <>
            <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-warning px-2 py-0.5 text-xs font-semibold text-text-inverse">
              <Star className="h-3 w-3 fill-current" />
              PRO
            </span>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-900/10 opacity-100 transition-opacity duration-150 group-hover:opacity-0">
              <Lock className="h-8 w-8 text-brand-800/40" />
            </div>
          </>
        )}

        {!template.isPremium && (
          <span className="absolute right-2 top-2 rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success-dark">
            Bepul
          </span>
        )}

        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center gap-2 bg-brand-900/50',
            'opacity-0 transition-opacity duration-150 group-hover:opacity-100'
          )}
        >
          <button
            type="button"
            onClick={() => onPreview(template.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-text-primary shadow-sm transition-all duration-150 hover:bg-brand-50"
          >
            <Eye className="h-4 w-4" />
            Ko&apos;rish
          </button>
          <button
            type="button"
            onClick={() => onSelect(template.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-text-inverse shadow-sm transition-all duration-150 hover:bg-brand-800"
          >
            <Zap className="h-4 w-4" />
            Tanlash
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-medium text-text-primary">
            {template.nameUz ?? template.name}
          </h3>
        </div>
        <p className="mt-0.5 text-xs text-text-muted">{categoryLabel}</p>
      </div>
    </article>
  )
}
