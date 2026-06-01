import { uploadAsset } from "@/lib/api/uploads"
import { addToAssetLibrary } from "@/lib/uploads/asset-library"
import { readFileAsDataUrl } from "@/lib/editor/canvas-factory"
import { parseCsvSessionsFromFile } from "@/lib/uploads/parse-csv-sessions"
import { serializeFormAsset } from "@/lib/uploads/serialize"
import type { StoredFormAsset, UploadKind, UploadResult } from "@/lib/uploads/types"
import { validateUploadFile } from "@/lib/uploads/validation"

export async function processFileUpload(file: File, kind: UploadKind): Promise<UploadResult> {
  const validation = validateUploadFile(file, kind)
  if (!validation.ok) {
    throw new Error(validation.message)
  }

  let dataUrl: string | undefined
  if (kind !== "excel") {
    dataUrl = await readFileAsDataUrl(file)
  }

  const asset: StoredFormAsset = {
    v: 1,
    kind,
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    dataUrl,
    uploadedAt: new Date().toISOString(),
  }

  if (kind === "excel") {
    dataUrl = await readFileAsDataUrl(file)
    asset.dataUrl = dataUrl
  }

  addToAssetLibrary(asset)
  void uploadAsset(asset).catch(() => {
    /* client-only fallback */
  })

  let sessions: Record<string, string>[] | undefined
  if (kind === "excel") {
    sessions = await parseCsvSessionsFromFile(file)
  }

  return { asset, sessions }
}

export async function processFileUploadSerialized(file: File, kind: UploadKind): Promise<{
  serialized: string
  sessions?: Record<string, string>[]
}> {
  const { asset, sessions } = await processFileUpload(file, kind)
  return { serialized: serializeFormAsset(asset), sessions }
}
