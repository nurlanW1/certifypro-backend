'use client'

import { Menu, Bell, Search } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Bosh sahifa',
  '/events': 'Tadbirlarim',
  '/events/new': 'Yangi tadbir',
  '/templates': 'Shablonlar',
  '/settings': 'Sozlamalar',
  '/upgrade': 'Pro rejim',
  '/help': 'Yordam',
}

function resolvePageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/events/') && pathname !== '/events/new') {
    return 'Tadbir tafsilotlari'
  }
  if (pathname.startsWith('/editor/')) return 'Muharrir'
  if (pathname.startsWith('/templates/')) return 'Shablon'
  return 'Gildia'
}

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname()
  const title = resolvePageTitle(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-surface px-4 md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-text-muted hover:bg-brand-50 hover:text-text-primary md:hidden"
        aria-label="Menyu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative hidden max-w-xs sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            className={cn('gildia-input w-48 pl-9 lg:w-64')}
            placeholder="Qidirish..."
            aria-label="Qidirish"
          />
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-text-muted transition-all duration-150 hover:bg-brand-50 hover:text-text-primary"
          aria-label="Bildirishnomalar"
        >
          <Bell className="h-5 w-5" />
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
