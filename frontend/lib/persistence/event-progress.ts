import type { EventSetup } from "@/lib/event-create/event-setup"
import {
  loadBuilderDraft,
  loadBuilderUiState,
  loadEventSetup,
  saveBuilderDraft,
  saveBuilderUiState,
  saveEventSetup,
  type BuilderUiState,
} from "@/lib/event-create/storage"
import type { EventCreateDraft } from "@/lib/event-create/types"
import { registerDashboardEvent } from "@/lib/dashboard/dashboard-storage"
import { syncEventDraft } from "@/lib/api/drafts"

export type SaveEventProgressInput = {
  eventId: string
  setup?: EventSetup
  draft?: EventCreateDraft
  ui?: BuilderUiState | null
}

/** Persist event setup, builder draft, UI state, and index for dashboard */
export function saveEventProgress(input: SaveEventProgressInput): string {
  const { eventId, setup, draft, ui } = input
  const updatedAt = new Date().toISOString()

  if (setup) saveEventSetup(eventId, setup)
  if (draft) {
    saveBuilderDraft(eventId, { ...draft, updatedAt })
  }
  if (ui !== undefined) {
    if (ui) saveBuilderUiState(eventId, ui)
  }

  registerDashboardEvent(eventId)

  const payload = {
    eventId,
    setup: setup ?? loadEventSetup(eventId),
    builder: draft ?? loadBuilderDraft(eventId),
    ui: ui ?? loadBuilderUiState(eventId),
    updatedAt,
  }

  if (payload.setup && payload.builder) {
    void syncEventDraft({
      eventId,
      setup: payload.setup,
      builder: payload.builder,
      ui: payload.ui ?? null,
      updatedAt,
    })
  }

  return updatedAt
}

export function loadEventProgress(eventId: string) {
  return {
    setup: loadEventSetup(eventId),
    draft: loadBuilderDraft(eventId),
    ui: loadBuilderUiState(eventId),
  }
}
