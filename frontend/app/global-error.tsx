'use client'

import { useEffect } from 'react'
import { captureException } from '@/lib/monitoring/capture'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error, { digest: error.digest, boundary: 'global-error' })
  }, [error])

  return (
    <html lang="uz">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-sans">
        <h2 className="text-xl font-semibold">Kutilmagan xatolik</h2>
        <p className="max-w-md text-center text-sm text-gray-600">
          Muammo qayd etildi. Sahifani yangilab ko‘ring.
        </p>
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
          onClick={() => reset()}
        >
          Qayta urinish
        </button>
      </body>
    </html>
  )
}
