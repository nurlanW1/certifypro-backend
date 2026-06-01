'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Calendar, LayoutDashboard, LayoutTemplate } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/uiStore'

const navItems = [
  { href: '/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { href: '/events', label: 'Tadbirlar', icon: Calendar },
  { href: '/templates', label: 'Shablonlar', icon: LayoutTemplate },
]

export function MobileNav() {
  const pathname = usePathname()
  const { mobileNavOpen, setMobileNavOpen } = useUiStore()

  if (!mobileNavOpen) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-brand-900/40"
        onClick={() => setMobileNavOpen(false)}
        aria-label="Yopish"
      />
      <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="font-semibold text-text-primary">Menyu</span>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="rounded-lg p-2 hover:bg-brand-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileNavOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm',
                pathname.startsWith(href)
                  ? 'bg-brand-50 text-brand-800'
                  : 'text-text-secondary'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
