'use client'

import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Show } from '@/components/auth/Show'

interface AuthButtonsClerkProps {
  size?: 'nav' | 'hero'
}

export function AuthButtonsClerk({ size = 'nav' }: AuthButtonsClerkProps) {
  const primaryClass =
    size === 'hero' ? 'gildia-btn-primary px-8 py-3 text-base' : 'gildia-btn-primary px-4 py-2 text-sm'
  const secondaryClass =
    size === 'hero' ? 'gildia-btn-secondary px-8 py-3 text-base' : 'gildia-btn-secondary px-4 py-2 text-sm'

  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className={secondaryClass}>
            Kirish
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className={primaryClass}>
            {size === 'hero' ? 'Bepul boshlash →' : 'Bepul boshlash'}
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton afterSignOutUrl="/" />
      </Show>
    </>
  )
}
