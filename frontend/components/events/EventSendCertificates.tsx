'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useEventWorkspace } from '@/contexts/EventWorkspaceContext'
import { useBilling } from '@/hooks/useBilling'

export function EventSendCertificates() {
  const { event } = useEventWorkspace()
  const { billing } = useBilling()
  const [sending, setSending] = useState(false)

  const certMaterial = event.materials?.find((m) => m.category === 'CERTIFICATE')
  const masterDesignId = certMaterial?.designId

  const sendEmails = async () => {
    if (!masterDesignId) {
      toast.error('Avval sertifikat dizaynini tayyorlang')
      return
    }
    if (!billing?.canUseBulkCertificates) {
      toast.error('Pro rejim kerak')
      return
    }

    setSending(true)
    try {
      const res = await fetch(
        `/api/events/${event.id}/participants/send-certificates`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ masterDesignId }),
        }
      )
      const data = (await res.json()) as {
        sent?: number
        failed?: number
        noEmail?: number
        skipped?: number
        error?: string
        code?: string
      }
      if (!res.ok) {
        if (data.code === 'RATE_LIMITED') {
          toast.error(data.error ?? 'Limit')
        } else {
          toast.error(data.error ?? 'Xatolik')
        }
        return
      }
      toast.success(
        `${data.sent ?? 0} ta email yuborildi` +
          (data.failed ? `, ${data.failed} xato` : '') +
          (data.noEmail ? ` (${data.noEmail} ishtirokchida email yo‘q)` : '')
      )
    } finally {
      setSending(false)
    }
  }

  if (!billing?.canUseBulkCertificates) {
    return (
      <Link href="/upgrade">
        <Button variant="secondary" className="w-full sm:w-auto">
          <Mail className="h-4 w-4" />
          Email orqali yuborish (Pro)
        </Button>
      </Link>
    )
  }

  return (
    <Button
      variant="secondary"
      onClick={() => void sendEmails()}
      isLoading={sending}
      disabled={!masterDesignId}
    >
      <Mail className="h-4 w-4" />
      Email orqali yuborish
    </Button>
  )
}
