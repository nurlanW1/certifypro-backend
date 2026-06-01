import { emptyEventSetup, setupToBasics, type EventSetup } from "@/lib/event-create/event-setup"
import type { EventCreateDraft } from "@/lib/event-create/types"
import { persistGet, persistRemove, persistSet } from "@/lib/persistence/client-store"

const SETUP_PREFIX = "gildia_event_setup_"
const BUILDER_PREFIX = "gildia_event_builder_"
const BUILDER_UI_PREFIX = "gildia_event_builder_ui_"
const LEGACY_DRAFT_KEY = "gildia_event_create_draft"

export type BuilderUiState = {
  activeId: string | null
  expandedId: string | null
}

export const emptyBuilderDraft = (): EventCreateDraft => ({
  basics: {
    eventName: "",
    eventDate: "",
    organization: "",
    venue: "",
    description: "",
  },
  enabled: {},
  forms: {},
  updatedAt: new Date().toISOString(),
})

export function saveEventSetup(eventId: string, setup: EventSetup) {
  if (typeof window === "undefined") return
  persistSet(`${SETUP_PREFIX}${eventId}`, JSON.stringify(setup))
}

export function loadEventSetup(eventId: string): EventSetup | null {
  if (typeof window === "undefined") return null
  try {
    const raw = persistGet(`${SETUP_PREFIX}${eventId}`)
    if (!raw) return null
    return { ...emptyEventSetup(), ...JSON.parse(raw) } as EventSetup
  } catch {
    return null
  }
}

export function saveBuilderDraft(eventId: string, draft: EventCreateDraft) {
  if (typeof window === "undefined") return
  persistSet(
    `${BUILDER_PREFIX}${eventId}`,
    JSON.stringify({ ...draft, updatedAt: new Date().toISOString() })
  )
}

export function loadBuilderDraft(eventId: string): EventCreateDraft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = persistGet(`${BUILDER_PREFIX}${eventId}`)
    if (!raw) return null
    return { ...emptyBuilderDraft(), ...JSON.parse(raw) } as EventCreateDraft
  } catch {
    return null
  }
}

/** Initialize builder from setup after create form submit */
export function createBuilderDraftFromSetup(setup: EventSetup): EventCreateDraft {
  return {
    ...emptyBuilderDraft(),
    basics: setupToBasics(setup),
  }
}

/** @deprecated Use loadBuilderDraft — legacy single-key draft */
export function loadDraft(): EventCreateDraft {
  if (typeof window === "undefined") return emptyBuilderDraft()
  try {
    const raw = persistGet(LEGACY_DRAFT_KEY)
    if (!raw) return emptyBuilderDraft()
    return { ...emptyBuilderDraft(), ...JSON.parse(raw) } as EventCreateDraft
  } catch {
    return emptyBuilderDraft()
  }
}

/** @deprecated */
export function saveDraft(draft: EventCreateDraft) {
  if (typeof window === "undefined") return
  persistSet(
    LEGACY_DRAFT_KEY,
    JSON.stringify({ ...draft, updatedAt: new Date().toISOString() })
  )
}

export function clearLegacyDraft() {
  if (typeof window === "undefined") return
  persistRemove(LEGACY_DRAFT_KEY)
}

export function saveBuilderUiState(eventId: string, ui: BuilderUiState) {
  if (typeof window === "undefined") return
  persistSet(`${BUILDER_UI_PREFIX}${eventId}`, JSON.stringify(ui))
}

export function loadBuilderUiState(eventId: string): BuilderUiState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = persistGet(`${BUILDER_UI_PREFIX}${eventId}`)
    if (!raw) return null
    return JSON.parse(raw) as BuilderUiState
  } catch {
    return null
  }
}

export function clearEventStorage(eventId: string) {
  if (typeof window === "undefined") return
  persistRemove(`${SETUP_PREFIX}${eventId}`)
  persistRemove(`${BUILDER_PREFIX}${eventId}`)
  persistRemove(`${BUILDER_UI_PREFIX}${eventId}`)
}
