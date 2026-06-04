'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Building2, Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { AgencyTeamPanel } from '@/components/agency/AgencyTeamPanel'
import { PLAN_LABELS } from '@/lib/billing/plans'
import type { Plan } from '@prisma/client'

interface OrgInfo {
  id: string
  name: string
  slug: string
  plan: Plan
  role: string
  memberCount: number
  eventCount: number
}

export default function AgencyPage() {
  const [org, setOrg] = useState<OrgInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  const load = () => {
    void fetch('/api/org')
      .then((r) => r.json())
      .then((d: { organization: OrgInfo | null }) => setOrg(d.organization))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const create = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined }),
      })
      const data = (await res.json()) as { organization?: OrgInfo; error?: string }
      if (!res.ok) {
        toast.error(data.error ?? 'Xatolik')
        return
      }
      toast.success('Agentlik yaratildi')
      setOrg(data.organization ?? null)
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <Spinner className="py-16" />

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-text-primary">
          <Building2 className="h-7 w-7 text-brand-600" />
          Agentlik
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Jamoa va tadbirlarni bir tashkilot ostida boshqaring (ENTERPRISE).
        </p>
      </div>

      {org ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text-primary">{org.name}</h2>
          <p className="text-sm text-text-muted">/{org.slug}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat label="Reja" value={PLAN_LABELS[org.plan]} />
            <Stat label="A’zolar" value={String(org.memberCount)} />
            <Stat label="Tadbirlar" value={String(org.eventCount)} />
          </div>
          <p className="mt-4 text-xs text-text-muted">Rolingiz: {org.role}</p>
          <div className="mt-6">
            <AgencyTeamPanel canManage={org.role === 'OWNER' || org.role === 'ADMIN'} />
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <h2 className="font-semibold text-text-primary">Agentlik yarating</h2>
          <p className="mt-1 text-sm text-text-muted">
            Yangi tadbirlar avtomatik shu agentlikka bog‘lanadi.
          </p>
          <label className="mt-4 block text-sm">
            <span className="gildia-label">Nomi</span>
            <input
              className="gildia-input mt-1"
              placeholder="Masalan: Gildia Agency"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <Button className="mt-4" onClick={() => void create()} isLoading={creating}>
            <Users className="h-4 w-4" />
            Yaratish
          </Button>
        </Card>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-secondary p-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-semibold text-text-primary">{value}</p>
    </div>
  )
}
