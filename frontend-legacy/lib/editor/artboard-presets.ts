import {
  ARTBOARD_FORMATS,
  findFormatIdByEditorSize,
  resolveArtboardFormat,
  type ArtboardFormatDefinition,
} from "./product-artboards"

export type ArtboardPreset = {
  id: string
  label: string
  width: number
  height: number
}

export const ARTBOARD_PRESETS: ArtboardPreset[] = ARTBOARD_FORMATS.map((def) => {
  const resolved = resolveArtboardFormat(def.id)
  return {
    id: def.id,
    label: def.label,
    width: resolved.width,
    height: resolved.height,
  }
})

export function findArtboardPreset(width: number, height: number): ArtboardPreset | null {
  const id = findFormatIdByEditorSize(width, height)
  if (!id) return null
  const def = ARTBOARD_FORMATS.find((f) => f.id === id)
  if (!def) return null
  const resolved = resolveArtboardFormat(id)
  return {
    id: def.id,
    label: def.label,
    width: resolved.width,
    height: resolved.height,
  }
}

export type { ArtboardFormatDefinition }
