'use client'

import {
  BookOpen,
  Building2,
  FlaskConical,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WizardField } from '@/components/event-create/wizard/wizard-field'
import {
  EVENT_TYPE_OPTIONS,
  PARTICIPANT_ESTIMATE_OPTIONS,
  type EventSetup,
  type EventType,
} from '@/lib/event-create/event-setup'
import { useEventWizardStore } from '@/store/event-wizard-store'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<EventType, LucideIcon> = {
  conference: Users,
  seminar: BookOpen,
  forum: MessageSquare,
  workshop: Wrench,
  corporate: Building2,
  scientific: FlaskConical,
  other: MoreHorizontal,
}

const TYPE_COLORS: Record<EventType, string> = {
  conference: 'text-primary',
  seminar: 'text-emerald-600',
  forum: 'text-amber-600',
  workshop: 'text-destructive',
  corporate: 'text-primary',
  scientific: 'text-emerald-600',
  other: 'text-muted-foreground',
}

export function Step1EventInfo() {
  const { setup, updateSetup } = useEventWizardStore()

  return (
    <div className="space-y-6">
      <WizardField label="Tadbir nomi *">
        <Input
          value={setup.eventName}
          placeholder="Masalan: AI Forum Toshkent 2025"
          className="text-base"
          onChange={(e) => updateSetup({ eventName: e.target.value })}
        />
        {setup.eventName.trim() ? (
          <p className="rounded-lg bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-all duration-150">
            {setup.eventName}
          </p>
        ) : null}
      </WizardField>

      <WizardField label="Tadbir turi *">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EVENT_TYPE_OPTIONS.map((opt) => {
            const selected = setup.eventType === opt.value
            const Icon = TYPE_ICONS[opt.value]
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateSetup({ eventType: opt.value })}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-150',
                  selected
                    ? 'border-2 border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30'
                    : 'border-border bg-card hover:border-primary/40'
                )}
              >
                <Icon className={cn('h-6 w-6', TYPE_COLORS[opt.value])} />
                <span className="text-xs font-medium text-foreground">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </WizardField>

      <div className="grid gap-4 sm:grid-cols-2">
        <WizardField label="Tadbir sanasi *">
          <Input
            type="date"
            value={setup.eventDate}
            onChange={(e) => updateSetup({ eventDate: e.target.value })}
          />
        </WizardField>

        <WizardField label="Ishtirokchilar soni *">
          <Select
            value={setup.participantEstimate || undefined}
            onValueChange={(val) =>
              updateSetup({
                participantEstimate: (val ?? '') as EventSetup['participantEstimate'],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tanlang" />
            </SelectTrigger>
            <SelectContent>
              {PARTICIPANT_ESTIMATE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            Bu sertifikat va nishonlar sonini aniqlaydi
          </p>
        </WizardField>
      </div>

      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-[2.35rem] z-10 size-4 text-muted-foreground" />
        <WizardField label="Joylashuv *">
          <Input
            className="pl-10"
            value={setup.eventLocation}
            placeholder="Toshkent IT Park, A blok"
            onChange={(e) => updateSetup({ eventLocation: e.target.value })}
          />
        </WizardField>
      </div>

      <div className="relative">
        <Building2 className="pointer-events-none absolute left-3 top-[2.35rem] z-10 size-4 text-muted-foreground" />
        <WizardField label="Tashkilot nomi *">
          <Input
            className="pl-10"
            value={setup.organizationName}
            placeholder="O'zbekiston sun'iy intellekt markazi"
            onChange={(e) => updateSetup({ organizationName: e.target.value })}
          />
        </WizardField>
      </div>
    </div>
  )
}
