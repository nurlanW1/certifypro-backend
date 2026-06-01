import type { EditorDesignState } from "@/lib/editor/canvas-types"
import type { CanvasElement } from "@/lib/editor/canvas-types"
import { ARTBOARD_A4_LANDSCAPE } from "@/lib/editor/canvas-types"
import { buildDesignState, designElementsFromState } from "@/lib/editor/build-design-state"
import { syncDesignDraft } from "@/lib/api/drafts"
import type { EditorRouteContext } from "@/lib/editor/editor-routes"
import { persistGet, persistRemove, persistSet } from "@/lib/persistence/client-store"
import {
  parseCatalogProductId,
  parseEventScope,
  registerDesignEntry,
  removeDesignEntry,
} from "@/lib/persistence/design-registry"

const PREFIX = "gildia_editor_design_"

export function designStorageKey(scope: string) {
  return `${PREFIX}${scope}`
}

export function loadEditorDesign(scope: string): EditorDesignState | null {
  if (typeof window === "undefined" || !scope) return null
  try {
    const raw = persistGet(designStorageKey(scope))
    if (!raw) return null
    const parsed = JSON.parse(raw) as EditorDesignState
    if (!parsed.canvasData?.length && parsed.elements?.length) {
      parsed.canvasData = parsed.elements
    }
    return parsed
  } catch {
    return null
  }
}

export type SaveEditorDesignMeta = {
  source: "catalog" | "event"
  productId?: string
  eventId?: string
  category?: string
  thumbnail?: string | null
}

export function saveEditorDesign(
  scope: string,
  state: EditorDesignState,
  meta?: SaveEditorDesignMeta
) {
  if (typeof window === "undefined" || !scope) return
  const payload: EditorDesignState = {
    ...state,
    canvasData: state.canvasData ?? state.elements ?? [],
    elements: state.canvasData ?? state.elements ?? [],
    updatedAt: new Date().toISOString(),
  }
  persistSet(designStorageKey(scope), JSON.stringify(payload))

  const catalogId = meta?.productId ?? parseCatalogProductId(scope)
  const eventParts = meta?.eventId
    ? { eventId: meta.eventId, category: meta.category }
    : parseEventScope(scope)

  registerDesignEntry({
    scope,
    title: payload.productName || "Dizayn",
    source: meta?.source ?? (scope.startsWith("event-") ? "event" : "catalog"),
    productId: catalogId ?? undefined,
    eventId: eventParts?.eventId,
    category: eventParts?.category ?? meta?.category,
    thumbnail: meta?.thumbnail ?? payload.thumbnail ?? undefined,
    updatedAt: payload.updatedAt,
  })

  void syncDesignDraft(scope, payload)
}

export function deleteEditorDesign(scope: string) {
  if (typeof window === "undefined" || !scope) return
  persistRemove(designStorageKey(scope))
  removeDesignEntry(scope)
}

export function resolveEditorScope(params: {
  from: string | null
  templateId: string | null
  eventId: string | null
  category: string | null
  eventProductId?: string | null
}): string {
  if (params.from === "catalog" && params.templateId) return `catalog-${params.templateId}`
  if (params.from === "event-create" && params.eventId && params.category) {
    const base = `event-${params.eventId}-${params.category}`
    return params.eventProductId ? `${base}-${params.eventProductId}` : base
  }
  if (params.templateId) return `catalog-${params.templateId}`
  return "default"
}

export function defaultDesignState(
  productName: string,
  elements: CanvasElement[],
  artboard?: {
    width: number
    height: number
    background?: string
    formatId?: string
  },
  extra?: Partial<Pick<EditorDesignState, "productType" | "eventId" | "category" | "status" | "thumbnail">>
): EditorDesignState {
  return buildDesignState({
    productName,
    elements,
    artboard: {
      width: artboard?.width ?? ARTBOARD_A4_LANDSCAPE.width,
      height: artboard?.height ?? ARTBOARD_A4_LANDSCAPE.height,
      background: artboard?.background ?? "#ffffff",
      formatId: artboard?.formatId ?? "certificate-a4-landscape",
    },
    productType: extra?.productType,
    eventId: extra?.eventId,
    category: extra?.category,
    status: extra?.status,
    thumbnail: extra?.thumbnail,
  })
}

export function duplicateEditorDesign(
  currentScope: string,
  state: EditorDesignState,
  route: EditorRouteContext
): { newScope: string; href: string } {
  const ts = Date.now()
  let newScope: string
  let source: "catalog" | "event" = "catalog"
  let productId = route.templateId ?? state.productType ?? undefined
  let eventId = route.eventId ?? state.eventId ?? undefined
  let category = route.category ?? state.category ?? undefined

  if (currentScope.startsWith("event-") || route.from === "event-create") {
    source = "event"
    const parts = parseEventScope(currentScope)
    eventId = eventId ?? parts?.eventId
    category = category ?? parts?.category
    newScope =
      eventId && category ? `event-${eventId}-${category}-copy-${ts}` : `event-copy-${ts}`
  } else {
    const pid = parseCatalogProductId(currentScope) ?? productId ?? "default"
    productId = pid
    newScope = `catalog-${pid}-copy-${ts}`
  }

  const copyName = `${state.productName || "Dizayn"} (nusxa)`
  const payload: EditorDesignState = {
    ...state,
    productName: copyName,
    canvasData: designElementsFromState(state).map((e) => ({ ...e })),
    status: "draft",
    updatedAt: new Date().toISOString(),
  }
  payload.elements = payload.canvasData

  saveEditorDesign(newScope, payload, {
    source,
    productId: productId ?? undefined,
    eventId: eventId ?? undefined,
    category: category ?? undefined,
    thumbnail: payload.thumbnail,
  })

  const params = new URLSearchParams()
  if (source === "event") {
    params.set("from", "event-create")
    if (eventId) params.set("eventId", eventId)
    if (category) params.set("category", category)
  } else {
    params.set("from", "catalog")
    if (productId) params.set("template", productId)
  }
  params.set("scope", newScope)

  return { newScope, href: `/editor?${params.toString()}` }
}
