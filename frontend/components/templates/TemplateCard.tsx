'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Eye, Zap, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MATERIAL_LABELS } from '@/types/event'
import type { MaterialCategory } from '@/types/event'
import type { MockTemplate } from '@/lib/mock-templates'

type TemplateStyle = 'MINIMALIST' | 'CLASSIC' | 'HITECH'

const styleDot: Record<TemplateStyle, string> = {
  MINIMALIST: 'bg-white',
  CLASSIC: 'bg-amber-400',
  HITECH: 'bg-accent',
}

const previewBg: Record<TemplateStyle, string> = {
  MINIMALIST: '#FAFAFA',
  CLASSIC: '#FDFAF5',
  HITECH: '#0F0F0F',
}

function inferStyle(template: MockTemplate): TemplateStyle {
  const tags = template.tags.join(' ').toLowerCase()
  if (tags.includes('klassik') || tags.includes('classic')) return 'CLASSIC'
  if (tags.includes('minimal') || tags.includes('zamonaviy')) return 'MINIMALIST'
  return 'HITECH'
}

interface TemplateCardProps {
  template: MockTemplate
  onSelect: (id: string) => void
  onPreview: (id: string) => void
  isSelecting?: boolean
}

export function TemplateCard({ template, onSelect, onPreview, isSelecting }: TemplateCardProps) {
  const [imageError, setImageError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const showPlaceholder = !template.previewUrl || imageError
  const style = inferStyle(template)
  const categoryLabel =
    MATERIAL_LABELS[template.category as MaterialCategory] ?? template.category

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative cursor-pointer overflow-hidden rounded border border-divide transition-all duration-150 hover:border-text-disabled"
    >
      <div
        className="relative aspect-[3/4]"
        style={{ background: showPlaceholder ? previewBg[style] : undefined }}
      >
        {!showPlaceholder && (
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

        <div className={cn('absolute left-2 top-2 h-1.5 w-1.5 rounded-full', styleDot[style])} />

        {template.isPremium ? (
          <div className="absolute right-2 top-2">
            <span className="tag tag-accent px-1.5 py-0.5 text-[9px]">PRO</span>
          </div>
        ) : (
          <div className="absolute right-2 top-2">
            <span className="tag tag-ok px-1.5 py-0.5 text-[9px]">Bepul</span>
          </div>
        )}

        {template.isPremium && !hovered && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-canvas/40">
            <Lock className="h-6 w-6 text-text-disabled" />
          </div>
        )}

        {hovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-canvas/80 backdrop-blur-[1px]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onPreview(template.id)
              }}
              className="btn-secondary btn-icon-sm"
            >
              <Eye size={12} />
            </button>
            <button
              type="button"
              disabled={isSelecting}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(template.id)
              }}
              className="btn-primary btn-icon-sm"
            >
              <Zap size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-divide bg-ink px-3 py-2.5">
        <p className="truncate text-xs text-text-secondary">
          {template.nameUz ?? template.name}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-text-tertiary">{categoryLabel}</p>
      </div>
    </article>
  )
}
