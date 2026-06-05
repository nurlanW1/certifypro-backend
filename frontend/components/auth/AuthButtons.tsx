'use client'

import { Link } from '@/i18n/navigation'
import dynamic from 'next/dynamic'
import { useClerkPublishable } from '@/components/auth/ClerkConfigContext'

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

  if (!useClerkPublishable()) {
    return (
      <>
        <Link href="/sign-in" className={secondaryClass}>
          Kirish
        </Link>
        <Link href="/sign-up" className={primaryClass}>
          Boshlash →
        </Link>
      </>
    )
  }

  return <AuthButtonsClerk size={size} />
}
