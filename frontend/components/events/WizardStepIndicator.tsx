'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WIZARD_STEPS } from '@/components/events/wizard/constants'
import { LucideIconByName } from '@/components/events/wizard/LucideIconByName'

interface WizardStepIndicatorProps {
  currentStep: number
}

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  return (
    <nav aria-label="Wizard bosqichlari" className="mb-8">
      <ol className="flex items-center justify-between gap-1">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isActive = currentStep === step.id
          const isLast = index === WIZARD_STEPS.length - 1

          return (
            <li key={step.id} className={cn('flex flex-1 items-center', isLast && 'flex-none')}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-sm border-2 text-sm font-bold transition-all duration-150',
                    isActive &&
                      'border-text-primary bg-accent-500 text-text-primary shadow-brutal-sm',
                    isCompleted && 'border-text-primary bg-brand-600 text-text-inverse',
                    !isActive &&
                      !isCompleted &&
                      'border-border bg-surface text-text-muted'
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
                      'font-display text-xs font-bold',
                      isActive ? 'text-brand-800' : 'text-text-muted'
                    )}
                  >
                    {step.id}. {step.title}
                  </p>
                  <p className="mt-0.5 max-w-[7rem] text-[10px] leading-tight text-text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-1 h-1 flex-1 border-t-2 border-dashed transition-colors duration-150 sm:mx-3',
                    isCompleted ? 'border-brand-600' : 'border-border'
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
