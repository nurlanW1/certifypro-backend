'use client'

/**
 * Clerk Core 3 `<Show>` shim for @clerk/nextjs v5 on Next.js 14.
 * Replace with `import { Show } from '@clerk/nextjs'` after upgrading to Clerk v7 + Next 15+.
 */
import { SignedIn, SignedOut } from '@clerk/nextjs'

type ShowProps = {
  when: 'signed-in' | 'signed-out'
  children: React.ReactNode
}

export function Show({ when, children }: ShowProps) {
  if (when === 'signed-in') {
    return <SignedIn>{children}</SignedIn>
  }
  return <SignedOut>{children}</SignedOut>
}
