'use client'

import { usePathname } from 'next/navigation'
import { isClerkConfigured } from '@/lib/clerk-config'

export function GuestModeBanner() {
  const pathname = usePathname()

  if (isClerkConfigured()) return null
  if (pathname.startsWith('/editor/') || pathname.startsWith('/workspace/')) return null

  return (
    <div className="border-b border-accent-border bg-accent-dim px-4 py-2 text-center text-sm text-accent-hover">
      <span className="font-semibold">Mehmon rejimi</span>
      {' — '}
      Clerk keyinroq ulanadi. Hozir dizayn va funksiyalarni sinab ko&apos;rishingiz mumkin.
    </div>
  )
}
