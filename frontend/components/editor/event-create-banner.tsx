"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { getCatalogItem } from "@/lib/event-create/catalog"

export function EventCreateBanner() {
  const params = useSearchParams()
  const from = params.get("from")
  const categoryId = params.get("category")
  const eventId = params.get("eventId")

  if (from !== "event-create") return null

  const item = categoryId ? getCatalogItem(categoryId) : null

  const backHref =
    eventId && categoryId
      ? `/dashboard/events/${eventId}/builder?material=${encodeURIComponent(categoryId)}`
      : eventId
        ? `/dashboard/events/${eventId}/builder`
        : "/dashboard/events/new"

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-primary/20 bg-primary/5 px-4 py-2">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-primary">Tadbir yaratish rejimi</p>
        <p className="truncate text-sm text-foreground">
          {item ? item.name : "Material"} — dizaynni tahrirlang
        </p>
      </div>
      <Link
        href={backHref}
        className="shrink-0 rounded-lg bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm ring-1 ring-primary/30 hover:bg-primary/5"
      >
        ← Formaga qaytish
      </Link>
    </div>
  )
}
