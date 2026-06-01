import type { RasterExportOptions } from "@/lib/editor/canvas-raster-export"
import { renderDesignToCanvas, triggerDownload } from "@/lib/editor/canvas-raster-export"

/**
 * Client-side PDF: embeds a JPEG raster (server vector PDF can replace this later).
 */
export async function exportDesignPdf(
  options: RasterExportOptions & { filename: string }
): Promise<void> {
  const canvas = await renderDesignToCanvas({ ...options, scale: options.scale ?? 2 })
  const imgData = canvas.toDataURL("image/jpeg", 0.92)
  const base64 = imgData.split(",")[1]
  if (!base64) throw new Error("PDF export failed")

  const jpegBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  const wPt = Math.max(72, (options.width / 96) * 72)
  const hPt = Math.max(72, (options.height / 96) * 72)
  const pdf = buildPdfFromJpeg(jpegBytes, canvas.width, canvas.height, wPt, hPt)
  const blob = new Blob([new Uint8Array(pdf)], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, `${options.filename}.pdf`)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function buildPdfFromJpeg(
  jpeg: Uint8Array,
  imgW: number,
  imgH: number,
  pageW: number,
  pageH: number
): Uint8Array {
  const enc = new TextEncoder()
  const chunks: Uint8Array[] = []
  const objOffsets: number[] = []
  let offset = 0

  const append = (data: string | Uint8Array) => {
    const bytes = typeof data === "string" ? enc.encode(data) : data
    chunks.push(bytes)
    offset += bytes.length
  }

  const addObject = (body: string | Uint8Array) => {
    objOffsets.push(offset)
    append(body)
  }

  append("%PDF-1.4\n")

  addObject("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
  addObject("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
  addObject(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW.toFixed(2)} ${pageH.toFixed(2)}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`
  )

  addObject(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`
  )
  append(jpeg)
  append("\nendstream\nendobj\n")

  const content = `q ${pageW.toFixed(2)} 0 0 ${pageH.toFixed(2)} 0 0 cm /Im1 Do Q\n`
  addObject(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`)

  const xrefPos = offset
  append("xref\n0 6\n0000000000 65535 f \n")
  for (let i = 0; i < 5; i++) {
    append(`${String(objOffsets[i]).padStart(10, "0")} 00000 n \n`)
  }
  append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`)

  const total = chunks.reduce((n, c) => n + c.length, 0)
  const out = new Uint8Array(total)
  let pos = 0
  for (const c of chunks) {
    out.set(c, pos)
    pos += c.length
  }
  return out
}
