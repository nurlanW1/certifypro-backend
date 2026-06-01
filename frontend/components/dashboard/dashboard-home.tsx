"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  FileStack,
  FolderKanban,
  History,
  LayoutTemplate,
  Palette,
  Settings,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { DesignCard } from "@/components/dashboard/design-card"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { EventCard } from "@/components/dashboard/event-card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { LinkButton } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  deleteDashboardEvent,
  deleteDesign,
  duplicateDashboardEvent,
  duplicateDesign,
  listDashboardDesigns,
  listDashboardDrafts,
  listDashboardEvents,
  listExportHistory,
  listRecentFiles,
  logExport,
  type DashboardDesign,
  type DashboardDraft,
  type DashboardEvent,
  type ExportHistoryEntry,
  type RecentFile,
} from "@/lib/dashboard/dashboard-storage"
import { cn } from "@/lib/utils"

const NAV = [
  { id: "my-events", label: "Tadbirlar", icon: FolderKanban },
  { id: "my-designs", label: "Dizaynlar", icon: Palette },
  { id: "drafts", label: "Qoralamalar", icon: FileStack },
  { id: "recent-files", label: "So‘nggi", icon: History },
  { id: "export-history", label: "Eksport", icon: LayoutTemplate },
  { id: "account", label: "Hisob", icon: Settings },
  { id: "billing", label: "Tarif", icon: CreditCard },
] as const

type ConfirmState =
  | { type: "event"; id: string; name: string }
  | { type: "design"; scope: string; title: string }
  | null

