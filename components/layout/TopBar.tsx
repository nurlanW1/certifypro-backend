'use client'

import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav)

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-text-secondary hover:bg-brand-50 md:hidden"
          onClick={toggleMobileNav}
          aria-label="Menyu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>
      <UserButton afterSignOutUrl="/" />
    </header>
  )
}
