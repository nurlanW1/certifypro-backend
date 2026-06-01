'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { EventFormData, EventType } from '@/types/event'
import { EVENT_TYPE_LABELS } from '@/types/event'

const eventTypeOptions = (Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((key) => ({
  value: key,
  label: EVENT_TYPE_LABELS[key],
}))

const languageOptions = [
  { value: 'uz', label: "O'zbek" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
]

interface EventFormProps {
  initial?: Partial<EventFormData>
  onSubmit: (data: EventFormData) => void | Promise<void>
  isLoading?: boolean
}

const defaultValues: EventFormData = {
  name: '',
  type: 'CONFERENCE',
  date: '',
  location: '',
  organization: '',
  language: 'uz',
  primaryColor: '#534AB7',
  accentColor: '#26215C',
}

export function EventForm({ initial, onSubmit, isLoading }: EventFormProps) {
  const [form, setForm] = useState<EventFormData>({ ...defaultValues, ...initial })

  const update = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void onSubmit(form)
      }}
    >
      <Input
        label="Tadbir nomi"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
        required
      />
      <Select
        label="Turi"
        value={form.type}
        onValueChange={(v) => update('type', v as EventType)}
        options={eventTypeOptions}
      />
      <Input
        label="Sana"
        type="date"
        value={form.date}
        onChange={(e) => update('date', e.target.value)}
      />
      <Input
        label="Joy"
        value={form.location}
        onChange={(e) => update('location', e.target.value)}
      />
      <Input
        label="Tashkilot"
        value={form.organization}
        onChange={(e) => update('organization', e.target.value)}
      />
      <Select
        label="Til"
        value={form.language}
        onValueChange={(v) => update('language', v as EventFormData['language'])}
        options={languageOptions}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Asosiy rang"
          type="color"
          value={form.primaryColor}
          onChange={(e) => update('primaryColor', e.target.value)}
        />
        <Input
          label="Accent rang"
          type="color"
          value={form.accentColor}
          onChange={(e) => update('accentColor', e.target.value)}
        />
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full">
        Saqlash
      </Button>
    </form>
  )
}
