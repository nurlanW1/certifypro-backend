import type { CanvasElement } from "@/lib/editor/canvas-types"
import { renderDesignToCanvas } from "@/lib/editor/canvas-raster-export"

const THUMB_MAX = 240

export async function captureDesignThumbnail(options: {
  width: number
  height: number
  background: string
  elements: CanvasElement[]
}): Promise<string | null> {
  if (typeof document === "undefined") return null
  try {
    const longest = Math.max(options.width, options.height, 1)
    const scale = Math.min(1, THUMB_MAX / longest)
    const canvas = await renderDesignToCanvas({
      ...options,
      scale,
    })
    return canvas.toDataURL("image/jpeg", 0.82)
  } catch {
    return null
  }
}
