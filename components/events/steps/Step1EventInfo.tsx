'use client'

import {
  BookOpen,
  Building2,
  FlaskConical,
  GraduationCap,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/store/eventStore'
import type { EventType } from '@/types/event'

const EVENT_TYPES: {
  value: EventType
  label: string
  icon: LucideIcon
  colorClass: string
}[] = [
  { value: 'CONFERENCE', label: 'Konferentsiya', icon: Users, colorClass: 'text-brand-600' },
  { value: 'SEMINAR', label: 'Seminar', icon: BookOpen, colorClass: 'text-success' },
  { value: 'FORUM', label: 'Forum', icon: MessageSquare, colorClass: 'text-warning' },
  { value: 'WORKSHOP', label: 'Masterklass', icon: Wrench, colorClass: 'text-danger' },
  { value: 'CORPORATE', label: 'Korporativ', icon: Building2, colorClass: 'text-brand-600' },
  { value: 'SCIENTIFIC', label: 'Ilmiy', icon: FlaskConical, colorClass: 'text-success' },
  { value: 'EDUCATIONAL', label: "Ta'lim", icon: GraduationCap, colorClass: 'text-warning' },
  { value: 'OTHER', label: 'Boshqa', icon: MoreHorizontal, colorClass: 'text-text-muted' },
]

export function Step1EventInfo() {
  const { formData, updateFormData } = useEventStore()
  const selectedType = formData.type

  return (
    <div className="space-y-6">
      <div>
        <Input
          label="Tadbir nomi"
          placeholder="Masalan: AI Forum Toshkent 2025"
          value={formData.name ?? ''}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className="text-base"
        />
        {formData.name?.trim() ? (
          <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800 transition-all duration-150">
            {formData.name}
          </p>
        ) : null}
      </div>

      <div>
        <span className="gildia-label">Tadbir turi</span>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EVENT_TYPES.map(({ value, label, icon: Icon, colorClass }) => {
            const selected = selectedType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateFormData({ type: value })}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-150',
                  selected
                    ? 'border-2 border-brand-600 bg-brand-50 shadow-sm'
                    : 'border border-border bg-white hover:border-brand-200'
                )}
              >
                <Icon className={cn('h-6 w-6', colorClass)} />
                <span className="text-xs font-medium text-text-primary">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <Input
        label="Tadbir sanasi"
        type="date"
        value={formData.date ?? ''}
        onChange={(e) => updateFormData({ date: e.target.value })}
      />

      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-[2.35rem] z-10 h-4 w-4 text-text-muted" />
        <Input
          label="Joylashuv"
          placeholder="Toshkent IT Park, A blok"
          value={formData.location ?? ''}
          onChange={(e) => updateFormData({ location: e.target.value })}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Building2 className="pointer-events-none absolute left-3 top-[2.35rem] z-10 h-4 w-4 text-text-muted" />
        <Input
          label="Tashkilot nomi"
          placeholder="O'zbekiston sun'iy intellekt markazi"
          value={formData.organization ?? ''}
          onChange={(e) => updateFormData({ organization: e.target.value })}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Users className="pointer-events-none absolute left-3 top-[2.35rem] z-10 h-4 w-4 text-text-muted" />
        <Input
          label="Ishtirokchilar soni"
          type="number"
          min={1}
          placeholder="100"
          value={formData.participantCount ?? ''}
          onChange={(e) =>
            updateFormData({
              participantCount: e.target.value
                ? Number(e.target.value)
                : undefined,
            })
          }
          className="pl-10"
        />
        <p className="mt-1 text-xs text-text-muted">
          Bu sertifikat va nishonlar sonini aniqlaydi
        </p>
      </div>
    </div>
  )
}
