'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { TemplateGrid } from '@/components/templates/TemplateGrid'
import { TemplateFilterBar } from '@/components/templates/TemplateFilter'
import { useTemplate } from '@/hooks/useTemplate'
import type { TemplateFilter } from '@/types/template'

export default function TemplatesPage() {
  const [filter, setFilter] = useState<TemplateFilter>({})
  const { templates, loading, fetchTemplates } = useTemplate()

  useEffect(() => {
    void fetchTemplates(filter)
  }, [fetchTemplates, filter])

  return (
    <>
      <TopBar title="Shablonlar" />
      <div className="flex-1 overflow-auto p-6">
        <TemplateFilterBar filter={filter} onChange={setFilter} />
        <TemplateGrid templates={templates} loading={loading} />
      </div>
    </>
  )
}
