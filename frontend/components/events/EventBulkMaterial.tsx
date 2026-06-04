'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Award, Badge as BadgeIcon, Tag, Download, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'
import { useBilling } from '@/hooks/useBilling'
import {
  downloadBulkCertificatesPdfZip,
  downloadBulkCertificatesZip,
} from '@/lib/export-certificates-zip'
import { BULK_MATERIAL_CONFIG, type BulkMaterialCategory } from '@/lib/bulk/material-config'

const ICONS: Record<BulkMaterialCategory, LucideIcon> = {
  CERTIFICATE: Award,
  BADGE: BadgeIcon,
  NAME_TAG: Tag,
}

interface EventBulkMaterialProps {
  category: BulkMaterialCategory
  showEmailAction?: React.ReactNode
}

export function EventBulkMaterial({ category, showEmailAction }: EventBulkMaterialProps) {
  const { event } = useEventWorkspace()
  const { billing } = useBilling()
  const [runningPng, setRunningPng] = useState(false)
  const [runningPdf, setRunningPdf] = useState(false)

  const config = BULK_MATERIAL_CONFIG[category]
  const Icon = ICONS[category]
  const material = event.materials?.find((m) => m.category === category)
  const masterDesignId = material?.designId

  const fetchBulk = async () => {
    const res = await fetch(`/api/events/${event.id}/bulk-materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterDesignId, category }),
    })
    const data = (await res.json()) as {
      items?: { participantName: string; canvasData: object }[]
      eventName?: string
      watermark?: boolean
      highQuality?: boolean
      zipSuffix?: string
      error?: string
      code?: string
    }
    if (!res.ok) {
      if (data.code === 'RATE_LIMITED') toast.error(data.error ?? 'Limit')
      else toast.error(data.error ?? 'Xatolik')
      throw new Error(data.error)
    }
    if (!data.items?.length) throw new Error('Natija bo‘sh')
    return data
  }

  const zipBaseName = () =>
    `${(event.name || 'tadbir').replace(/[^\w\-]+/g, '_')}-${config.zipSuffix}`

  const runPng = async () => {
    if (!masterDesignId) {
      toast.error(`Avval ${config.label.toLowerCase()} dizaynini tayyorlang`)
      return
    }
    if (!billing?.canUseBulkCertificates) {
      toast.error('Pro rejim kerak')
      return
    }
    setRunningPng(true)
    try {
      const data = await fetchBulk()
      await downloadBulkCertificatesZip(zipBaseName(), data.items!, {
        watermark: data.watermark,
        highQuality: data.highQuality,
      })
      toast.success(`${data.items!.length} ta ${config.label} (PNG ZIP)`)
    } catch {
      /* toast shown */
    } finally {
      setRunningPng(false)
    }
  }

  const runPdf = async () => {
    if (category !== 'CERTIFICATE') return
    if (!masterDesignId || !billing?.canUseBulkCertificates) return
    setRunningPdf(true)
    try {
      const data = await fetchBulk()
      await downloadBulkCertificatesPdfZip(zipBaseName(), data.items!, {
        watermark: data.watermark,
      })
      toast.success(`${data.items!.length} ta sertifikat (PDF ZIP)`)
    } catch {
      /* */
    } finally {
      setRunningPdf(false)
    }
  }

  return (
    <Card className="border-brand-200/60 bg-brand-50/30 p-5">
      <h3 className="flex items-center gap-2 font-semibold text-text-primary">
        <Icon className="h-5 w-5 text-brand-600" />
        Ommaviy {config.label.toLowerCase()}
      </h3>
      <p className="mt-2 text-sm text-text-muted">
        <code className="rounded bg-surface px-1">{'{{participantName}}'}</code> bilan ZIP eksport.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {billing?.canUseBulkCertificates ? (
          <>
            <Button onClick={() => void runPng()} isLoading={runningPng} disabled={!masterDesignId}>
              <Download className="h-4 w-4" />
              ZIP (PNG)
            </Button>
            {category === 'CERTIFICATE' && (
              <Button
                variant="secondary"
                onClick={() => void runPdf()}
                isLoading={runningPdf}
                disabled={!masterDesignId}
              >
                <FileText className="h-4 w-4" />
                ZIP (PDF)
              </Button>
            )}
            {showEmailAction}
            {masterDesignId && (
              <Link href={`/editor/${masterDesignId}?eventId=${event.id}&asset=1`}>
                <Button variant="secondary">Dizayn</Button>
              </Link>
            )}
          </>
        ) : (
          <Link href="/upgrade">
            <Button>Pro rejim</Button>
          </Link>
        )}
      </div>
    </Card>
  )
}
