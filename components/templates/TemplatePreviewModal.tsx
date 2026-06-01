'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Zap, Download, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { MockTemplate } from '@/lib/mock-templates'
import { MATERIAL_LABELS, EVENT_TYPE_LABELS } from '@/types/event'
import type { EventType, MaterialCategory } from '@/types/event'

interface TemplatePreviewModalProps {
  template: MockTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (id: string) => void
}

export function TemplatePreviewModal({
  template,
  open,
  onOpenChange,
  onSelect,
}: TemplatePreviewModalProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setImageError(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, template?.id])

  if (!template) return null

  const categoryLabel =
    MATERIAL_LABELS[template.category as MaterialCategory] ?? template.category
  const eventLabel = template.eventType
    ? EVENT_TYPE_LABELS[template.eventType as EventType]
    : null
  const showPlaceholder = !template.previewUrl || imageError

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-900/50 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2',
            'flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lg',
            'focus:outline-none md:flex-row md:max-h-[80vh]'
          )}
        >
          <div className="relative aspect-[4/3] w-full shrink-0 bg-surface-secondary md:aspect-auto md:w-[55%]">
            {showPlaceholder ? (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-100" />
            ) : (
              <Image
                src={template.previewUrl}
                alt={template.name}
                fill
                className="object-contain p-4"
                unoptimized
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <Dialog.Title className="text-xl font-semibold text-text-primary">
                {template.nameUz ?? template.name}
              </Dialog.Title>
              <Dialog.Close
                className="rounded-lg p-2 text-text-muted hover:bg-brand-50"
                aria-label="Yopish"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <Badge>{categoryLabel}</Badge>
              {eventLabel && <Badge variant="default">{eventLabel}</Badge>}
              {template.isPremium && (
                <Badge variant="premium">
                  <Crown className="mr-1 h-3 w-3" />
                  PRO
                </Badge>
              )}
            </div>

            <Dialog.Description className="mb-6 text-sm leading-relaxed text-text-muted">
              {template.description}
            </Dialog.Description>

            {template.isPremium && (
              <div className="mb-6 rounded-xl border border-warning/30 bg-warning-light px-4 py-3 text-sm text-warning-dark">
                Bu shablon PRO rejada mavjud. Barcha premium funksiyalardan foydalanish uchun
                rejangizni yangilang.
              </div>
            )}

            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => {
                  onSelect(template.id)
                  onOpenChange(false)
                }}
              >
                <Zap className="h-4 w-4" />
                Bu shablonni tanlash
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  if (showPlaceholder) return
                  window.open(template.previewUrl, '_blank')
                }}
              >
                <Download className="h-4 w-4" />
                Preview yuklab olish
              </Button>
            </div>

            {template.isPremium && (
              <Button
                variant="ghost"
                className="mt-3 w-full"
                onClick={() => router.push('/dashboard')}
              >
                Pro rejimga o&apos;tish
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
