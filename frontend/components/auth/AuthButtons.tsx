'use client'

import { Link } from '@/i18n/navigation'
import dynamic from 'next/dynamic'
import { useClerkEnabled } from '@/components/auth/ClerkConfigContext'

const AuthButtonsClerk = dynamic(
  () => import('./AuthButtonsClerk').then((m) => m.AuthButtonsClerk),
  { ssr: false }
)

interface AuthButtonsProps {
  size?: 'nav' | 'hero'
}

export function AuthButtons({ size = 'nav' }: AuthButtonsProps) {
  const primaryClass =
    size === 'hero' ? 'gildia-btn-primary px-8 py-3 text-base' : 'gildia-btn-primary px-4 py-2 text-sm'
  const secondaryClass =
    size === 'hero' ? 'gildia-btn-secondary px-8 py-3 text-base' : 'gildia-btn-secondary px-4 py-2 text-sm'

  if (!useClerkEnabled()) {
    return (
      <>
        <Link href="/dashboard" className={secondaryClass}>
          Dashboard
        </Link>
        <Link href="/events/new" className={primaryClass}>
          Boshlash →
        </Link>
      </>
    )
  }

  return <AuthButtonsClerk size={size} />
}
