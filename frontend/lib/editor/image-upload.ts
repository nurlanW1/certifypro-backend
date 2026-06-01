import { readFileAsDataUrl } from "@/lib/editor/canvas-factory"
import { validateUploadFile } from "@/lib/uploads/validation"

const MAX_CANVAS_SIDE = 1600
const JPEG_QUALITY = 0.88

export function isEditorImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true
  return /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(file.name)
}

export async function loadEditorImageFromFile(file: File): Promise<{
  src: string
  width: number
  height: number
}> {
  const validation = validateUploadFile(file, "generic_image")
  if (!validation.ok) {
    throw new Error(validation.message)
  }
  if (!isEditorImageFile(file)) {
    throw new Error("Faqat rasm fayllari (PNG, JPG, WEBP, SVG) qabul qilinadi")
  }

  const raw = await readFileAsDataUrl(file)
  const { src, width, height } = await compressDataUrlForCanvas(raw, file.type || "image/png")
  return { src, width, height }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Rasmni o‘qib bo‘lmadi"))
    img.src = src
  })
}

async function compressDataUrlForCanvas(
  dataUrl: string,
  mimeType: string
): Promise<{ src: string; width: number; height: number }> {
  if (mimeType.includes("svg") || dataUrl.length < 600_000) {
    const img = await loadImage(dataUrl)
    return { src: dataUrl, width: img.naturalWidth, height: img.naturalHeight }
  }

  const img = await loadImage(dataUrl)
  let { naturalWidth: width, naturalHeight: height } = img
  const longest = Math.max(width, height)

  if (longest <= MAX_CANVAS_SIDE) {
    return { src: dataUrl, width, height }
  }

  const scale = MAX_CANVAS_SIDE / longest
  width = Math.max(1, Math.round(width * scale))
  height = Math.max(1, Math.round(height * scale))

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return { src: dataUrl, width: img.naturalWidth, height: img.naturalHeight }

  ctx.drawImage(img, 0, 0, width, height)
  const outType = mimeType.includes("png") ? "image/png" : "image/jpeg"
  const src = canvas.toDataURL(outType, JPEG_QUALITY)
  return { src, width, height }
}

/** Fit natural image size into max box while keeping aspect ratio */
export function fitImageElementSize(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (naturalWidth <= 0 || naturalHeight <= 0) {
    return { width: Math.min(140, maxWidth), height: Math.min(100, maxHeight) }
  }
  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1)
  return {
    width: Math.max(24, Math.round(naturalWidth * scale)),
    height: Math.max(24, Math.round(naturalHeight * scale)),
  }
}
