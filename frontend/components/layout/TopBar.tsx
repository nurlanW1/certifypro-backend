'use client'

import { Menu } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu'
import { usePathname } from 'next/navigation'

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
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur-md md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl p-2 text-text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 md:hidden"
        aria-label="Menyu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-lg font-bold text-text-primary">{title}</h1>
      </div>

      <UserMenu />
    </header>
  )
}
