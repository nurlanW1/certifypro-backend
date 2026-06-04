'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'
import type { Event } from '@/types/event'

export function EventBrandingForm() {
  const { event, refresh } = useEventWorkspace()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    primaryColor: event.primaryColor,
    accentColor: event.accentColor,
    language: event.language,
  })

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Saqlab bo‘lmadi')
      const data = (await res.json()) as { event: Event }
      refresh()
      toast.success('Brending yangilandi')
      setForm({
        primaryColor: data.event.primaryColor,
        accentColor: data.event.accentColor,
        language: data.event.language,
      })
    } catch {
      toast.error('Xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <p className="mb-6 text-sm text-text-muted">
        Logo va ranglar yangi yaratiladigan dizaynlarning boshlang‘ich foniga qo‘llanadi.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="gildia-label">Asosiy rang</span>
          <input
            type="color"
            className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-border"
            value={form.primaryColor}
            onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="gildia-label">Urg‘u rangi</span>
          <input
            type="color"
            className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-border"
            value={form.accentColor}
            onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))}
          />
        </label>
      </div>
      <Button className="mt-6" onClick={() => void save()} isLoading={saving}>
        Saqlash
      </Button>
    </Card>
  )
}
