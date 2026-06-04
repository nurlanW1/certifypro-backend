'use client'

import { Sparkles } from 'lucide-react'
import { useEventStore } from '@/store/eventStore'
import { MATERIAL_LABELS } from '@/types/event'

export function Step6Launch() {
  const { formData, selectedMaterials } = useEventStore()

  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
        <Sparkles className="h-8 w-8 text-brand-600" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-text-primary">
        {formData.name || 'Tadbir'} tayyor
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-muted">
        {selectedMaterials.length} ta material bilan tadbir markazi yaratiladi. Keyin har
        bir material uchun shablon tanlab dizayn qilasiz.
      </p>
      <ul className="mt-6 max-w-sm text-left text-sm text-text-muted">
        {selectedMaterials.slice(0, 5).map((c) => (
          <li key={c} className="flex items-center gap-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            {MATERIAL_LABELS[c]}
          </li>
        ))}
        {selectedMaterials.length > 5 && (
          <li className="py-1 text-xs">+ {selectedMaterials.length - 5} ta boshqa</li>
        )}
      </ul>
    </div>
  )
}
