"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { EventCard } from "@/components/dashboard/event-card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { LinkButton } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import {
  deleteDashboardEvent,
  duplicateDashboardEvent,
  listDashboardEvents,
  type DashboardEvent,
} from "@/lib/dashboard/dashboard-storage"

export function EventsPageContent() {
  const router = useRouter()
  const [events, setEvents] = useState<DashboardEvent[]>(() => listDashboardEvents())
  const [loading] = useState(false)
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const refresh = useCallback(() => {
    setEvents(listDashboardEvents())
  }, [])

  const handleDuplicate = (id: string) => {
    const newId = duplicateDashboardEvent(id)
    if (newId) {
      toast.success("Tadbir nusxalandi")
      refresh()
      router.push(`/dashboard/events/${newId}/builder`)
    } else {
      toast.error("Nusxalash muvaffaqiyatsiz")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!confirm) return
    setDeleting(true)
    try {
      await deleteDashboardEvent(confirm.id)
      toast.success("Tadbir o‘chirildi")
      setConfirm(null)
      refresh()
    } catch {
      toast.error("O‘chirish muvaffaqiyatsiz")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Yuklanmoqda…</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Barcha tadbir workspace’lari — Event Builder va materiallar shu yerda saqlanadi.
        </p>
        <LinkButton href="/dashboard/events/new" size="sm">
          Tadbir yaratish
        </LinkButton>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="Hali tadbir yo‘q"
          description="Birinchi tadbiringizni yarating — logo, brend ranglari va material katalogini sozlang."
          action={<LinkButton href="/dashboard/events/new">Tadbir yaratish</LinkButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDuplicate={handleDuplicate}
              onDelete={(id) => {
                const ev = events.find((e) => e.id === id)
                setConfirm({ id, name: ev?.name ?? "Tadbir" })
              }}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => !open && setConfirm(null)}
        title="Tadbirni o‘chirish"
        description={
          confirm
            ? `«${confirm.name}» va unga bog‘liq qoralamalar o‘chiriladi. Bu amalni qaytarib bo‘lmaydi.`
            : ""
        }
        confirmLabel="O‘chirish"
        variant="destructive"
        loading={deleting}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  )
}
