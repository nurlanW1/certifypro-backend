'use client'

import dynamic from 'next/dynamic'
import { isClerkConfiguredClient } from '@/lib/clerk-config'

const UserMenuClerk = dynamic(
  () => import('./UserMenuClerk').then((m) => m.UserMenuClerk),
  { ssr: false }
)

export function UserMenu() {
  if (!isClerkConfiguredClient()) {
    return (
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full border border-divide bg-subtle text-xs font-semibold text-text-secondary"
        title="Mehmon rejimi"
      >
        M
      </div>
    )
  }

  return <UserMenuClerk />
}
