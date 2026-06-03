import type { StoredUpload } from "@/lib/event-create/event-setup"
import { parseFormAsset, serializeFormAsset } from "@/lib/uploads/serialize"
import type { StoredFormAsset, UploadKind } from "@/lib/uploads/types"

export function storedUploadToSerialized(
  upload: StoredUpload | null,
  kind: UploadKind
): string {
  if (!upload) return ""
  return serializeFormAsset({
    v: 1,
    kind,
    name: upload.name,
    mimeType: upload.mimeType,
    size: upload.size,
    dataUrl: upload.dataUrl,
    uploadedAt: new Date().toISOString(),
  })
}

export function serializedToStoredUpload(value: string): StoredUpload | null {
  const asset = parseFormAsset(value)
  if (!asset) return null
  return {
    name: asset.name,
    mimeType: asset.mimeType,
    size: asset.size,
    dataUrl: asset.dataUrl,
  }
}

export function storedUploadFromAsset(asset: StoredFormAsset): StoredUpload {
  return {
    name: asset.name,
    mimeType: asset.mimeType,
    size: asset.size,
    dataUrl: asset.dataUrl,
  }
}
