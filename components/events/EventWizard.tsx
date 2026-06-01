'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Layout,
  Loader2,
  Palette,
  type LucideIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Step1EventInfo } from '@/components/events/steps/Step1EventInfo'
import { Step2Branding } from '@/components/events/steps/Step2Branding'
import { Step3Materials } from '@/components/events/steps/Step3Materials'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/store/eventStore'
import type { EventFormData } from '@/types/event'

interface WizardStep {
  id: number
  title: string
  description: string
  icon: LucideIcon
}

const STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Tadbir haqida',
    description: "Asosiy ma'lumotlarni kiriting",
    icon: Calendar,
  },
  {
    id: 2,
    title: 'Brending',
    description: 'Logo va ranglarni sozlang',
    icon: Palette,
  },
  {
    id: 3,
    title: 'Materiallar',
    description: 'Kerakli dizaynlarni tanlang',
    icon: Layout,
  },
]

function validateStep(step: number, formData: Partial<EventFormData>): string | null {
  if (step === 1) {
    if (!formData.name?.trim()) return 'Tadbir nomini kiriting'
    if (!formData.type) return 'Tadbir turini tanlang'
  }
  if (step === 3) {
    return null
  }
  return null
}

export function EventWizard() {
  const router = useRouter()
  const topRef = useRef<HTMLDivElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [stepVisible, setStepVisible] = useState(true)

  const {
    currentStep,
    nextStep,
    prevStep,
    setStep,
    formData,
    selectedMaterials,
    addEvent,
    resetWizard,
  } = useEventStore()

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setStepVisible(false)
    const t = window.setTimeout(() => setStepVisible(true), 50)
    return () => window.clearTimeout(t)
  }, [currentStep])

  const goNext = () => {
    const err = validateStep(currentStep, formData)
    if (err) {
      toast.error(err)
      return
    }
    if (currentStep === 3) {
      if (selectedMaterials.length === 0) {
        toast.error('Kamida bitta material tanlang')
        return
      }
      void handleSubmit()
      return
    }
    nextStep()
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        formData: formData as EventFormData,
        selectedMaterials,
      }
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      const data = (await res.json()) as { event: { id: string } }
      addEvent({
        ...(formData as EventFormData),
        id: data.event.id,
        userId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      toast.success('Loyiha yaratildi')
      resetWizard()
      router.push(`/events/${data.event.id}`)
    } catch {
      toast.error('Tadbir yaratishda xatolik')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div ref={topRef}>
      <nav className="mb-8" aria-label="Wizard bosqichlari">
        <ol className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const done = currentStep > step.id
            const active = currentStep === step.id
            const Icon = step.icon
            return (
              <li key={step.id} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => done && setStep(step.id)}
                  disabled={!done && !active}
                  className="flex flex-col items-center gap-2 disabled:cursor-default"
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-150',
                      active && 'bg-brand-600 text-white shadow-md',
                      done && 'bg-success text-white',
                      !active &&
                        !done &&
                        'border border-border bg-surface-tertiary text-text-muted'
                    )}
                  >
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <span
                    className={cn(
                      'hidden text-center text-xs font-medium sm:block',
                      active ? 'text-brand-800' : 'text-text-muted'
                    )}
                  >
                    {step.title}
                  </span>
                </button>
                {index < STEPS.length - 1 ? (
                  <div
                    className={cn(
                      'mx-2 h-0.5 flex-1 transition-all duration-150',
                      currentStep > step.id ? 'bg-brand-600' : 'bg-border'
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>

      <Card
        className={cn(
          'transition-all duration-300',
          stepVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      >
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {STEPS[currentStep - 1]?.title}
          </h2>
          <p className="text-sm text-text-muted">{STEPS[currentStep - 1]?.description}</p>
        </div>

        {currentStep === 1 && <Step1EventInfo />}
        {currentStep === 2 && <Step2Branding />}
        {currentStep === 3 && <Step3Materials />}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1 || submitting}
            className="sm:min-w-[120px]"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Orqaga
          </Button>
          <Button
            type="button"
            onClick={goNext}
            loading={submitting}
            className="sm:min-w-[160px]"
          >
            {currentStep === 3 ? (
              submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yaratilmoqda...
                </>
              ) : (
                'Loyiha yaratish'
              )
            ) : (
              <>
                Davom etish
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