export function DashboardHome() {
  const router = useRouter()
  const [events, setEvents] = useState<DashboardEvent[]>(() => listDashboardEvents())
  const [designs, setDesigns] = useState<DashboardDesign[]>(() => listDashboardDesigns())
  const [drafts, setDrafts] = useState<DashboardDraft[]>(() => listDashboardDrafts())
  const [recent, setRecent] = useState<RecentFile[]>(() => listRecentFiles())
  const [exports, setExports] = useState<ExportHistoryEntry[]>(() => listExportHistory())
  const [activeNav, setActiveNav] = useState<string>("my-events")
  const [confirm, setConfirm] = useState<ConfirmState>(null)
  const [deleting, setDeleting] = useState(false)

  const refresh = useCallback(() => {
    setEvents(listDashboardEvents())
    setDesigns(listDashboardDesigns())
    setDrafts(listDashboardDrafts())
    setRecent(listRecentFiles())
    setExports(listExportHistory())
  }, [])

  const handleDuplicateEvent = (id: string) => {
    const newId = duplicateDashboardEvent(id)
    if (newId) {
      toast.success("Tadbir nusxalandi")
      refresh()
      router.push(`/dashboard/events/${newId}/builder`)
    }
  }

  const handleDeleteEvent = (id: string) => {
    const ev = events.find((e) => e.id === id)
    setConfirm({ type: "event", id, name: ev?.name ?? "Tadbir" })
  }

  const handleDuplicateDesign = (design: DashboardDesign) => {
    duplicateDesign(design)
    toast.success("Dizayn nusxalandi")
    refresh()
  }

  const handleDeleteDesign = (scope: string) => {
    const d = designs.find((x) => x.scope === scope)
    setConfirm({ type: "design", scope, title: d?.title ?? "Dizayn" })
  }

  const handleConfirmDelete = async () => {
    if (!confirm) return
    setDeleting(true)
    try {
      if (confirm.type === "event") {
        await deleteDashboardEvent(confirm.id)
        toast.success("Tadbir o‘chirildi")
      } else {
        deleteDesign(confirm.scope)
        toast.success("Dizayn o‘chirildi")
      }
      refresh()
    } finally {
      setDeleting(false)
      setConfirm(null)
    }
  }

  const handleExportDesign = (design: DashboardDesign) => {
    logExport(design.title, "PNG")
    toast.success("Eksport tarixiga qo‘shildi")
    refresh()
    router.push(`${design.editorHref}&export=1`)
  }

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={confirm?.type === "event" ? "Tadbirni o‘chirish" : "Dizaynni o‘chirish"}
        description={
          confirm
            ? confirm.type === "event"
              ? `«${confirm.name}» va unga bog‘liq qoralamalar, formalar va canvas ma’lumotlari butunlay o‘chiriladi. Bu amalni qaytarib bo‘lmaydi.`
              : `«${confirm.title}» dizayni o‘chiriladi. Canvas va saqlangan elementlar yo‘qoladi.`
            : ""
        }
        confirmLabel="O‘chirish"
        variant="destructive"
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />

      <nav className="hidden shrink-0 border-b border-border bg-card/50 px-4 py-3 lg:block lg:w-52 lg:border-b-0 lg:border-r lg:py-6">
        <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Bo‘limlar
        </p>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setActiveNav(item.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                    activeNav === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex-1 space-y-12 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Workspace</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Boshqaruv paneli
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Tadbirlar, dizaynlar, qoralamalar va eksportlar — barchasi bir joyda. Saqlangan
              loyihalar brauzeringizda saqlanadi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge text="Premium" variant="premium" />
            <LinkButton href="/dashboard/events/new" size="sm">
              + Tadbir
            </LinkButton>
            <LinkButton href="/templates" variant="outline" size="sm">
              <Sparkles className="size-3.5" />
              Dizayn yaratish
            </LinkButton>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Tadbirlar" value={String(events.length)} />
          <StatCard label="Dizaynlar" value={String(designs.length)} />
          <StatCard label="Qoralamalar" value={String(drafts.length)} />
          <StatCard label="Eksportlar" value={String(exports.length)} />
        </div>

        <DashboardSection
          id="my-events"
          title="Mening tadbirlarim"
          description="Har bir tadbir uchun material katalogi va Event Builder. Jarayon avtomatik saqlanadi."
          action={
            <LinkButton href="/dashboard/events/new" size="sm">
              Yangi tadbir
            </LinkButton>
          }
        >
          {events.length === 0 ? (
            <EmptyState
              title="Hali tadbir yo‘q"
              description="Tadbir yaratib, sertifikat, bejik va boshqa materiallarni tanlang."
              action={<LinkButton href="/dashboard/events/new">Tadbir yaratish</LinkButton>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {events.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onDuplicate={handleDuplicateEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          id="my-designs"
          title="Mening dizaynlarim"
          description="Media Editorda saqlangan loyihalar — keyinroq davom etish uchun."
          action={
            <LinkButton href="/templates" variant="outline" size="sm">
              Katalogdan yaratish
            </LinkButton>
          }
        >
          {designs.length === 0 ? (
            <EmptyState
              title="Saqlangan dizayn yo‘q"
              description="Shablon tanlang yoki tadbir builderdan editorga o‘ting."
              action={<LinkButton href="/templates">Shablonlar</LinkButton>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {designs.map((d) => (
                <DesignCard
                  key={d.id}
                  design={d}
                  onDuplicate={handleDuplicateDesign}
                  onDelete={handleDeleteDesign}
                  onExport={handleExportDesign}
                />
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          id="drafts"
          title="Qoralamalar"
          description="To‘ldirilmagan formalar va davom ettiriladigan tadbirlar."
        >
          {drafts.length === 0 ? (
            <EmptyState title="Qoralama yo‘q" description="Barcha loyihalar yakunlangan yoki yangi boshlang." />
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
              {drafts.map((d) => (
                <li key={d.id}>
                  <Link
                    href={d.href}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{d.subtitle}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(d.updatedAt).toLocaleDateString("uz-UZ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>

        <DashboardSection
          id="recent-files"
          title="So‘nggi fayllar"
          description="Yaqinda tahrirlangan dizaynlar va eksportlar."
        >
          {recent.length === 0 ? (
            <EmptyState title="So‘nggi fayl yo‘q" />
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {recent.map((f) => (
                <li key={f.id}>
                  <Link
                    href={f.href}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm hover:border-primary/30"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-lg">
                      📄
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.type}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(f.updatedAt).toLocaleDateString("uz-UZ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>

        <DashboardSection
          id="export-history"
          title="Eksport tarixi"
          description="Yuklab olingan va eksport qilingan fayllar."
        >
          {exports.length === 0 ? (
            <EmptyState
              title="Eksport tarixi bo‘sh"
              description="Editor yoki dizayn kartasidan eksport qiling."
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Dizayn</th>
                    <th className="px-4 py-3 font-semibold">Format</th>
                    <th className="px-4 py-3 font-semibold">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {exports.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{row.designName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.format}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(row.createdAt).toLocaleString("uz-UZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardSection>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardSection
            id="account"
            title="Hisob sozlamalari"
            description="Profil, tashkilot va xavfsizlik."
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profil</CardTitle>
                <CardDescription>Ism, email va tashkilot ma’lumotlari.</CardDescription>
              </CardHeader>
              <CardContent>
                <LinkButton href="/account" variant="outline" size="sm">
                  Hisobni ochish
                </LinkButton>
              </CardContent>
            </Card>
          </DashboardSection>

          <DashboardSection
            id="billing"
            title="To‘lov va tarif"
            description="Premium imkoniyatlar va obuna."
          >
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">Joriy tarif</CardTitle>
                  <Badge text="Premium" variant="premium" />
                </div>
                <CardDescription>
                  Bulk generatsiya, watermark yo‘q, barcha export formatlari.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-bold text-foreground">
                  299,000 <span className="text-sm font-normal text-muted-foreground">UZS/oy</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <LinkButton href="/pricing" size="sm">
                    Tarifni boshqarish
                  </LinkButton>
                  <LinkButton href="/pricing" variant="outline" size="sm">
                    To‘lov tarixi
                  </LinkButton>
                </div>
              </CardContent>
            </Card>
          </DashboardSection>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
    </div>
  )
}
