'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  LayoutDashboard,
  LayoutTemplate,
  PenTool,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'

const navItems = [
  { href: '/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { href: '/events', label: 'Tadbirlar', icon: Calendar },
  { href: '/templates', label: 'Shablonlar', icon: LayoutTemplate },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-white md:flex md:flex-col">
      <div className="border-b border-border px-6 py-5">
        <span className="text-lg font-semibold text-text-primary">{APP_NAME}</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-800'
                  : 'text-text-secondary hover:bg-surface-secondary'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/editor/new"
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-800"
        >
          <PenTool className="h-4 w-4" />
          Yangi dizayn
        </Link>
      </div>
    </aside>
  )
}
