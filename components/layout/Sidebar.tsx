'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarPlus,
  Calendar,
  Layout,
  Settings,
  ChevronLeft,
  Sparkles,
  CreditCard,
  HelpCircle,
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
  { href: '/templates', icon: Layout, label: 'Shablonlar' },
]

const BOTTOM_ITEMS: (NavItem & { isPro?: boolean })[] = [
  { href: '/settings', icon: Settings, label: 'Sozlamalar' },
  { href: '/upgrade', icon: CreditCard, label: 'Pro rejim', isPro: true },
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
        'flex items-center gap-3 text-sm font-medium transition-all duration-150',
        item.highlight
          ? cn(
              'mx-2 rounded-lg bg-brand-600 px-3 py-2.5 text-text-inverse hover:bg-brand-800',
              collapsed && 'mx-1 justify-center px-0'
            )
          : cn(
              'rounded-lg px-3 py-2.5',
              active
                ? 'border-r-2 border-brand-600 bg-brand-50 text-brand-600'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
              collapsed && 'justify-center px-0'
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
            className="z-50 rounded-lg bg-brand-900 px-2 py-1 text-xs text-text-inverse"
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

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="flex h-full flex-col">
        <div
          className={cn(
            'flex h-14 items-center border-b border-border px-3',
            collapsed ? 'justify-center' : 'gap-2'
          )}
        >
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600">
              <span className="text-sm font-semibold text-text-inverse">G</span>
            </div>
            {!collapsed && (
              <span className="text-base font-semibold text-text-primary">Gildia</span>
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
        </nav>

        {!collapsed && (
          <div className="mx-2 mb-3 rounded-xl bg-brand-50 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-800">
              <Sparkles className="h-4 w-4" />
              Pro rejimga o&apos;ting
            </div>
            <p className="mt-1 text-xs text-text-muted">Ko&apos;proq imkoniyatlar</p>
            <Link
              href="/upgrade"
              onClick={onNavigate}
              className="mt-2 inline-flex text-xs font-medium text-brand-600 hover:text-brand-800"
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
        className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-sm hover:bg-brand-50 hover:text-text-primary"
        aria-label={collapsed ? 'Sidebarni ochish' : 'Sidebarni yig‘ish'}
      >
        <ChevronLeft
          className={cn('h-3.5 w-3.5 transition-transform', collapsed && 'rotate-180')}
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
          collapsed ? 'w-16' : 'w-[220px]'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      <Dialog.Root open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-900/40 backdrop-blur-sm md:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[220px] border-r border-border bg-surface shadow-lg focus:outline-none md:hidden">
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
