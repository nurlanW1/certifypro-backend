import type { EditorDesignState } from "@/lib/editor/canvas-types"
import type { EventSetup } from "@/lib/event-create/event-setup"
import type { EventCreateDraft } from "@/lib/event-create/types"
import type { BuilderUiState } from "@/lib/event-create/storage"

export type DesignRegistryEntry = {
  scope: string
  title: string
  source: "catalog" | "event"
  productId?: string
  eventId?: string
  category?: string
  thumbnail?: string
  updatedAt: string
}

export type ProductDraftRegistryEntry = {
  productId: string
  title: string
  updatedAt: string
}

export type EventDraftPayload = {
  eventId: string
  setup: EventSetup
  builder: EventCreateDraft
  ui?: BuilderUiState | null
  updatedAt: string
}

export type DesignDraftPayload = {
  scope: string
  state: EditorDesignState
}
