'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import {
  Calendar,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Layers,
  Layout,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SidebarUser } from '@/components/layout/SidebarUser'

interface Props {
  collapsed: boolean
  onToggle: () => void
}


function NavLink({
  href,
  icon: Icon,
  label,
  special,
  pro,
  collapsed,
  active,
}: {
  href: string
  icon: LucideIcon
  label: string
  special?: boolean
  pro?: boolean
  collapsed: boolean
  active: boolean
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded px-3 py-2 text-base font-medium transition-all duration-100',
        collapsed && 'justify-center',
        special
          ? 'border border-divide text-text-primary hover:border-accent-border hover:bg-accent-dim'
          : active
            ? 'bg-subtle text-text-primary'
            : 'text-text-tertiary hover:bg-subtle hover:text-text-secondary'
      )}
    >
      <Icon size={15} className="shrink-0 transition-colors" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {pro && <span className="tag tag-accent px-1.5 py-0.5 text-[9px]">PRO</span>}
        </>
      )}
      {active && !special && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-text-primary" />
      )}
    </Link>
  )
}

export function AppSidebar({ collapsed, onToggle }: Props) {
  const t = useTranslations('nav')
  const td = useTranslations('dashboard')
  const pathname = usePathname()

  const NAV_TOP = [
    { href: '/dashboard' as const, icon: LayoutDashboard, label: t('dashboard') },
    { href: '/events/new' as const, icon: CalendarPlus, label: td('newEvent'), special: true },
    { href: '/events' as const, icon: Calendar, label: t('events') },
    { href: '/templates' as const, icon: Layout, label: t('templates') },
    { href: '/brand-kit' as const, icon: Layers, label: t('brandKit') },
  ]

  const NAV_BOTTOM = [
    { href: '/settings' as const, icon: Settings, label: t('settings') },
    { href: '/upgrade' as const, icon: CreditCard, label: 'Pro', pro: true },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/events/new') return pathname === '/events/new'
    if (href === '/events') {
      return pathname === '/events' || (pathname.startsWith('/events/') && !pathname.startsWith('/events/new'))
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside
      className={cn(
        'relative flex h-screen shrink-0 flex-col border-r border-divide bg-canvas transition-[width] duration-200',
        collapsed ? 'w-[52px]' : 'w-[200px]'
      )}
    >
      <div
        className={cn(
          'flex h-[52px] shrink-0 items-center border-b border-divide',
          collapsed ? 'justify-center px-0' : 'px-4'
        )}
      >
        <Link href="/dashboard" className="group flex min-w-0 items-center gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent transition-colors group-hover:bg-accent-hover">
            <span className="text-xs font-bold leading-none text-white">G</span>
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-semibold text-text-primary">ildia</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV_TOP.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            collapsed={collapsed}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-divide p-2">
        {NAV_BOTTOM.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            collapsed={collapsed}
            active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
          />
        ))}
        <SidebarUser collapsed={collapsed} />
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center',
          'rounded-full border border-divide bg-ink text-text-disabled shadow-sm',
          'transition-all hover:border-text-disabled hover:text-text-secondary'
        )}
        aria-label={collapsed ? 'Sidebarni ochish' : 'Sidebarni yig‘ish'}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </aside>
  )
}
