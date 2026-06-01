import { apiRequest } from "@/lib/api/client"
import type { StoredFormAsset } from "@/lib/uploads/types"

export const uploadEndpoints = {
  assets: "/api/uploads/assets",
  logos: "/api/uploads/logos",
  signatures: "/api/uploads/signatures",
  stamps: "/api/uploads/stamps",
} as const

/** Upload asset metadata (+ optional dataUrl). Falls back silently if API unavailable. */
export async function uploadAsset(asset: StoredFormAsset): Promise<{ ok: boolean; id?: string }> {
  try {
    const res = await apiRequest<{ ok: boolean; id?: string }>(uploadEndpoints.assets, {
      method: "POST",
      body: JSON.stringify(asset),
    })
    return res
  } catch {
    return { ok: false }
  }
}

export async function deleteUploadedAsset(id: string): Promise<void> {
  try {
    await apiRequest(`/api/uploads/assets/${encodeURIComponent(id)}`, { method: "DELETE" })
  } catch {
    /* ignore */
  }
}
