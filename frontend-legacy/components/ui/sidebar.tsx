"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type SidebarNavItem = {
  href: string
  label: string
  icon?: ReactNode
  badge?: string
}

type SidebarProps = {
  brand?: ReactNode
  footer?: ReactNode
  items: SidebarNavItem[]
  className?: string
  collapsed?: boolean
}

export function Sidebar({ brand, footer, items, className, collapsed = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex h-full min-h-[calc(100vh-4rem)] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        collapsed ? "w-[4.5rem]" : "w-64",
        className
      )}
    >
      {brand ? (
        <div className={cn("border-b border-sidebar-border px-4 py-4", collapsed && "px-2")}>
          {brand}
        </div>
      ) : null}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {item.icon ? (
                <span className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-4">
                  {item.icon}
                </span>
              ) : null}
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
              {!collapsed && item.badge ? (
                <span className="ml-auto rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold uppercase">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {footer ? (
        <div className={cn("border-t border-sidebar-border p-3", collapsed && "px-2")}>
          {footer}
        </div>
      ) : null}
    </aside>
  )
}

export function SidebarLayout({
  sidebar,
  children,
  className,
}: {
  sidebar: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex min-h-[calc(100vh-4rem)] bg-background", className)}>
      {sidebar}
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  )
}

export function SidebarSection({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {title ? (
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  )
}
