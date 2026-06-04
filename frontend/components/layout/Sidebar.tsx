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
        'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150',
        item.highlight
          ? cn(
              'mx-2 bg-brand-gradient px-3 py-2.5 text-text-inverse shadow-sm hover:shadow-md',
              collapsed && 'mx-1 justify-center px-2'
            )
          : cn(
              'px-3 py-2.5',
              active
                ? 'bg-brand-50 text-brand-800 shadow-xs ring-1 ring-brand-200'
                : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary',
              collapsed && 'justify-center px-2'
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
            className="z-50 rounded-lg bg-brand-900 px-2.5 py-1.5 text-xs font-medium text-text-inverse"
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
      <div className="flex h-full flex-col bg-surface">
        <div
          className={cn(
            'flex h-14 items-center border-b border-border px-3',
            collapsed ? 'justify-center' : 'gap-2.5'
          )}
        >
          <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-sm">
              <span className="font-display text-sm font-bold text-text-inverse">G</span>
            </div>
            {!collapsed && (
              <span className="font-display text-lg font-bold text-text-primary">Gildia</span>
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
            <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
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
          <div className="mx-2 mb-3 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-800">
              <Sparkles className="h-4 w-4 text-brand-600" />
              Pro rejimga o&apos;ting
            </div>
            <p className="mt-1 text-xs text-text-muted">Ko&apos;proq imkoniyatlar</p>
            <Link
              href="/upgrade"
              onClick={onNavigate}
              className="mt-2 inline-flex text-xs font-semibold text-brand-600 hover:text-brand-800"
            >
              Upgrade →
            </Link>
          </div>
        )}

        <div className="space-y-1 border-t border-border p-2">
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
        className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-sm hover:border-brand-300 hover:text-brand-600"
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
          'relative hidden shrink-0 flex-col border-r border-border bg-surface transition-all duration-200 md:flex',
          collapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      <Dialog.Root open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-900/30 backdrop-blur-sm md:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-border bg-surface shadow-lg focus:outline-none md:hidden">
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
