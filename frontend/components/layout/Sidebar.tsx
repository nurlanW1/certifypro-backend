'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  CalendarPlus,
  Calendar,
  Layout,
  Building2,
  Settings,
  ChevronLeft,
  Sparkles,
  CreditCard,
  HelpCircle,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  icon: LucideIcon
  label: string
  exact?: boolean
  highlight?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bosh sahifa', exact: true },
  { href: '/events/new', icon: CalendarPlus, label: 'Yangi tadbir', highlight: true },
  { href: '/events', icon: Calendar, label: 'Tadbirlarim' },
]

const SECONDARY_NAV: NavItem[] = [
  { href: '/templates', icon: Layout, label: 'Shablon katalogi' },
  { href: '/agency', icon: Building2, label: 'Agentlik' },
]

const BOTTOM_ITEMS: NavItem[] = [
  { href: '/settings', icon: Settings, label: 'Sozlamalar' },
  { href: '/upgrade', icon: CreditCard, label: 'Pro rejim' },
  { href: '/help', icon: HelpCircle, label: 'Yordam' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

function NavLink({
  item,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  pathname: string
  onNavigate?: () => void
}) {
  const active = item.exact
    ? pathname === item.href
    : item.href === '/events'
      ? pathname === '/events' ||
        (pathname.startsWith('/events/') && !pathname.startsWith('/events/new'))
      : pathname === item.href || pathname.startsWith(`${item.href}/`)

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 text-sm font-semibold transition-all duration-150',
        item.highlight
          ? cn(
              'mx-2 rounded-sm border-2 border-accent-600 bg-accent-500 px-3 py-2.5 text-text-primary shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
              collapsed && 'mx-1 justify-center px-0'
            )
          : cn(
              'rounded-sm px-3 py-2.5',
              active
                ? 'border-l-4 border-accent-500 bg-white/10 text-text-inverse'
                : 'text-brand-100/80 hover:bg-white/5 hover:text-text-inverse',
              collapsed && 'justify-center border-l-0 px-0',
              collapsed && active && 'bg-white/15'
            )
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            className="z-50 rounded-sm border-2 border-text-primary bg-accent-500 px-2 py-1 text-xs font-bold text-text-primary"
          >
            {item.label}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    )
  }

  return link
}

function SidebarContent({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    void fetch('/api/admin/me')
      .then((r) => r.json())
      .then((d: { isAdmin?: boolean }) => setIsAdmin(Boolean(d.isAdmin)))
      .catch(() => setIsAdmin(false))
  }, [])

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="flex h-full flex-col bg-brand-900 text-text-inverse">
        <div
          className={cn(
            'flex h-14 items-center border-b border-white/10 px-3',
            collapsed ? 'justify-center' : 'gap-2'
          )}
        >
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2 border-accent-500 bg-accent-500 shadow-brutal-sm">
              <span className="font-display text-sm font-extrabold text-text-primary">G</span>
            </div>
            {!collapsed && (
              <span className="font-display text-lg font-bold tracking-tight">Gildia</span>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
          {!collapsed && (
            <p className="px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-widest text-brand-200/70">
              Katalog
            </p>
          )}
          {SECONDARY_NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
          {isAdmin && (
            <NavLink
              item={{ href: '/admin', icon: Shield, label: 'Admin' }}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          )}
        </nav>

        {!collapsed && (
          <div className="mx-2 mb-3 rounded-sm border-2 border-accent-500/50 bg-brand-800 p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-accent-400">
              <Sparkles className="h-4 w-4" />
              Pro rejimga o&apos;ting
            </div>
            <p className="mt-1 text-xs text-brand-100/70">Ko&apos;proq imkoniyatlar</p>
            <Link
              href="/upgrade"
              onClick={onNavigate}
              className="mt-2 inline-flex text-xs font-bold text-accent-400 hover:text-accent-300"
            >
              Upgrade →
            </Link>
          </div>
        )}

        <div className="space-y-1 border-t border-white/10 p-2">
          {BOTTOM_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm border-2 border-text-primary bg-accent-500 text-text-primary shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        aria-label={collapsed ? 'Sidebarni ochish' : 'Sidebarni yig‘ish'}
      >
        <ChevronLeft
          className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
        />
      </button>
    </Tooltip.Provider>
  )
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'relative hidden shrink-0 flex-col border-r-2 border-text-primary/10 transition-all duration-200 md:flex',
          collapsed ? 'w-16' : 'w-[230px]'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      <Dialog.Root open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-text-primary/50 backdrop-blur-sm md:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[240px] border-r-2 border-text-primary shadow-brutal focus:outline-none md:hidden">
            <SidebarContent
              collapsed={false}
              onToggle={onToggle}
              onNavigate={onMobileClose}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
