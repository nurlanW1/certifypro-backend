'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EventForm } from '@/components/events/EventForm'
import type { EventFormData } from '@/types/event'

interface EventWizardProps {
  onComplete: (data: EventFormData) => void
  loading?: boolean
}

const steps = ['Asosiy ma\'lumot', 'Brending', 'Tasdiqlash']

export function EventWizard({ onComplete, loading }: EventWizardProps) {
  const [step, setStep] = useState(0)

  return (
    <div>
      <div className="mb-8 flex gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`flex-1 rounded-lg px-3 py-2 text-center text-xs font-medium ${
              i <= step
                ? 'bg-brand-600 text-white'
                : 'bg-surface-tertiary text-text-muted'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <EventForm
          onSubmit={(data) => {
            onComplete(data)
          }}
          loading={loading}
        />
      )}

      <div className="mt-6 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Orqaga
        </Button>
        <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
          Keyingi
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
