'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterCheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function FilterCheckbox({ id, label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-lg py-2 text-sm text-text-primary transition-all duration-150 hover:bg-brand-50/50"
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-150',
          checked ? 'border-brand-600 bg-brand-600' : 'border-border bg-surface'
        )}
      >
        {checked && <Check className="h-3 w-3 text-text-inverse" strokeWidth={3} />}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {label}
    </label>
  )
}

interface FilterRadioProps {
  id: string
  name: string
  label: string
  checked: boolean
  onChange: () => void
}

export function FilterRadio({ id, name, label, checked, onChange }: FilterRadioProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-lg py-2 text-sm text-text-primary transition-all duration-150 hover:bg-brand-50/50"
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-150',
          checked ? 'border-brand-600' : 'border-border bg-surface'
        )}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
      </span>
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  )
}
