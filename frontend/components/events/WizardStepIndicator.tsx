'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { WIZARD_STEPS } from '@/components/events/wizard/constants'
import { LucideIconByName } from '@/components/events/wizard/LucideIconByName'

interface WizardStepIndicatorProps {
  currentStep: number
}

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  const t = useTranslations('eventWizard')

  return (
    <nav aria-label="Wizard bosqichlari" className="mb-8">
      <ol className="flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isActive = currentStep === step.id
          const isLast = index === WIZARD_STEPS.length - 1
          const titleKey = `step${step.id}` as 'step1'
          const descKey = `step${step.id}Desc` as 'step1Desc'

          return (
            <li key={step.id} className={cn('flex flex-1 items-center', isLast && 'flex-none')}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-150',
                    isActive && 'bg-accent text-text-inverse shadow-sm ring-4 ring-accent-dim',
                    isCompleted && 'bg-accent text-text-inverse',
                    !isActive &&
                      !isCompleted &&
                      'border border-divide bg-ink text-text-tertiary'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" aria-hidden />
                  ) : (
                    <LucideIconByName name={step.icon} className="h-5 w-5" />
                  )}
                </div>
                <div className="hidden text-center sm:block">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      isActive ? 'text-text-primary' : 'text-text-tertiary'
                    )}
                  >
                    {step.id}. {t(titleKey)}
                  </p>
                  <p className="mt-0.5 max-w-[7rem] text-xs leading-tight text-text-tertiary">
                    {t(descKey)}
                  </p>
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 transition-colors duration-150 sm:mx-4',
                    isCompleted ? 'bg-accent' : 'bg-divide'
                  )}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
