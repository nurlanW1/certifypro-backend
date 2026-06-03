import type { EditorDesignState } from "@/lib/editor/canvas-types"
import {
  deleteEditorDesign,
  loadEditorDesign,
  saveEditorDesign,
} from "@/lib/editor/design-storage"
import { deleteEventDraftRemote, deleteDesignDraftRemote } from "@/lib/api/drafts"
import { EVENT_TYPE_OPTIONS, type EventType } from "@/lib/event-create/event-setup"
import { EVENT_CATALOG } from "@/lib/event-create/catalog"
import {
  clearEventStorage,
  createBuilderDraftFromSetup,
  loadBuilderDraft,
  loadEventSetup,
  saveBuilderDraft,
  saveEventSetup,
} from "@/lib/event-create/storage"
import type { EventCreateDraft } from "@/lib/event-create/types"
import { createEventId } from "@/lib/event-create/event-setup"
import { getProductById } from "@/lib/templates/product-catalog"
import { loadProductDraft } from "@/lib/templates/product-draft-storage"
import { persistKeys } from "@/lib/persistence/client-store"
import {
  listDesignRegistry,
  parseCatalogProductId,
  parseEventScope,
} from "@/lib/persistence/design-registry"

const EVENT_INDEX_KEY = "gildia_dashboard_event_ids"
const EXPORT_HISTORY_KEY = "gildia_export_history"
const SETUP_PREFIX = "gildia_event_setup_"

export type DashboardEvent = {
  id: string
  name: string
  eventType: EventType | ""
  eventTypeLabel: string
  date: string
  participantEstimate: string
  productCount: number
  progressPercent: number
  updatedAt: string
}

export type DesignStatus = "draft" | "in_progress" | "ready"

export type DashboardDesign = {
  id: string
  scope: string
  productType: string
  productId: string
  title: string
  thumbnailColor: string
  thumbnailSrc?: string
  lastEdited: string
  status: DesignStatus
  editorHref: string
  source: "catalog" | "event"
  eventId?: string
  category?: string
}

export type DashboardDraft = {
  id: string
  title: string
  kind: "product" | "event"
  subtitle: string
  updatedAt: string
  href: string
}

export type RecentFile = {
  id: string
  name: string
  type: string
  updatedAt: string
  href: string
}

export type ExportHistoryEntry = {
  id: string
  designName: string
  format: string
  createdAt: string
}

function isBrowser() {
  return typeof window !== "undefined"
}

