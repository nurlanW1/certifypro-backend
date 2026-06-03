'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ROUTES } from '@/lib/constants'

export default function EventMaterialsPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1>Materiallar</h1>
          <p className="mt-1 text-text-muted">Tadbir: {eventId}</p>
        </div>
        <Link href={ROUTES.templates}>
          <Button>
            <Plus className="h-4 w-4" />
            Shablon qo‘shish
          </Button>
        </Link>
      </div>
      <EmptyState
        title="Materiallar yo‘q"
        description="Shablon tanlang va ushbu tadbir uchun dizayn yarating."
        actionLabel="Shablonlar"
        onAction={() => {
          window.location.href = ROUTES.templates
        }}
      />
    </div>
  )
}
