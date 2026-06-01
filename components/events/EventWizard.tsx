'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { WizardStepIndicator } from '@/components/events/WizardStepIndicator'
import { Step1EventInfo } from '@/components/events/steps/Step1EventInfo'
import { Step2Branding } from '@/components/events/steps/Step2Branding'
import { Step3Materials } from '@/components/events/steps/Step3Materials'
import { useEventStore } from '@/store/eventStore'
import type { Event, EventFormData } from '@/types/event'

function validateStep1(formData: Partial<EventFormData>): string | null {
  if (!formData.name?.trim()) return 'Tadbir nomini kiriting'
  if (!formData.type) return 'Tadbir turini tanlang'
  return null
}

function validateStep3(selectedCount: number): string | null {
  if (selectedCount === 0) return 'Kamida bitta material tanlang'
  return null
}

function buildFormPayload(formData: Partial<EventFormData>): EventFormData {
  return {
    name: formData.name ?? '',
    type: formData.type ?? 'CONFERENCE',
    date: formData.date ?? '',
    location: formData.location ?? '',
    organization: formData.organization ?? '',
    language: formData.language ?? 'uz',
    primaryColor: formData.primaryColor ?? '#534AB7',
    accentColor: formData.accentColor ?? '#26215C',
    logoUrl: formData.logoUrl,
    participantCount: formData.participantCount,
  }
}

export function EventWizard() {
  const router = useRouter()
  const topRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    currentStep,
    nextStep,
    prevStep,
    formData,
    selectedMaterials,
    isLoading,
    setLoading,
    addEvent,
    resetWizard,
  } = useEventStore()

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentStep])

  const handleNext = () => {
    if (currentStep === 1) {
      const error = validateStep1(formData)
      if (error) {
        toast.error(error)
        return
      }
    }
    nextStep()
  }

  const handleSubmit = async () => {
    const materialsError = validateStep3(selectedMaterials.length)
    if (materialsError) {
      toast.error(materialsError)
      return
    }

    const step1Error = validateStep1(formData)
    if (step1Error) {
      toast.error(step1Error)
      return
    }

    setIsSubmitting(true)
    setLoading(true)

    try {
      const payload = buildFormPayload(formData)
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: payload,
          selectedMaterials,
        }),
      })

      if (!res.ok) {
        throw new Error('Tadbir yaratib bo‘lmadi')
      }

      const data = (await res.json()) as {
        event: Event
        selectedMaterials: typeof selectedMaterials
      }

      addEvent(data.event)
      toast.success('Loyiha muvaffaqiyatli yaratildi')
      resetWizard()
      router.push(`/events/${data.event.id}/materials`)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Xatolik yuz berdi'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <div ref={topRef}>
      <Card className="overflow-hidden p-6 sm:p-8">
        <WizardStepIndicator currentStep={currentStep} />

        <div key={currentStep} className="wizard-step-animate min-h-[320px]">
          {currentStep === 1 && <Step1EventInfo />}
          {currentStep === 2 && <Step2Branding />}
          {currentStep === 3 && <Step3Materials />}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting || isLoading}
            className={currentStep === 1 ? 'invisible sm:invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </Button>

          {currentStep < 3 ? (
            <Button type="button" onClick={handleNext} className="sm:min-w-[160px]">
              Davom etish
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => void handleSubmit()}
              isLoading={isSubmitting || isLoading}
              className="sm:min-w-[200px]"
            >
              <Sparkles className="h-4 w-4" />
              Loyiha yaratish
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
