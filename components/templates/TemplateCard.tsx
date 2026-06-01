'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Template } from '@/types/template'
import { MATERIAL_LABELS } from '@/types/event'

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/templates/${template.id}`}>
      <Card padding="sm" className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-surface-tertiary">
          {template.previewUrl ? (
            <Image
              src={template.previewUrl}
              alt={template.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-muted text-sm">
              Preview
            </div>
          )}
          {template.isPremium && (
            <Badge variant="premium" className="absolute right-2 top-2">
              Premium
            </Badge>
          )}
        </div>
        <h3 className="font-medium text-text-primary">{template.nameUz ?? template.name}</h3>
        <p className="mt-1 text-xs text-text-muted">
          {MATERIAL_LABELS[template.category as keyof typeof MATERIAL_LABELS] ??
            template.category}
        </p>
      </Card>
    </Link>
  )
}
