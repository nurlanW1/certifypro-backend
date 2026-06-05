'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { isClerkConfiguredClient } from '@/lib/clerk-config'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

const LINKS = [
  { href: '/templates', label: 'Shablonlar' },
  { href: '/upgrade', label: 'Narxlar' },
  { href: '/help', label: 'Haqida' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const clerk = isClerkConfiguredClient()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const signInHref = clerk ? '/sign-in' : '/dashboard'
  const signUpHref = clerk ? '/sign-up' : '/events/new'

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 h-14 transition-all duration-200 ${
          scrolled ? 'border-b border-divide bg-canvas/95 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-text-primary transition-colors group-hover:bg-accent">
              <span className="text-sm font-bold leading-none text-canvas">G</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">ildia</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded px-4 py-2 text-sm transition-all ${
                  pathname === href
                    ? 'bg-subtle text-text-primary'
                    : 'text-text-tertiary hover:bg-subtle hover:text-text-secondary'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Link href={signInHref} className="btn-ghost btn-sm text-text-secondary">
              Kirish
            </Link>
            <Link href={signUpHref} className="btn-primary btn-sm">
              Boshlash
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="btn-ghost btn-icon-md text-text-secondary md:hidden"
            aria-label="Menyu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-canvas pt-14 md:hidden">
          <div className="flex flex-col gap-2 px-6 py-8">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-divide py-4 text-lg text-text-secondary transition-colors hover:text-text-primary"
              >
                {label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-8">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-text-tertiary">Rejim</span>
                <ThemeToggle showLabel />
              </div>
              <Link href={signInHref} className="btn-secondary btn-lg w-full text-center">
                Kirish
              </Link>
              <Link href={signUpHref} className="btn-primary btn-lg w-full text-center">
                Boshlash
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
