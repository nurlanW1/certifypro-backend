'use client'

import { useState } from 'react'

import { BadgeChip } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { WIZARD_MATERIALS } from '@/lib/event-create/wizard-materials'
import { useEventWizardStore } from '@/store/event-wizard-store'
import { cn } from '@/lib/utils'

export function Step3Materials() {
  const {
    selectedMaterials,
    toggleMaterial,
    selectAllMaterials,
    clearMaterials,
  } = useEventWizardStore()
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [pendingPremium, setPendingPremium] = useState<string | null>(null)

  const allSelected = selectedMaterials.length === WIZARD_MATERIALS.length
  const freeCount = WIZARD_MATERIALS.filter(
    (m) => !m.isPremium && selectedMaterials.includes(m.catalogId)
  ).length
  const premiumCount = WIZARD_MATERIALS.filter(
    (m) => m.isPremium && selectedMaterials.includes(m.catalogId)
  ).length

  const handleToggle = (catalogId: string, isPremium: boolean) => {
    const on = selectedMaterials.includes(catalogId)
    if (!on && isPremium) {
      setPendingPremium(catalogId)
      setPremiumOpen(true)
      return
    }
    toggleMaterial(catalogId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Kerakli dizayn materiallarini tanlang
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => (allSelected ? clearMaterials() : selectAllMaterials())}
            className="size-4 rounded border-border text-primary focus:ring-primary/30"
          />
          Hammasini tanlash
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {WIZARD_MATERIALS.map(({ catalogId, label, description, icon: Icon, isPremium }) => {
          const on = selectedMaterials.includes(catalogId)
          return (
            <div
              key={catalogId}
              className={cn(
                'flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-150',
                on && 'border-primary/40 bg-primary/5'
              )}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{label}</p>
                  {isPremium ? (
                    <BadgeChip variant="premium">PRO</BadgeChip>
                  ) : (
                    <BadgeChip variant="free">Bepul</BadgeChip>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => handleToggle(catalogId, isPremium)}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-all duration-150',
                  on ? 'bg-primary' : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all duration-150',
                    on ? 'left-[1.35rem]' : 'left-0.5'
                  )}
                />
              </button>
            </div>
          )
        })}
      </div>

      <p className="rounded-xl bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
        {selectedMaterials.length} ta material tanlandi • {freeCount} ta bepul, {premiumCount}{' '}
        ta premium
      </p>

      <Dialog open={premiumOpen} onOpenChange={setPremiumOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Premium material</DialogTitle>
            <DialogDescription>
              Bu material PRO rejada mavjud. Davom etish uchun premium funksiyani
              faollashtirasizmi?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPendingPremium(null)
                setPremiumOpen(false)
              }}
            >
              Bekor qilish
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (pendingPremium) toggleMaterial(pendingPremium)
                setPendingPremium(null)
                setPremiumOpen(false)
              }}
            >
              PRO ni yoqish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
