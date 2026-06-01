'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FileImage, Settings } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EVENT_TYPE_LABELS } from '@/types/event'

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge>Tadbir</Badge>
          <h1 className="mt-2">Tadbir #{eventId.slice(0, 8)}</h1>
          <p className="mt-1 text-text-muted">{EVENT_TYPE_LABELS.CONFERENCE}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Settings className="h-4 w-4" />
            Sozlamalar
          </Button>
          <Link href={`/events/${eventId}/materials`}>
            <Button>
              <FileImage className="h-4 w-4" />
              Materiallar
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <p className="text-sm text-text-muted">
          Tadbir tafsilotlari va materiallar shu yerda ko‘rsatiladi. Maʼlumotlarni API orqali
          yuklash uchun DATABASE_URL va Clerk sozlamalarini kiriting.
        </p>
      </Card>
    </div>
  )
}
