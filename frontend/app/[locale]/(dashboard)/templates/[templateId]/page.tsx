'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { Template } from '@/types/template'
import { nanoid } from 'nanoid'

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.templateId as string
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/templates?id=${templateId}`)
        if (res.ok) {
          const data = (await res.json()) as { template: Template }
          setTemplate(data.template)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [templateId])

  const startEditing = async () => {
    const designId = nanoid()
    const res = await fetch(`/api/designs/${designId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId,
        name: template?.nameUz ?? template?.name ?? 'Nomsiz dizayn',
        canvasData: { version: '5.3.0', objects: [], background: '#ffffff' },
      }),
    })
    if (!res.ok) {
      router.push(`/editor/${designId}?templateId=${templateId}`)
      return
    }
    router.push(`/editor/${designId}?templateId=${templateId}`)
  }

  if (loading) return <Spinner className="py-16" />
  if (!template) {
    return <p className="text-text-muted">Shablon topilmadi</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">
        {template.nameUz ?? template.name}
      </h1>
      <p className="text-sm text-text-secondary">{template.category}</p>
      <Card padding="none" className="overflow-hidden">
        <div className="relative aspect-video border border-divide bg-ink">
          <Image
            src={template.previewUrl || `/api/templates/${template.id}/preview`}
            alt={template.name}
            fill
            className="object-contain p-4"
            unoptimized
          />
        </div>
      </Card>
      <Button onClick={() => void startEditing()}>Muharrirda ochish</Button>
    </div>
  )
}
