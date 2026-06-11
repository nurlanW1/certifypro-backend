'use client'

import Image from 'next/image'
import { Eye, Globe2, Lock, Printer, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MockTemplate } from '@/lib/mock-templates'
import { findStarterTemplate } from '@/lib/templates/starterTemplates'
import type { StarterTemplate } from '@/lib/templates/types'

type CardTemplate = MockTemplate | StarterTemplate

function titleOf(template: CardTemplate) {
  return 'name' in template ? template.nameUz ?? template.name : template.title
}

function previewOf(template: CardTemplate) {
  return 'previewUrl' in template ? template.previewUrl || `/api/templates/${template.id}/preview` : template.thumbnail
}

function categoryOf(template: CardTemplate) {
  return 'materialCategory' in template ? template.category : template.category
}

function styleOf(template: CardTemplate) {
  const style = 'style' in template ? String(template.style) : ''
  if (style.includes('classic')) return 'classic'
  if (style.includes('hitech')) return 'hitech'
  return 'minimalistic'
}

function sizeOf(template: CardTemplate) {
  if (template.size) return template.size

  return (
    findStarterTemplate(template.id)?.size ?? {
      width: 794,
      height: 1123,
      unit: 'px' as const,
      label: 'Portrait',
    }
  )
}

interface TemplateCardProps {
  template: CardTemplate
  onSelect: (id: string) => void
  onPreview: (id: string) => void
  isSelecting?: boolean
}

export function TemplateCard({ template, onSelect, onPreview, isSelecting }: TemplateCardProps) {
  const style = styleOf(template)
  const previewSrc = previewOf(template)
  const title = titleOf(template)
  const size = sizeOf(template)
  const isLandscape = size.width >= size.height

  return (
    <article className="group overflow-hidden rounded border border-divide bg-surface transition-all hover:border-text-disabled hover:shadow-sm">
      <div
        className={cn(
          'relative flex h-72 items-center justify-center overflow-hidden p-4',
          style === 'hitech' ? 'bg-[#07111f]' : style === 'classic' ? 'bg-[#f6f3eb]' : 'bg-subtle'
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden bg-white shadow-sm ring-1 ring-black/10',
            isLandscape ? 'w-full' : 'h-full'
          )}
          style={{ aspectRatio: `${size.width} / ${size.height}` }}
        >
          <Image
            src={previewSrc}
            alt={title}
            fill
            className={cn('object-contain transition-all', template.isPremium && 'blur-[2px] group-hover:blur-0')}
            sizes="(max-width: 640px) 80vw, (max-width: 1280px) 40vw, 24vw"
            unoptimized
          />
        </div>

        <div className="absolute left-2 top-2 flex gap-1.5">
          {template.isPrintable && (
            <span className="inline-flex items-center gap-1 rounded bg-canvas/90 px-1.5 py-1 text-[10px] font-medium text-text-secondary">
              <Printer className="h-2.5 w-2.5" />
              print
            </span>
          )}
          {template.isOnlineReady && (
            <span className="inline-flex items-center gap-1 rounded bg-canvas/90 px-1.5 py-1 text-[10px] font-medium text-text-secondary">
              <Globe2 className="h-2.5 w-2.5" />
              online
            </span>
          )}
        </div>

        <span className={cn('absolute right-2 top-2 rounded px-1.5 py-0.5 text-xs font-semibold', template.isPremium ? 'bg-accent text-text-inverse' : 'bg-success-light text-success-dark')}>
          {template.isPremium ? 'PRO' : 'Free'}
        </span>

        {template.isPremium && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-canvas/35 group-hover:hidden">
            <Lock className="h-6 w-6 text-text-tertiary" />
          </div>
        )}

        <div className="absolute inset-0 hidden flex-col items-center justify-center gap-2 bg-canvas/85 px-3 backdrop-blur-[1px] group-hover:flex">
          <button type="button" onClick={() => onPreview(template.id)} className="btn-secondary btn-sm w-full">
            <Eye className="h-3 w-3" />
            Preview
          </button>
          <button type="button" disabled={isSelecting} onClick={() => onSelect(template.id)} className="btn-primary btn-sm w-full">
            <Zap className="h-3 w-3" />
            {isSelecting ? 'Opening...' : 'Use Template'}
          </button>
        </div>
      </div>

      <div className="border-t border-divide px-3 py-2.5">
        <h3 className="truncate text-sm font-medium text-text-primary">{title}</h3>
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-text-muted">
          <span className="truncate">{categoryOf(template)}</span>
          {'sizeLabel' in template ? <span className="truncate">{template.sizeLabel}</span> : <span className="truncate">{template.size.label}</span>}
        </div>
      </div>
    </article>
  )
}
