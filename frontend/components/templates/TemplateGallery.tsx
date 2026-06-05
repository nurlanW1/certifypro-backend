'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal'
import { STARTER_TEMPLATES } from '@/lib/templates/starterTemplates'
import { TEMPLATE_CATEGORIES, TEMPLATE_STYLES, filterStarterTemplates } from '@/lib/templates/templateUtils'
import type { StarterTemplate, TemplateCategory, TemplateStyle } from '@/lib/templates/types'

export function TemplateGallery() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all')
  const [style, setStyle] = useState<TemplateStyle | 'all'>('all')
  const [price, setPrice] = useState<'all' | 'free' | 'premium'>('all')
  const [previewId, setPreviewId] = useState<string | null>(null)

  const templates = useMemo(
    () => filterStarterTemplates({ search, category, style, price }),
    [search, category, style, price]
  )

  const previewTemplate = useMemo<StarterTemplate | null>(
    () => STARTER_TEMPLATES.find((template) => template.id === previewId) ?? null,
    [previewId]
  )

  const useTemplate = (templateId: string) => {
    router.push(`/editor/${templateId}`)
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-divide bg-surface px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-caps mb-2">Event Media Operating System</p>
            <h1 className="text-2xl font-semibold text-text-primary">Template Gallery</h1>
            <p className="mt-2 max-w-2xl text-sm text-text-muted">
              Real starter templates for certificates, invitations, badges, banners, press walls,
              QR registration cards, and social media assets.
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search templates"
              className="input py-2 pl-9 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-8">
        <aside className="hidden w-64 shrink-0 space-y-6 rounded border border-divide bg-surface p-4 lg:block">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>

          <div>
            <p className="label-caps mb-3">Category</p>
            <div className="space-y-1">
              {(['all', ...TEMPLATE_CATEGORIES] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`w-full rounded px-3 py-2 text-left text-sm ${category === item ? 'bg-subtle font-medium text-text-primary' : 'text-text-muted hover:bg-subtle'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="label-caps mb-3">Style</p>
            <div className="space-y-1">
              {(['all', ...TEMPLATE_STYLES] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStyle(item)}
                  className={`w-full rounded px-3 py-2 text-left text-sm ${style === item ? 'bg-subtle font-medium text-text-primary' : 'text-text-muted hover:bg-subtle'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="label-caps mb-3">Price</p>
            <div className="space-y-1">
              {(['all', 'free', 'premium'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPrice(item)}
                  className={`w-full rounded px-3 py-2 text-left text-sm ${price === item ? 'bg-subtle font-medium text-text-primary' : 'text-text-muted hover:bg-subtle'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-text-muted">{templates.length} templates</p>
            <p className="text-sm text-text-muted">{STARTER_TEMPLATES.length} starter templates total</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={setPreviewId}
                onSelect={useTemplate}
              />
            ))}
          </div>
        </main>
      </div>

      <TemplatePreviewModal
        template={previewTemplate}
        open={Boolean(previewTemplate)}
        onOpenChange={(open) => {
          if (!open) setPreviewId(null)
        }}
        onSelect={useTemplate}
      />
    </div>
  )
}
