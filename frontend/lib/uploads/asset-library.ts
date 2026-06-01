import type { StoredFormAsset, UploadKind } from "@/lib/uploads/types"
import { persistGet, persistSet } from "@/lib/persistence/client-store"

const LIBRARY_KEY = "gildia_asset_library"

export type LibraryAsset = StoredFormAsset & { id: string }

function readLibrary(): LibraryAsset[] {
  try {
    const raw = persistGet(LIBRARY_KEY)
    return raw ? (JSON.parse(raw) as LibraryAsset[]) : []
  } catch {
    return []
  }
}

function writeLibrary(items: LibraryAsset[]) {
  persistSet(LIBRARY_KEY, JSON.stringify(items.slice(0, 100)))
}

export function addToAssetLibrary(asset: StoredFormAsset): LibraryAsset {
  const entry: LibraryAsset = { ...asset, id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }
  writeLibrary([entry, ...readLibrary()])
  return entry
}

export function listAssetLibrary(kind?: UploadKind): LibraryAsset[] {
  const list = readLibrary()
  return kind ? list.filter((a) => a.kind === kind) : list
}

export function removeFromAssetLibrary(id: string) {
  writeLibrary(readLibrary().filter((a) => a.id !== id))
}
