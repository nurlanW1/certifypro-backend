'use client'

import { useTranslations } from 'next-intl'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Show } from '@/components/auth/Show'

interface NavbarAuthProps {
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
}

export function NavbarAuth({ variant = 'desktop', onNavigate }: NavbarAuthProps) {
  const t = useTranslations('nav')

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-3 pt-8">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button type="button" className="btn-secondary btn-lg w-full" onClick={onNavigate}>
              {t('login')}
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button type="button" className="btn-primary btn-lg w-full" onClick={onNavigate}>
              {t('signup')}
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <div className="flex justify-center py-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </Show>
      </div>
    )
  }

  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="btn-ghost btn-sm text-text-secondary">
            {t('login')}
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className="btn-primary btn-sm">
            {t('signup')}
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton afterSignOutUrl="/" />
      </Show>
    </>
  )
}
