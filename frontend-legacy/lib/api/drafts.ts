import { apiRequest } from "@/lib/api/client"
import type { EditorDesignState } from "@/lib/editor/canvas-types"
import type { EventDraftPayload } from "@/lib/persistence/types"

/**
 * Draft sync API — server stores in memory until DB is wired.
 * Client localStorage remains source of truth if API is unavailable.
 */

export async function syncDesignDraft(scope: string, state: EditorDesignState): Promise<void> {
  try {
    await apiRequest<{ ok: boolean }>("/api/drafts/design", {
      method: "POST",
      body: JSON.stringify({ scope, data: state }),
    })
  } catch {
    /* offline / API unavailable — client store only */
  }
}

export async function fetchDesignDraft(scope: string): Promise<EditorDesignState | null> {
  try {
    const res = await apiRequest<{ ok: boolean; data?: EditorDesignState }>(
      `/api/drafts/design/${encodeURIComponent(scope)}`
    )
    return res.data ?? null
  } catch {
    return null
  }
}

export async function syncEventDraft(payload: EventDraftPayload): Promise<void> {
  try {
    await apiRequest<{ ok: boolean }>("/api/drafts/event", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  } catch {
    /* client-only */
  }
}

export async function fetchEventDraft(eventId: string): Promise<EventDraftPayload | null> {
  try {
    const res = await apiRequest<{ ok: boolean; data?: EventDraftPayload }>(
      `/api/drafts/event/${encodeURIComponent(eventId)}`
    )
    return res.data ?? null
  } catch {
    return null
  }
}

export async function deleteDesignDraftRemote(scope: string): Promise<void> {
  try {
    await apiRequest(`/api/drafts/design/${encodeURIComponent(scope)}`, { method: "DELETE" })
  } catch {
    /* ignore */
  }
}

export async function deleteEventDraftRemote(eventId: string): Promise<void> {
  try {
    await apiRequest(`/api/drafts/event/${encodeURIComponent(eventId)}`, { method: "DELETE" })
  } catch {
    /* ignore */
  }
}
