'use client'

import { useState } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useEventStore,
  getWizardFreeMaterialCount,
  getWizardPremiumMaterialCount,
} from '@/store/eventStore'
import { WIZARD_MATERIALS } from '@/components/events/wizard/constants'
import { LucideIconByName } from '@/components/events/wizard/LucideIconByName'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { MaterialCategory } from '@/types/event'

export function Step3Materials() {
  const {
    selectedMaterials,
    toggleMaterial,
    selectAllMaterials,
    clearMaterials,
  } = useEventStore()

  const [premiumModalOpen, setPremiumModalOpen] = useState(false)
  const [pendingPremium, setPendingPremium] = useState<MaterialCategory | null>(null)

  const allSelected =
    selectedMaterials.length === WIZARD_MATERIALS.length && WIZARD_MATERIALS.length > 0

  const handleToggle = (category: MaterialCategory, isPremium: boolean) => {
    const isSelected = selectedMaterials.includes(category)
    if (!isSelected && isPremium) {
      setPendingPremium(category)
      setPremiumModalOpen(true)
      return
    }
    toggleMaterial(category)
  }

  const confirmPremium = () => {
    if (pendingPremium) {
      toggleMaterial(pendingPremium)
    }
    setPendingPremium(null)
    setPremiumModalOpen(false)
  }

  const freeCount = getWizardFreeMaterialCount(selectedMaterials)
  const premiumCount = getWizardPremiumMaterialCount(selectedMaterials)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface-secondary px-4 py-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-text-primary">
          <Switch.Root
            checked={allSelected}
            onCheckedChange={(checked) => {
              if (checked) selectAllMaterials()
              else clearMaterials()
            }}
            className="relative h-6 w-11 rounded-full bg-border data-[state=checked]:bg-brand-600"
          >
            <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-surface shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
          Hammasini tanlash
        </label>
        <p className="text-sm text-text-muted">
          {selectedMaterials.length} ta material • {freeCount} ta bepul, {premiumCount} ta premium
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {WIZARD_MATERIALS.map((material) => {
          const selected = selectedMaterials.includes(material.category)
          return (
            <div
              key={material.category}
              className={cn(
                'flex items-center gap-4 rounded-xl border p-4 transition-all duration-150',
                selected
                  ? 'border-brand-600 bg-brand-50 shadow-sm'
                  : 'border-border bg-surface hover:border-brand-200'
              )}
            >
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
                  selected ? 'bg-brand-600 text-text-inverse' : 'bg-surface-tertiary text-brand-600'
                )}
              >
                <LucideIconByName name={material.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-text-primary">{material.label}</p>
                  {material.isPremium && (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-warning-light px-1.5 py-0.5 text-[10px] font-semibold uppercase text-warning-dark">
                      <Crown className="h-3 w-3" />
                      PRO
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-muted">{material.description}</p>
              </div>
              <Switch.Root
                checked={selected}
                onCheckedChange={() => handleToggle(material.category, material.isPremium)}
                className="relative h-6 w-11 shrink-0 rounded-full bg-border data-[state=checked]:bg-brand-600"
                aria-label={`${material.label} tanlash`}
              >
                <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-surface shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          )
        })}
      </div>

      <p className="rounded-lg border border-border bg-surface-secondary px-4 py-3 text-center text-sm text-text-secondary">
        <span className="font-semibold text-text-primary">{selectedMaterials.length}</span> ta
        material tanlandi •{' '}
        <span className="text-success-dark">{freeCount}</span> ta bepul,{' '}
        <span className="text-warning-dark">{premiumCount}</span> ta premium
      </p>

      <Modal
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
        title="PRO material"
        description="Bu material PRO rejada mavjud. Davom etish uchun PRO rejaga o'ting yoki boshqa bepul materiallarni tanlang."
      >
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setPremiumModalOpen(false)}>
            Bekor qilish
          </Button>
          <Button className="flex-1" onClick={confirmPremium}>
            PRO bilan davom etish
          </Button>
        </div>
      </Modal>
    </div>
  )
}
