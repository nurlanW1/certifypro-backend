'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MATERIAL_LABELS, type MaterialCategory } from '@/types/event'
import type { TemplateFilter as FilterType } from '@/types/template'

interface TemplateFilterProps {
  filter: FilterType
  onChange: (filter: FilterType) => void
}

const categoryOptions = Object.entries(MATERIAL_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export function TemplateFilterBar({ filter, onChange }: TemplateFilterProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Shablon qidirish..."
          value={filter.search ?? ''}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select
        value={filter.category ?? ''}
        onValueChange={(v) =>
          onChange({
            ...filter,
            category: v ? (v as MaterialCategory) : undefined,
          })
        }
        options={[{ value: '', label: 'Barcha kategoriyalar' }, ...categoryOptions]}
        placeholder="Kategoriya"
      />
    </div>
  )
}
