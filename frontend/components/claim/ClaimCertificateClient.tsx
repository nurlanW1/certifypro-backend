'use client'

import { useEffect, useState } from 'react'
import { Award, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import {
  downloadCanvasDataAsPdf,
  downloadCanvasDataAsPng,
} from '@/lib/export/canvas-data-export'

export function ClaimCertificateClient({ token }: { token: string }) {
  const [data, setData] = useState<{
    participantName: string
    eventName: string
    canvasData: object
    watermark: boolean
    highQuality: boolean
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null)

  useEffect(() => {
    void fetch(`/api/claim/${encodeURIComponent(token)}`)
      .then(async (r) => {
        const json = (await r.json()) as {
          error?: string
          participantName?: string
          eventName?: string
          canvasData?: object
          watermark?: boolean
          highQuality?: boolean
        }
        if (!r.ok) {
          setError(json.error ?? 'Topilmadi')
          return
        }
        if (json.canvasData && json.participantName && json.eventName) {
          setData({
            participantName: json.participantName,
            eventName: json.eventName,
            canvasData: json.canvasData,
            watermark: json.watermark ?? false,
            highQuality: json.highQuality ?? false,
          })
        }
      })
      .catch(() => setError('Yuklab bo‘lmadi'))
  }, [token])

  const filename = () =>
    (data?.participantName ?? 'sertifikat').replace(/[^\w\-]+/g, '_')

  const downloadPng = async () => {
    if (!data) return
    setDownloading('png')
    try {
      await downloadCanvasDataAsPng(data.canvasData, filename(), {
        watermark: data.watermark,
        highQuality: data.highQuality,
      })
    } catch {
      setError('PNG yaratib bo‘lmadi')
    } finally {
      setDownloading(null)
    }
  }

  const downloadPdf = async () => {
    if (!data) return
    setDownloading('pdf')
    try {
      await downloadCanvasDataAsPdf(data.canvasData, filename(), {
        watermark: data.watermark,
      })
    } catch {
      setError('PDF yaratib bo‘lmadi')
    } finally {
      setDownloading(null)
    }
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-text-primary">{error}</p>
      </Card>
    )
  }

  if (!data) return <Spinner className="py-16" />

  return (
    <Card className="p-8 text-center">
      <Award className="mx-auto h-12 w-12 text-brand-600" />
      <h1 className="mt-4 text-xl font-semibold text-text-primary">{data.eventName}</h1>
      <p className="mt-2 text-text-muted">{data.participantName}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button onClick={() => void downloadPng()} isLoading={downloading === 'png'}>
          <Download className="h-4 w-4" />
          PNG
        </Button>
        <Button
          variant="secondary"
          onClick={() => void downloadPdf()}
          isLoading={downloading === 'pdf'}
        >
          <FileText className="h-4 w-4" />
          PDF (A4)
        </Button>
      </div>
    </Card>
  )
}
