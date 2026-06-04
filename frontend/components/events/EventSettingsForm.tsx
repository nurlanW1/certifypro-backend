'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'
import { EVENT_TYPE_LABELS, type EventType } from '@/types/event'

export function EventSettingsForm() {
  const { event, refresh } = useEventWorkspace()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: event.name,
    type: event.type,
    date: event.date ? event.date.slice(0, 10) : '',
    location: event.location,
    organization: event.organization,
    participantCount: event.participantCount ?? '',
  })

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          participantCount: form.participantCount
            ? Number(form.participantCount)
            : undefined,
        }),
      })
      if (!res.ok) throw new Error()
      refresh()
      toast.success('Sozlamalar saqlandi')
    } catch {
      toast.error('Xatolik')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="space-y-4 p-6">
      <label className="block text-sm">
        <span className="gildia-label">Tadbir nomi</span>
        <input
          className="gildia-input mt-1"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </label>
      <label className="block text-sm">
        <span className="gildia-label">Turi</span>
        <select
          className="gildia-input mt-1"
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as EventType }))}
        >
          {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((t) => (
            <option key={t} value={t}>
              {EVENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="gildia-label">Sana</span>
        <input
          type="date"
          className="gildia-input mt-1"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        />
      </label>
      <label className="block text-sm">
        <span className="gildia-label">Joy</span>
        <input
          className="gildia-input mt-1"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        />
      </label>
      <label className="block text-sm">
        <span className="gildia-label">Tashkilot</span>
        <input
          className="gildia-input mt-1"
          value={form.organization}
          onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
        />
      </label>
      <Button onClick={() => void save()} isLoading={saving}>
        Saqlash
      </Button>
    </Card>
  )
}
