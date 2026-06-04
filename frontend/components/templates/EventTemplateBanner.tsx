'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MATERIAL_LABELS, type MaterialCategory } from '@/types/event'

interface EventTemplateBannerProps {
  eventId: string
  eventName: string
  category: MaterialCategory
}

export function EventTemplateBanner({
  eventId,
  eventName,
  category,
}: EventTemplateBannerProps) {
  return (
    <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-800">
            Tadbir uchun shablon
          </p>
          <p className="text-sm text-text-primary">
            <span className="font-semibold">{eventName}</span>
            {' · '}
            {MATERIAL_LABELS[category]}
          </p>
        </div>
        <Link
          href={`/events/${eventId}/materials`}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Materiallarga qaytish
        </Link>
      </div>
    </div>
  )
}
