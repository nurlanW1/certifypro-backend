"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

import { LinkButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getLayoutMode } from "@/lib/layout/route-meta"

const marketingLinks = [
  { href: "/templates", label: "Shablonlar" },
  { href: "/dashboard/events/new", label: "Tadbir yaratish" },
  { href: "/pricing", label: "Tariflar" },
  { href: "/faq", label: "FAQ" },
]

const appQuickLinks = [
  { href: "/templates", label: "Shablonlar" },
  { href: "/editor", label: "Editor" },
]

export function SiteHeader() {
  const pathname = usePathname() ?? ""
  const mode = getLayoutMode(pathname)
  const [open, setOpen] = useState(false)

  if (mode === "editor") return null

  const isDashboard = mode === "dashboard"
  const links = isDashboard ? appQuickLinks : marketingLinks

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl supports-backdrop-filter:bg-background/75">
      <div className="gildia-container flex h-14 items-center justify-between gap-4 md:h-16">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a1628] to-primary text-sm font-bold text-primary-foreground shadow-sm">
            G
          </span>
          <div className="min-w-0 leading-tight">
            <span className="text-base font-bold tracking-tight text-foreground md:text-lg">
              Gildia<span className="text-primary">.uz</span>
            </span>
            <span className="hidden truncate text-[10px] text-muted-foreground sm:block">
              Tadbir dizayn platformasi
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isDashboard ? (
            <Link
              href="/account"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive("/account")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Hisob
            </Link>
          ) : null}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Kirish
          </Link>
          <LinkButton href="/register" size="sm">
            Boshlash
          </LinkButton>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <div className="gildia-container py-4">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isDashboard ? (
              <Link
                href="/account"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground"
                onClick={() => setOpen(false)}
              >
                Hisob
              </Link>
            ) : null}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium" onClick={() => setOpen(false)}>
              Kirish
            </Link>
            <LinkButton href="/register" className="w-full justify-center">
              Boshlash
            </LinkButton>
          </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

/** @deprecated use SiteHeader */
export const Navbar = SiteHeader
