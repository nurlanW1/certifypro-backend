'use client'

import Link from 'next/link'
import { Pencil, FileImage } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { templatesUrlForMaterial } from '@/lib/event-urls'
import {
  MATERIAL_LABELS,
  MATERIAL_STATUS_LABELS,
  type Event,
  type EventMaterial,
} from '@/types/event'

interface EventMaterialsGridProps {
  event: Event
}

function statusVariant(status: EventMaterial['status']): 'default' | 'success' | 'warning' {
  if (status === 'READY') return 'success'
  if (status === 'IN_PROGRESS') return 'warning'
  return 'default'
}

export function EventMaterialsGrid({ event }: EventMaterialsGridProps) {
  const materials = event.materials ?? []

  if (materials.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileImage className="mx-auto h-10 w-10 text-text-muted" />
        <p className="mt-3 font-medium text-text-primary">Materiallar topilmadi</p>
        <p className="mt-1 text-sm text-text-muted">
          Wizard orqali material tanlangan bo&apos;lishi kerak. Yangi tadbir yarating.
        </p>
        <Link href="/events/new" className="mt-4 inline-block">
          <Button>Yangi tadbir</Button>
        </Link>
      </Card>
    )
  }

  const readyCount = materials.filter((m) => m.status === 'READY').length

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        {readyCount} / {materials.length} material tayyor
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <Card key={material.id} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-text-primary">
                {MATERIAL_LABELS[material.category]}
              </h3>
              <Badge variant={statusVariant(material.status)}>
                {MATERIAL_STATUS_LABELS[material.status]}
              </Badge>
            </div>
            <p className="mt-2 flex-1 text-xs text-text-muted">
              {material.designId
                ? 'Dizayn bog‘langan — muharrirda tahrirlashingiz mumkin'
                : 'Shablon tanlang va dizayn yarating'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {material.designId ? (
                <Link
                  href={`/editor/${material.designId}?eventId=${event.id}&asset=1`}
                >
                  <Button size="sm" variant="secondary">
                    <Pencil className="h-3.5 w-3.5" />
                    Tahrirlash
                  </Button>
                </Link>
              ) : null}
              <Link href={templatesUrlForMaterial(event.id, material.category)}>
                <Button size="sm">
                  Shablon tanlash
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
