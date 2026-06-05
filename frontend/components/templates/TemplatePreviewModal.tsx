'use client'

import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { Crown, Download, X, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { MockTemplate } from '@/lib/mock-templates'
import type { StarterTemplate } from '@/lib/templates/types'

type PreviewTemplate = MockTemplate | StarterTemplate

interface TemplatePreviewModalProps {
  template: PreviewTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (id: string) => void
}

function titleOf(template: PreviewTemplate) {
  return 'name' in template ? template.nameUz ?? template.name : template.title
}

function descriptionOf(template: PreviewTemplate) {
  return template.description
}

function previewOf(template: PreviewTemplate) {
  return 'previewUrl' in template ? template.previewUrl || `/api/templates/${template.id}/preview` : template.thumbnail
}

export function TemplatePreviewModal({ template, open, onOpenChange, onSelect }: TemplatePreviewModalProps) {
  if (!template) return null

  const title = titleOf(template)
  const previewSrc = previewOf(template)
  const category = 'materialCategory' in template ? template.category : template.category

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded border border-border bg-surface shadow-lg focus:outline-none md:flex-row">
          <div className="relative aspect-[4/3] w-full shrink-0 bg-surface-secondary md:aspect-auto md:w-[56%]">
            <Image src={previewSrc} alt={title} fill className="object-contain p-4" unoptimized />
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <Dialog.Title className="text-xl font-semibold text-text-primary">{title}</Dialog.Title>
              <Dialog.Close className="rounded p-2 text-text-muted hover:bg-subtle" aria-label="Close preview">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <Badge>{category}</Badge>
              <Badge>{template.isPrintable ? 'Printable' : 'Online'}</Badge>
              {template.isPremium && (
                <Badge variant="premium">
                  <Crown className="mr-1 h-3 w-3" />
                  PRO
                </Badge>
              )}
            </div>

            <Dialog.Description className="mb-6 text-sm leading-relaxed text-text-muted">
              {descriptionOf(template)}
            </Dialog.Description>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => {
                  onSelect(template.id)
                  onOpenChange(false)
                }}
              >
                <Zap className="h-4 w-4" />
                Use Template
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => window.open(previewSrc, '_blank')}>
                <Download className="h-4 w-4" />
                Open SVG Preview
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
