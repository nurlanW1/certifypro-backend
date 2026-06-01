"use client"

import { use, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"

import { LinkButton } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { WORKSPACE_TABS } from "@/lib/constants/product"
import { buildDashboardEvent } from "@/lib/dashboard/dashboard-storage"
import { loadEventSetup } from "@/lib/event-create/storage"
import { listAssetLibrary } from "@/lib/uploads/asset-library"

const tabLabels: Record<string, string> = {
  Overview: "Umumiy",
  Templates: "Shablonlar",
  Participants: "Ishtirokchilar",
  Assets: "Aktivlar",
  "Generated Files": "Generatsiya",
  Exports: "Eksport",
  Settings: "Sozlamalar",
}

export default function EventWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<string>("Overview")

  const event = useMemo(() => buildDashboardEvent(id), [id])
  const setup = useMemo(() => loadEventSetup(id), [id])
  const assets = useMemo(() => listAssetLibrary(), [])

  if (!event) {
    return (
      <div className="p-6 md:p-8">
        <EmptyState
          title="Tadbir topilmadi"
          description="Bu workspace mavjud emas yoki o‘chirilgan. Yangi tadbir yarating yoki ro‘yxatga qayting."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <LinkButton href="/dashboard/events/new">Tadbir yaratish</LinkButton>
              <LinkButton href="/dashboard/events" variant="outline">
                Tadbirlar ro‘yxati
              </LinkButton>
            </div>
          }
        />
      </div>
    )
  }

  const brandColors = setup?.brandColors

  return (
    <div className="min-h-full bg-muted/20">
      <div className="border-b border-border bg-card">
        <div className="px-4 py-6 md:px-6 lg:px-8">
          <Link href="/dashboard/events" className="text-sm font-medium text-primary hover:underline">
            ← Mening tadbirlarim
          </Link>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:justify-between">
            <div>
              <Badge text={event.eventTypeLabel} variant="outline" />
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{event.name}</h1>
              <p className="text-sm text-muted-foreground">
                Sana: {event.date} • {event.participantEstimate} ishtirokchi
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <LinkButton href={`/dashboard/events/${id}/builder`} size="sm">
                Event Builder
              </LinkButton>
              <LinkButton href="/editor" size="sm" variant="outline">
                Editor
              </LinkButton>
              <LinkButton href="/dashboard/bulk-generate" size="sm" variant="outline">
                Bulk generate
              </LinkButton>
            </div>
          </div>
          <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
            {WORKSPACE_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tabLabels[tab] || tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-8 md:px-6 lg:px-8">
        {activeTab === "Overview" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Materiallar", event.productCount],
                  ["Jarayon", `${event.progressPercent}%`],
                  ["Yangilangan", new Date(event.updatedAt).toLocaleDateString("uz-UZ")],
                ].map(([label, val]) => (
                  <div key={label as string} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold text-foreground">{val}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground">Tadbir brendingi</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {setup?.organizationName || "Tashkilot"} · {setup?.eventLocation || "Joylashuv"}
                </p>
                {brandColors ? (
                  <div className="mt-3 flex gap-2">
                    {[brandColors.primary, brandColors.secondary, brandColors.accent].map((c) => (
                      <div
                        key={c}
                        className="h-10 w-10 rounded-lg border border-border"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Brending sozlanmagan</p>
                )}
                <LinkButton href={`/dashboard/events/${id}/builder`} className="mt-4" size="sm" variant="outline">
                  Brendingni tahrirlash
                </LinkButton>
              </div>
            </div>
            <aside className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Workspace</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>✓ Event setup</li>
                <li>✓ {event.productCount} ta material</li>
                <li>✓ {assets.length} ta aktiv kutubxonada</li>
              </ul>
            </aside>
          </div>
        )}

        {activeTab === "Templates" && (
          <TabPanel
            title="Tanlangan materiallar"
            description={`${event.productCount} ta material Event Builder’da yoqilgan.`}
            action={
              <LinkButton href={`/dashboard/events/${id}/builder`} size="sm">
                Builder’ga o‘tish
              </LinkButton>
            }
          />
        )}

        {activeTab === "Participants" && (
          <TabPanel
            title="Ishtirokchilar ro‘yxati"
            description="Excel orqali ishtirokchilarni yuklang va ommaviy generatsiya qiling."
            action={
              <LinkButton href="/dashboard/bulk-generate" size="sm">
                Bulk generate
              </LinkButton>
            }
          />
        )}

        {activeTab === "Assets" && (
          <TabPanel
            title="Yuklangan aktivlar"
            description={
              assets.length > 0
                ? `${assets.length} ta fayl aktiv kutubxonasida saqlangan.`
                : "Hali aktiv yuklanmagan. Logo, imzo va muhrni formalar orqali qo‘shing."
            }
            action={
              <LinkButton href="/dashboard/assets" size="sm" variant="outline">
                Aktivlar kutubxonasi
              </LinkButton>
            }
          />
        )}

        {activeTab === "Generated Files" && (
          <TabPanel
            title="Generatsiya qilingan fayllar"
            description="Bulk generate orqali yaratilgan fayllar shu yerda ko‘rinadi."
            empty
          />
        )}

        {activeTab === "Exports" && (
          <TabPanel
            title="Eksport tarixi"
            description="Editor yoki Event Builder’dan eksport qilingan fayllar dashboard bosh sahifasida saqlanadi."
            action={
              <LinkButton href="/dashboard#export-history" size="sm" variant="outline">
                Eksport tarixi
              </LinkButton>
            }
          />
        )}

        {activeTab === "Settings" && (
          <TabPanel
            title="Tadbir sozlamalari"
            description={`${setup?.eventDescription || "Tavsif kiritilmagan"}`}
            action={
              <LinkButton href="/dashboard/events/new" size="sm" variant="outline">
                Yangi tadbir yaratish
              </LinkButton>
            }
          />
        )}
      </div>
    </div>
  )
}

function TabPanel({
  title,
  description,
  action,
  empty,
}: {
  title: string
  description: string
  action?: ReactNode
  empty?: boolean
}) {
  if (empty) {
    return (
      <EmptyState
        title={title}
        description={description}
        className="bg-card"
      />
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
