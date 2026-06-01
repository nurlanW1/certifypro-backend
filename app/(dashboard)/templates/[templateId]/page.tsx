'use client'

import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function TemplateDetailPage() {
  const { templateId } = useParams<{ templateId: string }>()
  const router = useRouter()

  return (
    <>
      <TopBar title="Shablon" />
      <div className="flex-1 overflow-auto p-6">
        <Card className="max-w-lg">
          <p className="mb-4 text-sm text-text-muted">Shablon ID: {templateId}</p>
          <Button
            onClick={() => router.push(`/editor/${templateId}`)}
          >
            Tahrirlashni boshlash
          </Button>
        </Card>
      </div>
    </>
  )
}
