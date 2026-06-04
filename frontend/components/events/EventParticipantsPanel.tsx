'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Upload, Users, FileSpreadsheet, FileDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'
import { useBilling } from '@/hooks/useBilling'
import Link from 'next/link'
import { EventBulkMaterial } from '@/components/events/EventBulkMaterial'
import { EventSendCertificates } from '@/components/events/EventSendCertificates'
import { ParticipantQrButton } from '@/components/participants/ParticipantQrButton'

interface Participant {
  id: string
  fullName: string
  email?: string | null
  organization?: string | null
}

export function EventParticipantsPanel() {
  const { event } = useEventWorkspace()
  const { billing } = useBilling()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    void fetch(`/api/events/${event.id}/participants`)
      .then((r) => r.json())
      .then((d: { participants: Participant[] }) => setParticipants(d.participants ?? []))
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false))
  }, [event.id])

  useEffect(() => {
    load()
  }, [load])

  const onFile = (file: File) => {
    if (!billing?.canUseParticipantLists) {
      toast.error('Ishtirokchilar ro‘yxati Pro rejimda')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const csv = typeof reader.result === 'string' ? reader.result : ''
      void importCsv(csv, false)
    }
    reader.readAsText(file)
  }

  const importCsv = async (csv: string, replace: boolean) => {
    setImporting(true)
    try {
      const res = await fetch(`/api/events/${event.id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv, replace }),
      })
      const data = (await res.json()) as {
        imported?: number
        total?: number
        error?: string
        code?: string
      }
      if (!res.ok) {
        if (data.code?.startsWith('PLAN_')) {
          toast.error(data.error ?? 'Pro kerak')
        } else {
          toast.error(data.error ?? 'Import xatosi')
        }
        return
      }
      toast.success(`${data.imported ?? 0} ishtirokchi qo‘shildi (jami ${data.total ?? 0})`)
      load()
    } finally {
      setImporting(false)
    }
  }

  const canImport = billing?.canUseParticipantLists

  return (
    <div className="space-y-6">
      <EventBulkMaterial
        category="CERTIFICATE"
        showEmailAction={<EventSendCertificates />}
      />
      <EventBulkMaterial category="BADGE" />
      <EventBulkMaterial category="NAME_TAG" />

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-text-primary">
              <Users className="h-5 w-5" />
              Ishtirokchilar
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              CSV yuklang: ustunlar{' '}
              <code className="rounded bg-surface-secondary px-1">name, email, organization</code>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
          {canImport && (
            <a
              href={`/api/events/${event.id}/participants/export`}
              className="gildia-btn-secondary inline-flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Hisobot (CSV)
            </a>
          )}
          {canImport ? (
            <label className="gildia-btn-primary inline-flex cursor-pointer items-center gap-2">
              <Upload className="h-4 w-4" />
              CSV import
              <input
                type="file"
                accept=".csv,.txt"
                className="sr-only"
                disabled={importing}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) onFile(f)
                  e.target.value = ''
                }}
              />
            </label>
          ) : (
            <Link href="/upgrade">
              <Button>Pro rejim</Button>
            </Link>
          )}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-surface-tertiary" />
      ) : participants.length === 0 ? (
        <Card className="p-8 text-center">
          <FileSpreadsheet className="mx-auto h-10 w-10 text-text-muted" />
          <p className="mt-3 text-sm text-text-muted">Hali ishtirokchi yo‘q</p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-border bg-surface-secondary">
                <tr>
                  <th className="px-4 py-2 font-medium">Ism</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Tashkilot</th>
                  <th className="px-4 py-2 font-medium w-12">QR</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-text-primary">{p.fullName}</td>
                    <td className="px-4 py-2 text-text-muted">{p.email ?? '—'}</td>
                    <td className="px-4 py-2 text-text-muted">{p.organization ?? '—'}</td>
                    <td className="px-4 py-2">
                      {billing?.canUseBulkCertificates ? (
                        <ParticipantQrButton
                          eventId={event.id}
                          participantId={p.id}
                          participantName={p.fullName}
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border px-4 py-2 text-xs text-text-muted">
            {participants.length} ishtirokchi — sertifikat muharririda{' '}
            <code className="rounded bg-surface-secondary px-1">{'{{participantName}}'}</code>{' '}
            ishlatiladi
          </p>
        </Card>
      )}
    </div>
  )
}
