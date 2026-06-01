'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MATERIAL_LABELS } from '@/types/event'

const materialTypes = Object.entries(MATERIAL_LABELS)

export default function EventMaterialsPage() {
  const { eventId } = useParams<{ eventId: string }>()

  return (
    <>
      <TopBar title="Materiallar" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {materialTypes.map(([key, label]) => (
            <Card key={key} padding="sm">
              <p className="font-medium text-text-primary">{label}</p>
              <Link href={`/templates?category=${key}&eventId=${eventId}`} className="mt-3 block">
                <Button variant="secondary" size="sm" className="w-full">
                  Shablon tanlash
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
