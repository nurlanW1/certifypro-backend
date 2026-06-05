'use client'

import { Menu } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
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
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-divide bg-canvas px-4 md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="btn-ghost btn-icon-md text-text-secondary md:hidden"
        aria-label="Menyu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-text-primary">{title}</h1>
      </div>

      <ThemeToggle />
      <UserMenu />
    </header>
  )
}
