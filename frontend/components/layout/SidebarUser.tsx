'use client'

import dynamic from 'next/dynamic'
import { useClerkEnabled } from '@/components/auth/ClerkConfigContext'
import { cn } from '@/lib/utils'

const ClerkUserButton = dynamic(
  () => import('@clerk/nextjs').then((m) => m.UserButton),
  { ssr: false }
)

export function SidebarUser({ collapsed }: { collapsed: boolean }) {
  if (!useClerkEnabled()) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2',
          collapsed && 'justify-center px-0'
        )}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border border-divide bg-subtle text-xs font-semibold text-text-secondary"
          title="Mehmon rejimi"
        >
          M
        </div>
        {!collapsed && <span className="truncate text-xs text-text-tertiary">Mehmon</span>}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2',
        collapsed && 'justify-center px-0'
      )}
    >
      <ClerkUserButton afterSignOutUrl="/" />
      {!collapsed && <span className="truncate text-xs text-text-tertiary">Profil</span>}
    </div>
  )
}
