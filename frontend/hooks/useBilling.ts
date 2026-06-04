'use client'

import { useCallback, useEffect, useState } from 'react'
import type { BillingMe } from '@/lib/billing/service'

export function useBilling() {
  const [billing, setBilling] = useState<BillingMe | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    return fetch('/api/billing/me')
      .then(async (res) => {
        if (!res.ok) return null
        const data = (await res.json()) as { billing: BillingMe }
        setBilling(data.billing)
        return data.billing
      })
      .catch(() => {
        setBilling(null)
        return null
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { billing, loading, refresh }
}
