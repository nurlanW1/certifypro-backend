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
import { toast } from 'sonner'

import { Step1EventInfo } from '@/components/event-create/wizard/step1-event-info'
import { Step2Branding } from '@/components/event-create/wizard/step2-branding'
import { Step3Materials } from '@/components/event-create/wizard/step3-materials'
import { Button } from '@/components/ui/button'
import { checkBillingAccess } from '@/lib/billing/access'
import { createEvent } from '@/lib/api/events'
import { getErrorMessage } from '@/lib/api/errors'
import {
  createEventId,
  type EventSetup,
} from '@/lib/event-create/event-setup'
import { createBuilderDraftFromSetup } from '@/lib/event-create/storage'
import { saveEventProgress } from '@/lib/persistence/event-progress'
import { useEventWizardStore } from '@/store/event-wizard-store'
import { cn } from '@/lib/utils'

const STEPS: { id: number; title: string; description: string; icon: LucideIcon }[] = [
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

function parseParticipantEstimate(value: string): number | undefined {
  const n = parseInt(value.replace(/\D/g, ''), 10)
  return Number.isFinite(n) ? n : undefined
}

function validateStep(step: number, setup: EventSetup): string | null {
  if (step === 1) {
    if (!setup.eventName.trim()) return 'Tadbir nomini kiriting'
    if (!setup.eventType) return 'Tadbir turini tanlang'
    if (!setup.organizationName.trim()) return 'Tashkilot nomini kiriting'
    if (!setup.eventDate) return 'Sanani kiriting'
    if (!setup.eventLocation.trim()) return 'Joylashuvni kiriting'
    if (!setup.participantEstimate) return 'Ishtirokchilar sonini tanlang'
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
    setup,
    selectedMaterials,
    resetWizard,
  } = useEventWizardStore()

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setStepVisible(false)
    const t = window.setTimeout(() => setStepVisible(true), 50)
    return () => window.clearTimeout(t)
  }, [currentStep])

  const goNext = () => {
    const err = validateStep(currentStep, setup)
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
      const eventGate = await checkBillingAccess('canCreateEvent')
      if (!eventGate.allowed) {
        toast.error(eventGate.message)
        return
      }
      const builderGate = await checkBillingAccess('canUseEventBuilder')
      if (!builderGate.allowed) {
        toast.error(builderGate.message)
        return
      }

      let eventId = createEventId()
      try {
        const created = await createEvent({
          name: setup.eventName.trim(),
          type: setup.eventType,
          organizationName: setup.organizationName.trim(),
          date: setup.eventDate,
          location: setup.eventLocation.trim(),
          description: setup.eventDescription?.trim() || undefined,
          language: setup.language,
          participantEstimate: parseParticipantEstimate(setup.participantEstimate),
          status: 'draft',
        })
        eventId = created.id
      } catch (apiErr) {
        toast.error(getErrorMessage(apiErr, 'Tadbir yaratib bo‘lmadi'))
        return
      }

      const builder = createBuilderDraftFromSetup(setup)
      for (const id of selectedMaterials) {
        builder.enabled[id] = true
      }

      saveEventProgress({ eventId, setup, draft: builder })
      toast.success('Loyiha yaratildi')
      resetWizard()
      router.push(`/dashboard/events/${eventId}/builder`)
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
                      'flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-150',
                      active && 'bg-primary text-primary-foreground shadow-md',
                      done && 'bg-emerald-600 text-white',
                      !active &&
                        !done &&
                        'border border-border bg-muted text-muted-foreground'
                    )}
                  >
                    {done ? <Check className="size-5" /> : <Icon className="size-5" />}
                  </span>
                  <span
                    className={cn(
                      'hidden text-center text-xs font-medium sm:block',
                      active ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </button>
                {index < STEPS.length - 1 ? (
                  <div
                    className={cn(
                      'mx-2 h-0.5 flex-1 transition-all duration-150',
                      currentStep > step.id ? 'bg-primary' : 'bg-border'
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>

      <section
        className={cn(
          'rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 md:p-6',
          stepVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      >
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {STEPS[currentStep - 1]?.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {STEPS[currentStep - 1]?.description}
          </p>
        </div>

        {currentStep === 1 && <Step1EventInfo />}
        {currentStep === 2 && <Step2Branding />}
        {currentStep === 3 && <Step3Materials />}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || submitting}
          >
            <ChevronLeft className="mr-1 size-4" />
            Orqaga
          </Button>
          <Button type="button" onClick={goNext} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Yaratilmoqda...
              </>
            ) : currentStep === 3 ? (
              'Loyiha yaratish'
            ) : (
              <>
                Davom etish
                <ChevronRight className="ml-1 size-4" />
              </>
            )}
          </Button>
        </div>
      </section>
    </div>
  )
}
