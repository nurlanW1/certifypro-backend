'use client'

import { cn } from '@/lib/utils'
import { useEventStore } from '@/store/eventStore'
import { BRANDING_KIT_OPTIONS } from '@/components/events/wizard/constants'
import type { BrandingKitId } from '@/types/event'

export function Step4BrandingKit() {
  const { brandingKit, setBrandingKit } = useEventStore()

  const select = (id: BrandingKitId) => {
    const kit = BRANDING_KIT_OPTIONS.find((k) => k.id === id)
    if (!kit) return
    setBrandingKit(id)
    useEventStore.getState().updateFormData({
      primaryColor: kit.primaryColor,
      accentColor: kit.accentColor,
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        To‘plam barcha materiallarga umumiy rang palitrasi va uslubni beradi.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {BRANDING_KIT_OPTIONS.map((kit) => {
          const selected = brandingKit === kit.id
          return (
            <button
              key={kit.id}
              type="button"
              onClick={() => select(kit.id)}
              className={cn(
                'rounded-xl border p-4 text-left transition-all duration-150',
                selected
                  ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20'
                  : 'border-border bg-surface hover:border-brand-200'
              )}
            >
              <div className="flex gap-2">
                <span
                  className="h-8 w-8 rounded-lg"
                  style={{ backgroundColor: kit.primaryColor }}
                />
                <span
                  className="h-8 w-8 rounded-lg"
                  style={{ backgroundColor: kit.accentColor }}
                />
              </div>
              <p className="mt-3 font-semibold text-text-primary">{kit.label}</p>
              <p className="mt-1 text-xs text-text-muted">{kit.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
