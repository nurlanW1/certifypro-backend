'use client'

import { usePathname } from '@/i18n/navigation'
import { useClerkEnabled } from '@/components/auth/ClerkConfigContext'

export function GuestModeBanner() {
  const pathname = usePathname()

  if (useClerkEnabled()) return null
  if (pathname.startsWith('/editor/') || pathname.startsWith('/workspace/')) return null

  return (
    <div className="border-b border-accent-border bg-accent-dim px-4 py-2 text-center text-sm text-accent-hover">
      <span className="font-semibold">Mehmon rejimi</span>
      {' — '}
      Clerk kalitlari topilmadi. Vercel da{' '}
      <code className="text-xs">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> va{' '}
      <code className="text-xs">CLERK_SECRET_KEY</code> qo&apos;ying va qayta deploy qiling.
    </div>
  )
}
