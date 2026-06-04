'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

function InviteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''
  const [preview, setPreview] = useState<{
    valid: boolean
    organizationName?: string
    email?: string
    expired?: boolean
  } | null>(null)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    if (!token) return
    void fetch(`/api/org/invites/preview?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then(setPreview)
  }, [token])

  const accept = async () => {
    setAccepting(true)
    try {
      const res = await fetch('/api/org/invites/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = (await res.json()) as { organization?: { name: string }; error?: string }
      if (!res.ok) {
        toast.error(data.error ?? 'Xatolik')
        return
      }
      toast.success(`${data.organization?.name ?? 'Agentlik'}ga qo‘shildingiz`)
      router.push('/agency')
    } finally {
      setAccepting(false)
    }
  }

  if (!token) {
    return (
      <Card className="p-6">
        <p className="text-text-muted">Taklif havolasida token yo‘q.</p>
      </Card>
    )
  }

  if (!preview) return <Spinner className="py-12" />

  if (!preview.valid) {
    return (
      <Card className="p-6">
        <p className="text-text-primary">
          {preview.expired ? 'Taklif muddati tugagan.' : 'Taklif topilmadi yoki ishlatilgan.'}
        </p>
        <Link href="/agency" className="mt-4 inline-block text-sm text-brand-600">
          Agentlik →
        </Link>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h1 className="text-xl font-semibold text-text-primary">Agentlik taklifi</h1>
      <p className="mt-2 text-text-muted">
        <strong>{preview.organizationName}</strong> sizni jamoaga taklif qilmoqda.
      </p>
      <p className="mt-1 text-sm text-text-muted">Email: {preview.email}</p>
      <Button className="mt-6" onClick={() => void accept()} isLoading={accepting}>
        Qabul qilish
      </Button>
    </Card>
  )
}

export default function InvitePage() {
  return (
    <div className="mx-auto max-w-lg py-8">
      <Suspense fallback={<Spinner className="py-12" />}>
        <InviteContent />
      </Suspense>
    </div>
  )
}
