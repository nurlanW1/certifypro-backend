"use client"

import { cn } from "@/lib/utils"

/** Controlled tabs API used across the app (e.g. editor page) */
export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

/** Underline variant for dense toolbars */
export function TabsUnderline({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex gap-1 overflow-x-auto border-b border-border", className)}>
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
