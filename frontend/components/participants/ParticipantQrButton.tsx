'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { QrCode } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/Button'

interface ParticipantQrButtonProps {
  eventId: string
  participantId: string
  participantName: string
}

export function ParticipantQrButton({
  eventId,
  participantId,
  participantName,
}: ParticipantQrButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [claimUrl, setClaimUrl] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setQrDataUrl(null)
    try {
      const res = await fetch(
        `/api/events/${eventId}/participants/${participantId}/qr`
      )
      const data = (await res.json()) as {
        qrDataUrl?: string
        claimUrl?: string
        error?: string
      }
      if (!res.ok) {
        toast.error(data.error ?? 'QR xatosi')
        return
      }
      setQrDataUrl(data.qrDataUrl ?? null)
      setClaimUrl(data.claimUrl ?? null)
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className="text-text-muted hover:text-brand-600"
        title="QR kod"
        disabled={loading}
        onClick={() => void load()}
      >
        <QrCode className="h-4 w-4" />
      </button>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-6 shadow-xl">
          <Dialog.Title className="font-semibold text-text-primary">
            {participantName}
          </Dialog.Title>
          <p className="mt-1 text-xs text-text-muted">
            Ishtirokchi ushbu QR orqali sertifikatni yuklab oladi.
          </p>
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR"
              className="mx-auto mt-4 rounded-lg border border-border"
              width={280}
              height={280}
            />
          )}
          {claimUrl && (
            <p className="mt-3 break-all text-xs text-text-muted">{claimUrl}</p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            {claimUrl && (
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() => {
                  void navigator.clipboard.writeText(claimUrl)
                  toast.success('Havola nusxalandi')
                }}
              >
                Havolani nusxalash
              </Button>
            )}
            <Dialog.Close asChild>
              <Button variant="ghost">Yopish</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
