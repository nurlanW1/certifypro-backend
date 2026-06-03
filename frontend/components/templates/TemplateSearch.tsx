'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTemplateStore } from '@/store/templateStore'

interface TemplateSearchProps {
  className?: string
}

export function TemplateSearch({ className }: TemplateSearchProps) {
  const { searchQuery, setSearchQuery } = useTemplateStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(localQuery)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [localQuery, setSearchQuery])

  return (
    <div className={className}>
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Shablon qidiring... (Sertifikat, Nishon, Poster...)"
          className="gildia-input w-full pl-10 pr-10"
          aria-label="Shablon qidirish"
        />
        {localQuery.length > 0 && (
          <button
            type="button"
            onClick={() => setLocalQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted hover:text-text-primary"
            aria-label="Qidiruvni tozalash"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
