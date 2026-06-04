'use client'

import { useEventStore, getWizardFreeMaterialCount } from '@/store/eventStore'
import {
  EVENT_TYPE_LABELS,
  MATERIAL_LABELS,
  BRANDING_KIT_LABELS,
} from '@/types/event'
import { formatDate } from '@/lib/utils'

export function Step5Review() {
  const { formData, selectedMaterials, brandingKit } = useEventStore()
  const freeCount = getWizardFreeMaterialCount(selectedMaterials)

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-surface-secondary p-4">
        <h3 className="text-sm font-semibold text-text-primary">Tadbir</h3>
        <dl className="mt-2 space-y-1 text-sm text-text-muted">
          <div>
            <dt className="inline font-medium text-text-secondary">Nom: </dt>
            <dd className="inline">{formData.name || '—'}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-text-secondary">Turi: </dt>
            <dd className="inline">
              {formData.type ? EVENT_TYPE_LABELS[formData.type] : '—'}
            </dd>
          </div>
          {formData.date && (
            <div>
              <dt className="inline font-medium text-text-secondary">Sana: </dt>
              <dd className="inline">{formatDate(formData.date)}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-surface-secondary p-4">
        <h3 className="text-sm font-semibold text-text-primary">Brending to‘plami</h3>
        <p className="mt-1 text-sm text-text-muted">
          {brandingKit ? BRANDING_KIT_LABELS[brandingKit] : 'Tanlanmagan'}
        </p>
        <div className="mt-2 flex gap-2">
          <span
            className="h-6 w-12 rounded"
            style={{ backgroundColor: formData.primaryColor ?? '#534AB7' }}
          />
          <span
            className="h-6 w-12 rounded"
            style={{ backgroundColor: formData.accentColor ?? '#26215C' }}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface-secondary p-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Materiallar ({selectedMaterials.length})
        </h3>
        <p className="mt-1 text-xs text-text-muted">
          {freeCount} ta bepul, {selectedMaterials.length - freeCount} ta premium
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {selectedMaterials.map((c) => (
            <li
              key={c}
              className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-800"
            >
              {MATERIAL_LABELS[c]}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
