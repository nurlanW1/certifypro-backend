'use client'

import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import type { Template, TemplateFilter } from '@/types/template'

export function useTemplate() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTemplates = useCallback(async (filter?: TemplateFilter) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter?.category) params.set('category', filter.category)
      if (filter?.eventType) params.set('eventType', filter.eventType)
      if (filter?.search) params.set('search', filter.search)
      const res = await fetch(`/api/templates?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch templates')
      const data = (await res.json()) as Template[]
      setTemplates(data)
    } catch {
      toast.error('Shablonlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }, [])

  return { templates, loading, fetchTemplates }
}
