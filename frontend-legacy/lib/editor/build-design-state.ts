import type { CanvasElement, EditorDesignState, EditorDesignStatus } from "@/lib/editor/canvas-types"

export type BuildDesignStateInput = {
  productName: string
  elements: CanvasElement[]
  artboard: {
    width: number
    height: number
    background: string
    formatId: string
  }
  productType?: string | null
  eventId?: string | null
  category?: string | null
  status?: EditorDesignStatus
  thumbnail?: string | null
}

/** Canonical payload for local storage + future API sync */
export function buildDesignState(input: BuildDesignStateInput): EditorDesignState {
  const updatedAt = new Date().toISOString()
  return {
    productName: input.productName,
    productType: input.productType ?? undefined,
    eventId: input.eventId ?? undefined,
    category: input.category ?? undefined,
    status: input.status ?? "draft",
    canvasData: input.elements,
    elements: input.elements,
    artboardWidth: input.artboard.width,
    artboardHeight: input.artboard.height,
    artboardBackground: input.artboard.background,
    artboardFormatId: input.artboard.formatId,
    thumbnail: input.thumbnail ?? null,
    updatedAt,
  }
}

export function designElementsFromState(state: EditorDesignState): CanvasElement[] {
  if (state.canvasData?.length) return state.canvasData
  return state.elements ?? []
}
