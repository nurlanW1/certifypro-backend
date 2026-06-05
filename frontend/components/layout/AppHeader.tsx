'use client'

import { Bell, Menu, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { UserMenu } from '@/components/auth/UserMenu'

const TITLES: Record<string, { title: string; desc?: string }> = {
  '/dashboard': { title: 'Dashboard' },
  '/events': { title: 'Tadbirlar', desc: 'Barcha loyihalaringiz' },
  '/events/new': { title: 'Yangi tadbir', desc: '3 qadamda yarating' },
  '/templates': { title: 'Shablonlar', desc: '48+ tayyor dizayn' },
  '/brand-kit': { title: 'Brand Kit', desc: 'Tashkilot identifikatsiyasi' },
  '/settings': { title: 'Sozlamalar' },
  '/upgrade': { title: 'Pro rejim' },
  '/agency': { title: 'Agentlik' },
  '/admin': { title: 'Admin' },
  '/help': { title: 'Yordam' },
}

function resolveTitle(pathname: string) {
  const sorted = Object.entries(TITLES).sort((a, b) => b[0].length - a[0].length)
  for (const [key, meta] of sorted) {
    if (pathname === key || pathname.startsWith(`${key}/`)) return meta
  }
  if (pathname.startsWith('/editor/')) return { title: 'Muharrir', desc: 'Dizayn tahriri' }
  return { title: 'Gildia' }
}

interface Props {
  onMenuClick: () => void
}

export function AppHeader({ onMenuClick }: Props) {
  const pathname = usePathname()
  const meta = resolveTitle(pathname)

  return (
    <header className="flex h-[52px] shrink-0 items-center gap-4 border-b border-divide bg-canvas px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="btn-ghost btn-icon-sm shrink-0 lg:hidden"
        aria-label="Menyu"
      >
        <Menu size={15} />
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-sm font-semibold text-text-primary">{meta.title}</h1>
        {meta.desc && (
          <>
            <span className="hidden text-divide sm:block">/</span>
            <span className="hidden truncate text-xs text-text-tertiary sm:block">{meta.desc}</span>
          </>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <button type="button" className="btn-ghost btn-icon-sm" aria-label="Qidirish">
          <Search size={14} />
        </button>
        <button type="button" className="btn-ghost btn-icon-sm relative" aria-label="Bildirishnomalar">
          <Bell size={14} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <div className="mx-1 h-4 w-px bg-divide" />
        <LanguageToggle />
        <ThemeToggle />
        <div className="hidden md:block">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
