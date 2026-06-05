'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

interface MemberRow {
  id: string
  email: string
  name: string | null
  role: string
  joinedAt: string
}

interface InviteRow {
  id: string
  email: string
  role: string
  expiresAt: string
  emailSentAt?: string | null
}

export function AgencyTeamPanel({ canManage }: { canManage: boolean }) {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [invites, setInvites] = useState<InviteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [lastAcceptUrl, setLastAcceptUrl] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/org/members').then((r) => r.json()),
      canManage ? fetch('/api/org/invites').then((r) => r.json()) : Promise.resolve({ invites: [] }),
    ])
      .then(([m, i]) => {
        setMembers((m as { members?: MemberRow[] }).members ?? [])
        setInvites((i as { invites?: InviteRow[] }).invites ?? [])
      })
      .finally(() => setLoading(false))
  }, [canManage])

  useEffect(() => {
    load()
  }, [load])

  const sendInvite = async () => {
    if (!email.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/org/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = (await res.json()) as {
        invite?: { acceptUrl: string }
        error?: string
      }
      if (!res.ok) {
        toast.error(data.error ?? 'Xatolik')
        return
      }
      const inv = data.invite as { acceptUrl?: string; emailSent?: boolean; emailError?: string }
      if (inv.emailSent === false && inv.emailError) {
        toast.error(`Email yuborilmadi: ${inv.emailError}`)
      } else if (inv.emailSent) {
        toast.success('Taklif email orqali yuborildi')
      } else {
        toast.success('Taklif yaratildi (havolani qo‘lda yuboring)')
      }
      setLastAcceptUrl(inv.acceptUrl ?? null)
      setEmail('')
      load()
    } finally {
      setSending(false)
    }
  }

  const revokeInvite = async (id: string) => {
    const res = await fetch(`/api/org/invites/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Bekor qilib bo‘lmadi')
      return
    }
    toast.success('Taklif bekor qilindi')
    load()
  }

  if (loading) return <Spinner className="py-8" />

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="font-semibold text-text-primary">Jamoa</h3>
        <ul className="mt-3 divide-y divide-divide">
          {members.map((m) => (
            <li key={m.id} className="flex justify-between py-2 text-sm">
              <span>
                {m.name ?? m.email}
                <span className="ml-2 text-text-tertiary">({m.role})</span>
              </span>
              <span className="text-text-tertiary">{m.email}</span>
            </li>
          ))}
          {members.length === 0 && (
            <li className="py-2 text-sm text-text-tertiary">A’zolar yo‘q</li>
          )}
        </ul>
      </Card>

      {canManage && (
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold text-text-primary">
            <UserPlus className="h-4 w-4" />
            Taklif yuborish
          </h3>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              className="gildia-input flex-1"
              type="email"
              placeholder="email@kompaniya.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={() => void sendInvite()} isLoading={sending}>
              <Mail className="h-4 w-4" />
              Taklif
            </Button>
          </div>
          {lastAcceptUrl && (
            <p className="mt-2 break-all text-xs text-text-muted">
              Havola: {lastAcceptUrl}
            </p>
          )}

          {invites.length > 0 && (
            <ul className="mt-4 space-y-2">
              {invites.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-divide bg-ink px-3 py-2 text-sm"
                >
                  <span>
                    {inv.email}{' '}
                    <span className="text-text-tertiary">({inv.role})</span>
                    {inv.emailSentAt && (
                      <span className="ml-1 text-success">✓ email</span>
                    )}
                  </span>
                  <button
                    type="button"
                    className="text-text-tertiary transition-colors hover:text-danger"
                    onClick={() => void revokeInvite(inv.id)}
                    aria-label="Bekor qilish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  )
}
