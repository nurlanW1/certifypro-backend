'use client'

import { Layers } from 'lucide-react'
import { elementLabel } from '@/lib/templates/templateUtils'
import { cn } from '@/lib/utils'
import type { TemplateElement } from '@/lib/templates/types'

interface EditorSidebarProps {
  elements: TemplateElement[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function EditorSidebar({ elements, selectedId, onSelect }: EditorSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-divide bg-surface md:block">
      <div className="flex items-center gap-2 border-b border-divide px-4 py-3">
        <Layers className="h-4 w-4 text-text-muted" />
        <h2 className="text-sm font-semibold text-text-primary">Layers</h2>
      </div>
      <div className="max-h-[calc(100vh-9rem)] overflow-y-auto p-3">
        {elements.map((element) => (
          <button
            key={element.id}
            type="button"
            onClick={() => onSelect(element.id)}
            className={cn(
              'mb-1 w-full rounded px-3 py-2 text-left text-xs transition-all',
              selectedId === element.id
                ? 'bg-brand-50 text-brand-800'
                : 'text-text-secondary hover:bg-surface-secondary'
            )}
          >
            <span className="block truncate font-medium">{elementLabel(element)}</span>
            <span className="block truncate text-[10px] text-text-muted">{element.type}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
