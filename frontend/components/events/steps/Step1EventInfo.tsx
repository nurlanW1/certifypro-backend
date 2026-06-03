'use client'

import { MapPin, Building2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/store/eventStore'
import { EVENT_TYPE_OPTIONS } from '@/components/events/wizard/constants'
import { LucideIconByName } from '@/components/events/wizard/LucideIconByName'
import type { EventType } from '@/types/event'

export function Step1EventInfo() {
  const { formData, updateFormData } = useEventStore()
  const name = formData.name ?? ''
  const selectedType = formData.type

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="event-name" className="gildia-label">
          Tadbir nomi
        </label>
        <input
          id="event-name"
          type="text"
          className="gildia-input text-lg font-medium"
          placeholder="Masalan: AI Forum Toshkent 2025"
          value={name}
          onChange={(e) => updateFormData({ name: e.target.value })}
        />
        {name.trim().length > 0 && (
          <p className="mt-3 rounded-lg border border-border bg-brand-50 px-4 py-3 text-sm text-brand-800 transition-all duration-150">
            <span className="font-medium">Ko‘rinish:</span> {name}
          </p>
        )}
      </div>

      <div>
        <span className="gildia-label">Tadbir turi</span>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EVENT_TYPE_OPTIONS.map((option) => {
            const selected = selectedType === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({ type: option.value as EventType })}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border p-4 text-center transition-all duration-150',
                  selected
                    ? 'border-2 border-brand-600 bg-brand-50 shadow-sm'
                    : 'border border-border bg-surface hover:border-brand-200'
                )}
              >
                <span
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-lg',
                    option.iconClass
                  )}
                >
                  <LucideIconByName name={option.icon} />
                </span>
                <span className="text-sm font-medium text-text-primary">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="event-date" className="gildia-label">
            Tadbir sanasi
          </label>
          <input
            id="event-date"
            type="date"
            className="gildia-input"
            value={formData.date ?? ''}
            onChange={(e) => updateFormData({ date: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="participants" className="gildia-label">
            Ishtirokchilar soni
          </label>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id="participants"
              type="number"
              min={1}
              className="gildia-input pl-10"
              placeholder="100"
              value={formData.participantCount ?? ''}
              onChange={(e) =>
                updateFormData({
                  participantCount: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <p className="mt-1.5 text-xs text-text-muted">
            Bu sertifikat va nishonlar sonini aniqlaydi
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="gildia-label">
          Joylashuv
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id="location"
            type="text"
            className="gildia-input pl-10"
            placeholder="Toshkent IT Park, A blok"
            value={formData.location ?? ''}
            onChange={(e) => updateFormData({ location: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="organization" className="gildia-label">
          Tashkilot nomi
        </label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id="organization"
            type="text"
            className="gildia-input pl-10"
            placeholder="O'zbekiston sun'iy intellekt markazi"
            value={formData.organization ?? ''}
            onChange={(e) => updateFormData({ organization: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
