'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Download, Pencil, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'
import { useBilling } from '@/hooks/useBilling'
import { downloadEventPackageZip } from '@/lib/export-package-client'
import {
  MATERIAL_LABELS,
  MATERIAL_STATUS_LABELS,
  type EventMaterial,
} from '@/types/event'

function statusVariant(status: EventMaterial['status']): 'default' | 'success' | 'warning' {
  if (status === 'READY') return 'success'
  if (status === 'IN_PROGRESS') return 'warning'
  return 'default'
}

export function EventExportPanel() {
  const { event } = useEventWorkspace()
  const { billing } = useBilling()
  const [packaging, setPackaging] = useState(false)
  const materials = event.materials ?? []
  const ready = materials.filter((m) => m.status === 'READY' && m.designId)

  const downloadPackage = async () => {
    if (!billing?.canUseFullPackageExport) {
      toast.error('ZIP paket eksporti Pro rejimda')
      return
    }
    setPackaging(true)
    try {
      const res = await fetch(`/api/events/${event.id}/export-package`)
      const data = (await res.json()) as {
        eventName?: string
        items?: {
          materialLabel: string
          designName: string
          canvasData: object
        }[]
        watermark?: boolean
        highQuality?: boolean
        error?: string
      }
      if (!res.ok) {
        toast.error(data.error ?? 'Paket eksporti xatosi')
        return
      }
      if (!data.items?.length) {
        toast.error('Tayyor materiallar yo‘q')
        return
      }
      await downloadEventPackageZip(data.eventName ?? event.name, data.items, {
        watermark: data.watermark,
        highQuality: data.highQuality,
      })
      toast.success('ZIP yuklab olindi')
      void fetch('/api/billing/me')
    } catch {
      toast.error('ZIP yaratib bo‘lmadi')
    } finally {
      setPackaging(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <p className="text-sm text-text-muted">
          Tayyor materiallarni muharrirda PNG/PDF yuklab oling yoki Pro rejimda barchasini ZIP
          qiling.
        </p>
        <p className="mt-2 text-lg font-semibold text-text-primary">
          {ready.length} / {materials.length} tayyor
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => void downloadPackage()}
            isLoading={packaging}
            disabled={ready.length === 0}
          >
            <Package className="h-4 w-4" />
            ZIP paket (Pro)
          </Button>
          {!billing?.canUseFullPackageExport && (
            <Link href="/upgrade">
              <Button variant="secondary">Pro ga o‘tish</Button>
            </Link>
          )}
        </div>
      </Card>

      <ul className="space-y-3">
        {materials.map((m) => (
          <li key={m.id} className="gildia-card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-text-primary">{MATERIAL_LABELS[m.category]}</p>
              <Badge variant={statusVariant(m.status)} className="mt-1">
                {MATERIAL_STATUS_LABELS[m.status]}
              </Badge>
            </div>
            <div className="flex gap-2">
              {m.designId ? (
                <>
                  <Link href={`/editor/${m.designId}?eventId=${event.id}&asset=1`}>
                    <Button size="sm" variant="secondary">
                      <Pencil className="h-3.5 w-3.5" />
                      Muharrir
                    </Button>
                  </Link>
                  <Link href={`/editor/${m.designId}?eventId=${event.id}&asset=1`}>
                    <Button size="sm" disabled={m.status !== 'READY'}>
                      <Download className="h-3.5 w-3.5" />
                      Eksport
                    </Button>
                  </Link>
                </>
              ) : (
                <span className="text-xs text-text-muted">Avval shablon tanlang</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
