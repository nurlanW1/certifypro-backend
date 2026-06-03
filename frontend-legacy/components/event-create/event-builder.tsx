"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"

import { EventLivePreviewPanel } from "@/components/event-create/event-live-preview-panel"
import { MaterialFormFields } from "@/components/event-create/material-form-fields"
import { Button, LinkButton } from "@/components/ui/button"
import { BadgeChip } from "@/components/ui/badge"
import { CATALOG_GROUPS, EVENT_CATALOG, getCatalogByGroup } from "@/lib/event-create/catalog"
import type { EventSetup } from "@/lib/event-create/event-setup"
import { EVENT_TYPE_OPTIONS } from "@/lib/event-create/event-setup"
import {
  getMaterialFormDefaults,
  isConfiguredMaterial,
} from "@/lib/event-create/material-form-schema"
import {
  emptyBuilderDraft,
  loadBuilderDraft,
  loadBuilderUiState,
  loadEventSetup,
} from "@/lib/event-create/storage"
import { buildEditorHref } from "@/lib/editor/editor-routes"
import type { EventCreateDraft } from "@/lib/event-create/types"
import { saveEventProgress } from "@/lib/persistence/event-progress"
import { useAutoSave } from "@/hooks/use-auto-save"

type Props = {
  eventId: string
}

