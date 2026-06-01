'use client'

import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Tanlang',
  className,
}: SelectProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && <span className="gildia-label">{label}</span>}
      <RadixSelect.Root value={value} onValueChange={onValueChange}>
        <RadixSelect.Trigger className="gildia-input flex items-center justify-between">
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="z-50 overflow-hidden rounded-lg border border-border bg-surface shadow-md">
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-pointer select-none items-center rounded-md px-8 py-2 text-sm text-text-primary outline-none data-[highlighted]:bg-brand-50"
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute left-2">
                    <Check className="h-4 w-4 text-brand-600" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  )
}
