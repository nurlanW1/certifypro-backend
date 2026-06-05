'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Crown, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useBilling } from '@/hooks/useBilling'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { PLAN_LIMITS, PLAN_PRICES_UZS } from '@/lib/billing/plans'
import type { Plan } from '@prisma/client'

const isDevCheckout = process.env.NODE_ENV !== 'production'

const PLANS: { id: Plan; highlight?: boolean }[] = [
  { id: 'FREE' },
  { id: 'PRO', highlight: true },
  { id: 'ENTERPRISE' },
]

export default function UpgradePage() {
  return (
    <Suspense fallback={<Spinner className="py-16" />}>
      <UpgradePageContent />
    </Suspense>
  )
}

function UpgradePageContent() {
  const searchParams = useSearchParams()
  const { billing, loading, refresh } = useBilling()

  useEffect(() => {
    if (searchParams.get('paid') === '1') {
      toast.success('To‘lov qabul qilindi — reja yangilandi')
      void refresh()
    }
  }, [searchParams, refresh])

  const startCheckout = async (plan: Plan, provider: 'PAYME' | 'CLICK' | 'MOCK' = 'MOCK') => {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, provider }),
    })
    const data = (await res.json()) as {
      paymentUrl?: string | null
      instructions?: string
      error?: string
    }
    if (!res.ok) {
      toast.error(data.error ?? 'Xatolik')
      return
    }
    toast.success(data.instructions ?? 'To‘lov boshlandi')
    if (data.paymentUrl) {
      window.open(data.paymentUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const upgrade = async (plan: Plan) => {
    if (plan === 'FREE') return
    const res = await fetch('/api/billing/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = (await res.json()) as { ok?: boolean; message?: string; error?: string }
    if (!res.ok) {
      toast.error(data.error ?? 'Xatolik')
      return
    }
    toast.success(data.message ?? 'Reja yangilandi')
    void refresh()
  }

  if (loading) return <Spinner className="py-16" />

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-divide bg-ink">
          <Crown className="h-7 w-7 text-accent" />
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Rejalar</h1>
        <p className="mt-2 text-text-secondary">
          Hozirgi reja:{' '}
          <span className="font-medium text-text-primary">{billing?.planName ?? '—'}</span>
        </p>
      </div>

      {billing && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-text-primary">Foydalanish (oylik)</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <UsageBar
              label="Tadbirlar"
              used={billing.usage.eventsCount}
              max={billing.limits.maxEvents}
            />
            <UsageBar
              label="Dizaynlar"
              used={billing.usage.designsCount}
              max={billing.limits.maxDesigns}
            />
            <UsageBar
              label="Eksportlar"
              used={billing.usage.exportsCount}
              max={billing.limits.maxExports}
            />
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map(({ id, highlight }) => {
          const limits = PLAN_LIMITS[id]
          const isCurrent = billing?.plan === id
          const price = PLAN_PRICES_UZS[id]
          return (
            <Card
              key={id}
              className={
                highlight ? 'border-accent-border ring-2 ring-accent/20' : undefined
              }
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  {id === 'FREE' ? 'Bepul' : id === 'PRO' ? 'Pro' : 'Agentlik'}
                </h3>
                <p className="mt-1 text-2xl font-semibold text-accent">
                  {price != null ? `${price.toLocaleString('uz-UZ')} so‘m/oy` : 'Kelishuv'}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <Feature>{limits.maxEvents} tadbir</Feature>
                  <Feature>{limits.maxDesigns} dizayn</Feature>
                  <Feature>{limits.maxExports} eksport/oy</Feature>
                  <Feature>
                    {limits.premiumTemplates ? 'Premium shablonlar' : 'Faqat bepul shablonlar'}
                  </Feature>
                  <Feature>
                    {limits.participantLists ? 'Excel ishtirokchilar' : 'Ishtirokchilar yo‘q'}
                  </Feature>
                  <Feature>
                    {limits.fullPackageExport ? 'ZIP paket eksport' : 'Alohida eksport'}
                  </Feature>
                  <Feature>
                    {limits.bulkCertificates
                      ? `Ommaviy sertifikat (${limits.maxBulkCertificatesPerRun}/ishga tushirish)`
                      : 'Ommaviy sertifikat yo‘q'}
                  </Feature>
                </ul>
                <div className="mt-6">
                  {isCurrent ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Joriy reja
                    </Button>
                  ) : id === 'FREE' ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Bepul
                    </Button>
                  ) : id === 'ENTERPRISE' ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Bog‘laning
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {isDevCheckout && (
                        <>
                          <Button
                            className="w-full"
                            onClick={() => void startCheckout(id, 'MOCK')}
                          >
                            Sinov to‘lov (mock)
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full text-xs"
                            onClick={() => void upgrade(id)}
                          >
                            Darhol Pro (sinov)
                          </Button>
                        </>
                      )}
                      <Button
                        variant={isDevCheckout ? 'secondary' : 'primary'}
                        className="w-full"
                        onClick={() => void startCheckout(id, 'PAYME')}
                      >
                        Payme
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => void startCheckout(id, 'CLICK')}
                      >
                        Click
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <p className="text-center text-xs text-text-muted">
        Payme/Click uchun Vercel da PAYME_* va CLICK_* env belgilang. Aks holda mock to‘lov ishlaydi.
      </p>

      <div className="text-center">
        <Link href="/dashboard" className="text-sm font-medium text-accent hover:text-accent-hover">
          ← Bosh sahifa
        </Link>
      </div>
    </div>
  )
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-4 w-4 shrink-0 text-success" />
      {children}
    </li>
  )
}

function UsageBar({
  label,
  used,
  max,
}: {
  label: string
  used: number
  max: number
}) {
  const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-text-muted">
        <span>{label}</span>
        <span>
          {used} / {max}
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