export function EventBuilder({ eventId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [setup, setSetup] = useState<EventSetup | null>(null)
  const [draft, setDraft] = useState<EventCreateDraft>(emptyBuilderDraft)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const loadedSetup = loadEventSetup(eventId)
    if (!loadedSetup) {
      router.replace("/dashboard/events/new")
      return
    }
    const loadedDraft = loadBuilderDraft(eventId)
    const materialFromUrl = searchParams.get("material")
    const savedUi = loadBuilderUiState(eventId)
    const restoreId = materialFromUrl || savedUi?.activeId || null

    queueMicrotask(() => {
      setSetup(loadedSetup)
      setDraft(loadedDraft ?? emptyBuilderDraft())
      if (restoreId && EVENT_CATALOG.some((c) => c.id === restoreId)) {
        setActiveId(restoreId)
        setExpandedId(savedUi?.expandedId ?? materialFromUrl ?? restoreId)
      }
      setHydrated(true)
    })
  }, [eventId, router, searchParams])

  const persistProgress = useCallback(() => {
    if (!setup) return
    return saveEventProgress({
      eventId,
      setup,
      draft,
      ui: { activeId, expandedId },
    })
  }, [eventId, setup, draft, activeId, expandedId])

  const { lastSavedAt, isSaving, markDirty, saveNow } = useAutoSave({
    enabled: hydrated && !!setup,
    debounceMs: 1200,
    onSave: persistProgress,
  })

  useEffect(() => {
    if (hydrated) markDirty()
  }, [draft, hydrated, markDirty])

  const enabledCount = useMemo(() => Object.values(draft.enabled).filter(Boolean).length, [draft.enabled])

  const activeItem = EVENT_CATALOG.find((c) => c.id === activeId) ?? null
  const activeFormData = activeId ? draft.forms[activeId] || {} : {}
  const activeEnabled = activeId ? !!draft.enabled[activeId] : false

  const toggleEnabled = (id: string, on: boolean) => {
    setDraft((d) => {
      const nextForms = { ...d.forms }
      if (on && !nextForms[id]) {
        nextForms[id] = getMaterialFormDefaults(id, {
          eventName: setup?.eventName,
          eventDate: setup?.eventDate,
          organizationName: setup?.organizationName,
          eventLocation: setup?.eventLocation,
        })
      }
      return {
        ...d,
        enabled: { ...d.enabled, [id]: on },
        forms: on ? nextForms : d.forms,
      }
    })
    if (on) {
      setExpandedId(id)
      setActiveId(id)
    } else if (expandedId === id) setExpandedId(null)
  }

  const setFormField = (catalogId: string, key: string, value: string | Record<string, string>[]) => {
    setActiveId(catalogId)
    setDraft((d) => ({
      ...d,
      forms: {
        ...d.forms,
        [catalogId]: { ...d.forms[catalogId], [key]: value },
      },
    }))
  }

  const openEditor = (catalogId: string) => {
    saveEventProgress({
      eventId,
      setup: setup!,
      draft,
      ui: { activeId: catalogId, expandedId: expandedId ?? catalogId },
    })
    router.push(
      buildEditorHref({
        from: "event-create",
        templateId: catalogId,
        eventId,
        category: catalogId,
        eventProductId: catalogId,
      })
    )
  }

  const eventTypeLabel =
    EVENT_TYPE_OPTIONS.find((o) => o.value === setup?.eventType)?.label ?? setup?.eventType

  if (!hydrated || !setup) {
    return <div className="px-4 py-20 text-center text-muted-foreground">Yuklanmoqda...</div>
  }

  return (
    <div className="gildia-container py-6 md:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Tadbir ma’lumotlarini tahrirlash
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Event Builder
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <strong>{setup.eventName}</strong>
            {eventTypeLabel ? ` · ${eventTypeLabel}` : null}
            {setup.participantEstimate ? ` · ${setup.participantEstimate}` : null}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            {setup.brandColors.primary ? (
              <span
                className="size-8 rounded-lg border border-border shadow-sm"
                style={{ background: setup.brandColors.primary }}
                title="Asosiy rang"
              />
            ) : null}
            {setup.brandColors.secondary ? (
              <span
                className="size-8 rounded-lg border border-border shadow-sm"
                style={{ background: setup.brandColors.secondary }}
                title="Ikkinchi rang"
              />
            ) : null}
            <BadgeChip variant="outline">{enabledCount} ta material</BadgeChip>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <LinkButton href="/dashboard/events" variant="outline" size="sm">
              Bekor
            </LinkButton>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={isSaving}
              onClick={async () => {
                await saveNow()
                toast.success("Tadbir saqlandi")
              }}
            >
              <Save className="size-3.5" />
              {isSaving ? "Saqlanmoqda…" : "Saqlash"}
            </Button>
            <Button
              size="sm"
              disabled={enabledCount === 0}
              onClick={async () => {
                await saveNow()
                router.push(`/dashboard/events/${eventId}`)
              }}
            >
              Workspace’ga saqlash
            </Button>
          </div>
        </div>
      </div>
      {lastSavedAt ? (
        <p className="mb-4 text-xs text-muted-foreground">
          Oxirgi saqlash:{" "}
          {new Date(lastSavedAt).toLocaleString("uz-UZ", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" · "}Avtomatik saqlash yoqilgan
        </p>
      ) : null}

      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Har bir material uchun <strong>Ha</strong> yoki <strong>Yo‘q</strong> tanlang. Forma o‘zgarishi bilan
        o‘ngdagi <strong>jonli preview</strong> yangilanadi.
      </p>

      <div className="grid gap-8 xl:grid-cols-[1fr_minmax(300px,380px)]">
        <div className="space-y-8">
          {CATALOG_GROUPS.map((group) => {
            const items = getCatalogByGroup(group.id)
            if (!items.length) return null
            return (
              <section key={group.id}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h3>
                <div className="space-y-2">
                  {items.map((item) => {
                    const enabled = !!draft.enabled[item.id]
                    const expanded = expandedId === item.id
                    const isActive = activeId === item.id
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border bg-card transition-shadow ${
                          isActive ? "border-primary shadow-md ring-1 ring-primary/20" : "border-border"
                        }`}
                      >
                        <div
                          className="flex cursor-pointer items-center gap-3 p-4"
                          onClick={() => {
                            setActiveId(item.id)
                            if (enabled) setExpandedId(expanded ? null : item.id)
                          }}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {item.fields.length} ta maydon
                              {isConfiguredMaterial(item.id) ? " · maxsus forma" : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 rounded-full border border-border p-0.5">
                            <button
                              type="button"
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                !enabled ? "bg-foreground text-background" : "text-muted-foreground"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleEnabled(item.id, false)
                              }}
                            >
                              Yo‘q
                            </button>
                            <button
                              type="button"
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                enabled ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleEnabled(item.id, true)
                              }}
                            >
                              Ha
                            </button>
                          </div>
                        </div>

                        {enabled && expanded ? (
                          <div className="border-t border-border bg-muted/30 p-4">
                            <MaterialFormFields
                              fields={item.fields}
                              values={draft.forms[item.id] || {}}
                              onChange={(key, value) => setFormField(item.id, key, value)}
                            />
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button type="button" size="sm" onClick={() => openEditor(item.id)}>
                                Media editorda ochish
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setExpandedId(null)}
                              >
                                Yig‘ish
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <EventLivePreviewPanel
          activeItem={activeItem}
          enabled={activeEnabled}
          formData={activeFormData}
          setup={setup}
          enabledCount={enabledCount}
          onOpenEditor={() => activeItem && openEditor(activeItem.id)}
        />
      </div>

    </div>
  )
}
