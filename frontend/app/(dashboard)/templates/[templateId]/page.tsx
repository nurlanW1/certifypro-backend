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

  const startEditing = () => {
    const designId = nanoid()
    router.push(`/editor/${designId}?templateId=${templateId}`)
  }

  if (loading) return <Spinner className="py-16" />
  if (!template) {
    return <p className="text-text-muted">Shablon topilmadi</p>
  }

  return (
    <div className="space-y-6">
      <h1>{template.nameUz ?? template.name}</h1>
      <Card padding="none" className="overflow-hidden">
        <div className="relative aspect-video bg-subtle border border-divide">
          {template.previewUrl ? (
            <Image
              src={template.previewUrl}
              alt={template.name}
              fill
              className="object-contain"
              unoptimized
            />
          ) : null}
        </div>
      </Card>
      <Button onClick={startEditing}>Muharrirda ochish</Button>
    </div>
  )
}
