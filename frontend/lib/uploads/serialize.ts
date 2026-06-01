import type { StoredFormAsset } from "@/lib/uploads/types"

const PREFIX = "gildia-asset:"

export function serializeFormAsset(asset: StoredFormAsset): string {
  return PREFIX + JSON.stringify(asset)
}

export function parseFormAsset(value: unknown): StoredFormAsset | null {
  if (typeof value !== "string" || !value.trim()) return null
  if (value.startsWith(PREFIX)) {
    try {
      const parsed = JSON.parse(value.slice(PREFIX.length)) as StoredFormAsset
      if (parsed?.v === 1 && parsed.name) return parsed
    } catch {
      return null
    }
  }
  try {
    const parsed = JSON.parse(value) as StoredFormAsset
    if (parsed?.v === 1 && parsed.name) return parsed
  } catch {
    /* legacy plain filename */
  }
  return null
}

export function assetDataUrlFromFormValue(value: unknown): string | undefined {
  return parseFormAsset(value)?.dataUrl
}

export function assetNameFromFormValue(value: unknown): string {
  const asset = parseFormAsset(value)
  if (asset) return asset.name
  return typeof value === "string" ? value : ""
}

export function hasFormAsset(value: unknown): boolean {
  return Boolean(parseFormAsset(value)?.dataUrl || (typeof value === "string" && value.length > 0))
}
