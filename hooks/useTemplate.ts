'use client'

import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import type { Template, TemplateFilterState } from '@/types/template'

export function useTemplate(initialFilters?: Partial<TemplateFilterState>) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filters, setFilters] = useState<TemplateFilterState>({
    search: '',
    premiumOnly: false,
    ...initialFilters,
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set('category', filters.category)
      if (filters.eventType) params.set('eventType', filters.eventType)
      if (filters.search) params.set('search', filters.search)
      if (filters.premiumOnly) params.set('premium', 'true')

      const res = await fetch(`/api/templates?${params.toString()}`)
      if (!res.ok) throw new Error('Shablonlarni yuklab bo‘lmadi')
      const data = (await res.json()) as { templates: Template[] }
      setTemplates(data.templates)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Xatolik yuz berdi'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  return {
    templates,
    filters,
    isLoading,
    setFilters,
    fetchTemplates,
  }
}
