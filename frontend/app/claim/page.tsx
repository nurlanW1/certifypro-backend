'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ClaimCertificateClient } from '@/components/claim/ClaimCertificateClient'
import { Spinner } from '@/components/ui/Spinner'

function ClaimContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')?.trim()
  if (!token) {
    return (
      <p className="text-center text-text-muted">
        Sertifikat havolasida token yo‘q.
      </p>
    )
  }
  return <ClaimCertificateClient token={token} />
}

export default function ClaimPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Suspense fallback={<Spinner className="py-16" />}>
        <ClaimContent />
      </Suspense>
    </div>
  )
}
