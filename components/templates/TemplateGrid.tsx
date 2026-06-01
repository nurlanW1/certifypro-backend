'use client'

import { TemplateCard } from '@/components/templates/TemplateCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import type { Template } from '@/types/template'

interface TemplateGridProps {
  templates: Template[]
  loading?: boolean
}

export function TemplateGrid({ templates, loading }: TemplateGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        title="Shablonlar topilmadi"
        description="Filtrlarni o'zgartiring yoki keyinroq qayta urinib ko'ring"
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}