function readEventIndex(): string[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(EVENT_INDEX_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function writeEventIndex(ids: string[]) {
  if (!isBrowser()) return
  localStorage.setItem(EVENT_INDEX_KEY, JSON.stringify([...new Set(ids)]))
}

export function registerDashboardEvent(eventId: string) {
  if (!isBrowser()) return
  const ids = readEventIndex()
  if (!ids.includes(eventId)) {
    writeEventIndex([eventId, ...ids])
  }
}

function scanEventIdsFromStorage(): string[] {
  return persistKeys(SETUP_PREFIX).map((k) => k.replace(SETUP_PREFIX, ""))
}

export function listDashboardEventIds(): string[] {
  return [...new Set([...readEventIndex(), ...scanEventIdsFromStorage()])]
}

function eventTypeLabel(value: EventType | ""): string {
  return EVENT_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? "Tadbir"
}

function countFilledFields(data: Record<string, unknown>): number {
  return Object.values(data).filter((v) => {
    if (v === null || v === undefined) return false
    if (typeof v === "string") return v.trim().length > 0
    if (Array.isArray(v)) return v.length > 0
    return true
  }).length
}

export function computeEventProgress(draft: EventCreateDraft | null): {
  productCount: number
  progressPercent: number
} {
  if (!draft) return { productCount: 0, progressPercent: 0 }
  const enabledIds = Object.entries(draft.enabled)
    .filter(([, on]) => on)
    .map(([id]) => id)
  const productCount = enabledIds.length
  if (productCount === 0) return { productCount: 0, progressPercent: 0 }

  let configured = 0
  for (const id of enabledIds) {
    const form = draft.forms[id]
    const fields = EVENT_CATALOG.find((c) => c.id === id)?.fields ?? []
    const requiredKeys = fields.filter((f) => f.required).map((f) => f.key)
    if (requiredKeys.length === 0) {
      if (form && countFilledFields(form) > 0) configured += 1
      continue
    }
    const ok = requiredKeys.every((key) => {
      const v = form?.[key]
      return typeof v === "string" ? v.trim().length > 0 : v != null
    })
    if (ok) configured += 1
  }

  const progressPercent = Math.round((configured / productCount) * 100)
  return { productCount, progressPercent }
}

export function buildDashboardEvent(eventId: string): DashboardEvent | null {
  const setup = loadEventSetup(eventId)
  const draft = loadBuilderDraft(eventId)
  if (!setup && !draft) return null

  const { productCount, progressPercent } = computeEventProgress(draft)
  const name = setup?.eventName || draft?.basics?.eventName || "Nomsiz tadbir"

  return {
    id: eventId,
    name,
    eventType: setup?.eventType ?? "",
    eventTypeLabel: eventTypeLabel(setup?.eventType ?? ""),
    date: setup?.eventDate || draft?.basics?.eventDate || "—",
    participantEstimate: setup?.participantEstimate || "—",
    productCount,
    progressPercent,
    updatedAt: draft?.updatedAt ?? new Date().toISOString(),
  }
}

export function listDashboardEvents(): DashboardEvent[] {
  return listDashboardEventIds()
    .map(buildDashboardEvent)
    .filter((e): e is DashboardEvent => e !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function duplicateDashboardEvent(eventId: string): string | null {
  const setup = loadEventSetup(eventId)
  const draft = loadBuilderDraft(eventId)
  if (!setup) return null

  const newId = createEventId()
  saveEventSetup(newId, setup)
  if (draft) {
    saveBuilderDraft(newId, {
      ...draft,
      basics: { ...draft.basics, eventName: `${draft.basics.eventName} (nusxa)` },
    })
  } else {
    saveBuilderDraft(newId, createBuilderDraftFromSetup(setup))
  }
  registerDashboardEvent(newId)

  for (const item of EVENT_CATALOG) {
    const scope = `event-${eventId}-${item.id}`
    const design = loadEditorDesign(scope)
    if (design) {
      const newScope = `event-${newId}-${item.id}`
      saveEditorDesign(newScope, {
        ...design,
        productName: `${design.productName} (nusxa)`,
      }, { source: "event", eventId: newId, category: item.id })
    }
  }

  return newId
}

export async function deleteDashboardEvent(eventId: string) {
  if (!isBrowser()) return
  clearEventStorage(eventId)

  for (const item of EVENT_CATALOG) {
    const scope = `event-${eventId}-${item.id}`
    deleteEditorDesign(scope)
    void deleteDesignDraftRemote(scope)
  }

  writeEventIndex(readEventIndex().filter((id) => id !== eventId))
  void deleteEventDraftRemote(eventId)
}

function designStatus(state: EditorDesignState | null, hasDraft: boolean): DesignStatus {
  if (!state && hasDraft) return "draft"
  if (!state) return "draft"
  if (state.status === "saved") return "ready"
  const layers = state.canvasData?.length ?? state.elements?.length ?? 0
  if (layers <= 2) return "draft"
  if (layers <= 5) return "in_progress"
  return "ready"
}

function thumbnailFromDesign(state: EditorDesignState | null, fallbackColor: string) {
  if (state?.thumbnail) {
    return { thumbnailColor: fallbackColor, thumbnailSrc: state.thumbnail }
  }
  const layers = state?.canvasData ?? state?.elements
  const img = layers?.find((e) => (e.type === "image" || e.type === "logo") && e.src)
  return {
    thumbnailColor: fallbackColor,
    thumbnailSrc: img?.src,
  }
}

function buildDesignFromRegistry(entry: ReturnType<typeof listDesignRegistry>[0]): DashboardDesign | null {
  const state = loadEditorDesign(entry.scope)
  if (!state) return null

  if (entry.source === "catalog") {
    const productId = entry.productId ?? parseCatalogProductId(entry.scope) ?? ""
    const product = productId ? getProductById(productId) : null
    const draft = productId ? loadProductDraft(productId) : null
    const thumb = thumbnailFromDesign(state, product?.previewTone === "card" ? "#dbeafe" : "#e0e7ff")
    return {
      id: entry.scope,
      scope: entry.scope,
      productType: product?.categorySlug ?? "design",
      productId,
      title: entry.title || state.productName || product?.title || "Dizayn",
      thumbnailColor: thumb.thumbnailColor,
      thumbnailSrc: thumb.thumbnailSrc,
      lastEdited: state.updatedAt,
      status: designStatus(state, !!draft),
      editorHref: productId
        ? `/editor?from=catalog&template=${productId}`
        : `/editor?from=catalog&template=${parseCatalogProductId(entry.scope) ?? ""}`,
      source: "catalog",
    }
  }

  const eventParts = entry.eventId && entry.category
    ? { eventId: entry.eventId, category: entry.category }
    : parseEventScope(entry.scope)
  const catalogItem = EVENT_CATALOG.find((c) => c.id === eventParts?.category)
  const thumb = thumbnailFromDesign(state, "#ecfdf5")
  return {
    id: entry.scope,
    scope: entry.scope,
    productType: catalogItem?.group ?? "event",
    productId: eventParts?.category ?? "",
    title: entry.title || state.productName || catalogItem?.name || "Event dizayn",
    thumbnailColor: thumb.thumbnailColor,
    thumbnailSrc: thumb.thumbnailSrc,
    lastEdited: state.updatedAt,
    status: designStatus(state, false),
    editorHref: eventParts
      ? `/editor?from=event-create&eventId=${eventParts.eventId}&category=${eventParts.category}`
      : "/editor",
    source: "event",
    eventId: eventParts?.eventId,
    category: eventParts?.category,
  }
}

export function listDashboardDesigns(): DashboardDesign[] {
  if (!isBrowser()) return []
  const fromRegistry = listDesignRegistry()
    .map(buildDesignFromRegistry)
    .filter((d): d is DashboardDesign => d !== null)

  if (fromRegistry.length > 0) return fromRegistry

  const designs: DashboardDesign[] = []
  for (const key of persistKeys("gildia_editor_design_")) {
    const scope = key.replace("gildia_editor_design_", "")
    const state = loadEditorDesign(scope)
    if (!state) continue
    const fake = buildDesignFromRegistry({
      scope,
      title: state.productName,
      source: scope.startsWith("event-") ? "event" : "catalog",
      updatedAt: state.updatedAt,
    })
    if (fake) designs.push(fake)
  }
  return designs.sort((a, b) => b.lastEdited.localeCompare(a.lastEdited))
}

export function duplicateDesign(design: DashboardDesign): string | null {
  const state = loadEditorDesign(design.scope)
  if (!state) return null
  const newScope =
    design.source === "catalog"
      ? `catalog-${design.productId}-copy-${Date.now()}`
      : `event-${design.eventId}-${design.category}-copy-${Date.now()}`

  saveEditorDesign(
    newScope,
    {
      ...state,
      productName: `${state.productName} (nusxa)`,
    },
    {
      source: design.source,
      productId: design.productId,
      eventId: design.eventId,
      category: design.category,
    }
  )
  return newScope
}

export function deleteDesign(scope: string) {
  deleteEditorDesign(scope)
  void deleteDesignDraftRemote(scope)
}

export function listDashboardDrafts(): DashboardDraft[] {
  if (!isBrowser()) return []
  const drafts: DashboardDraft[] = []

  for (const productId of persistKeys("gildia-product-draft-").map((k) =>
    k.replace("gildia-product-draft-", "")
  )) {
    const draft = loadProductDraft(productId)
    if (!draft) continue
    const hasDesign = loadEditorDesign(`catalog-${productId}`)
    if (hasDesign && (hasDesign.canvasData?.length ?? hasDesign.elements?.length ?? 0) > 3) continue

    drafts.push({
      id: productId,
      title: draft.meta.productTitle,
      kind: "product",
      subtitle: "Mahsulot formasi — to‘ldirilmoqda",
      updatedAt: draft.meta.updatedAt,
      href: `/editor?from=catalog&template=${encodeURIComponent(productId)}&fresh=1`,
    })
  }

  for (const eventId of listDashboardEventIds()) {
    const draft = loadBuilderDraft(eventId)
    const setup = loadEventSetup(eventId)
    const { progressPercent, productCount } = computeEventProgress(draft)
    if (progressPercent >= 100 && productCount > 0) continue
    const name = setup?.eventName || draft?.basics?.eventName
    if (!name) continue
    drafts.push({
      id: `event-${eventId}`,
      title: name,
      kind: "event",
      subtitle: productCount > 0 ? `${productCount} material tanlangan` : "Material tanlanmagan",
      updatedAt: draft?.updatedAt ?? new Date().toISOString(),
      href: `/dashboard/events/${eventId}/builder`,
    })
  }

  return drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function listRecentFiles(limit = 8): RecentFile[] {
  const designs = listDashboardDesigns().map((d) => ({
    id: d.id,
    name: d.title,
    type: d.productType,
    updatedAt: d.lastEdited,
    href: d.editorHref,
  }))
  const exports = listExportHistory().map((e) => ({
    id: e.id,
    name: e.designName,
    type: e.format,
    updatedAt: e.createdAt,
    href: "/dashboard#export-history",
  }))
  return [...designs, ...exports]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
}

export function listExportHistory(): ExportHistoryEntry[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(EXPORT_HISTORY_KEY)
    return raw ? (JSON.parse(raw) as ExportHistoryEntry[]) : []
  } catch {
    return []
  }
}

export function logExport(designName: string, format: string) {
  if (!isBrowser()) return
  const entry: ExportHistoryEntry = {
    id: `exp_${Date.now()}`,
    designName,
    format,
    createdAt: new Date().toISOString(),
  }
  const list = [entry, ...listExportHistory()].slice(0, 50)
  localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(list))
}
