'use client'

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { alignObject } from '@/lib/editor/fabric-utils'
import { cn } from '@/lib/utils'

const ALIGNMENTS = [
  { id: 'left' as const, icon: AlignLeft, label: 'Chap' },
  { id: 'center' as const, icon: AlignCenter, label: 'Markaz' },
  { id: 'right' as const, icon: AlignRight, label: "O'ng" },
  { id: 'top' as const, icon: AlignStartVertical, label: 'Yuqori' },
  { id: 'middle' as const, icon: AlignCenterVertical, label: 'Vertikal' },
  { id: 'bottom' as const, icon: AlignEndVertical, label: 'Past' },
]

export function AlignmentTools() {
  const { fabricCanvas, selectedObject, pushHistory } = useEditorStore()

  if (!selectedObject || !fabricCanvas) {
    return (
      <p className="text-xs text-text-muted">Hizalash uchun element tanlang</p>
    )
  }

  return (
    <div className="space-y-2">
      <p className="gildia-label">Hizalash</p>
      <div className="grid grid-cols-3 gap-1">
        {ALIGNMENTS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            title={label}
            onClick={() => {
              alignObject(fabricCanvas, selectedObject, id)
              pushHistory()
            }}
            className={cn(
              'flex items-center justify-center rounded-lg border border-border p-2',
              'text-text-secondary transition-all duration-150 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800'
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  )
}
