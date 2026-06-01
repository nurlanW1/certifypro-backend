'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { EVENT_TYPE_LABELS, type EventFormData, type EventType } from '@/types/event'

interface EventFormProps {
  onSubmit: (data: EventFormData) => void
  loading?: boolean
}

const eventTypeOptions = Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export function EventForm({ onSubmit, loading }: EventFormProps) {
  const [form, setForm] = useState<EventFormData>({
    name: '',
    type: 'CONFERENCE',
    date: '',
    location: '',
    organization: '',
    language: 'uz',
    primaryColor: '#534AB7',
    accentColor: '#26215C',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Tadbir nomi"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Select
        label="Tadbir turi"
        value={form.type}
        onValueChange={(v) => setForm({ ...form, type: v as EventType })}
        options={eventTypeOptions}
      />
      <Input
        label="Sana"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <Input
        label="Joy"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      <Input
        label="Tashkilot"
        value={form.organization}
        onChange={(e) => setForm({ ...form, organization: e.target.value })}
      />
      <Button type="submit" loading={loading} className="w-full">
        Saqlash
      </Button>
    </form>
  )
}
