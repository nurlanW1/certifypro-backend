'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, LayoutTemplate } from 'lucide-react'
import { STARTER_TEMPLATES } from '@/lib/templates/starterTemplates'
import { cn } from '@/lib/utils'
import type { StarterTemplate, TemplateCategory } from '@/lib/templates/types'

interface EditorSidebarProps {
  template: StarterTemplate
}

function isMatchingCategory(current: TemplateCategory, candidate: TemplateCategory) {
  if (current === 'certificate' || current === 'thank-you-certificate') {
    return candidate === 'certificate' || candidate === 'thank-you-certificate'
  }

  return candidate === current
}

export function EditorSidebar({ template }: EditorSidebarProps) {
  const variants = STARTER_TEMPLATES.filter((candidate) =>
    isMatchingCategory(template.category, candidate.category)
  )

  return (
    <aside className="hidden w-64 shrink-0 border-r border-divide bg-surface md:block">
      <div className="flex items-center gap-2 border-b border-divide px-4 py-3">
        <LayoutTemplate className="h-4 w-4 text-text-muted" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-text-primary">Dizayn variantlari</h2>
          <p className="text-[10px] text-text-muted">{variants.length} ta shablon</p>
        </div>
      </div>

      <div className="max-h-[calc(100vh-5rem)] overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {variants.map((variant) => {
            const active = variant.id === template.id
            const landscape = variant.size.width >= variant.size.height

            return (
              <Link
                key={variant.id}
                href={`/templates/editor/${variant.id}`}
                aria-current={active ? 'page' : undefined}
                title={variant.title}
                className={cn(
                  'group overflow-hidden rounded border bg-surface transition-colors',
                  active
                    ? 'border-accent bg-accent-dim'
                    : 'border-divide hover:border-text-disabled'
                )}
              >
                <span className="relative flex h-24 items-center justify-center overflow-hidden bg-subtle p-2">
                  <span
                    className={cn(
                      'relative overflow-hidden bg-white shadow-sm ring-1 ring-black/10',
                      landscape ? 'w-full' : 'h-full'
                    )}
                    style={{ aspectRatio: `${variant.size.width} / ${variant.size.height}` }}
                  >
                    <Image
                      src={variant.thumbnail}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="112px"
                      unoptimized
                    />
                  </span>

                  {active && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-text-inverse shadow-sm">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </span>

                <span className="block border-t border-divide px-2 py-1.5">
                  <span className="block truncate text-[11px] font-medium text-text-primary">
                    {variant.title}
                  </span>
                  <span className="block truncate text-[9px] text-text-muted">
                    {variant.style}
                  </span>
                </span>
              </Link>
            )
          })}
        </div>

        {variants.length === 0 && (
          <div
            className={cn(
              'rounded border border-dashed border-divide px-3 py-8 text-center',
              'text-xs text-text-muted'
            )}
          >
            Bu format uchun variantlar hali yo&apos;q.
          </div>
        )}
      </div>
    </aside>
  )
}
