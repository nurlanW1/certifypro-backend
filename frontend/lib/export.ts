import { fabric } from 'fabric'
import jsPDF from 'jspdf'
import { canvasToPngDataUrl } from '@/lib/export-watermark'

type ExportApiResult = {
  ok?: boolean
  watermark?: boolean
  highQuality?: boolean
  error?: string
  code?: string
}

async function logExport(
  designId: string,
  format: 'png' | 'pdf',
  eventId?: string | null
): Promise<ExportApiResult | null> {
  try {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ designId, format, eventId }),
    })
    const data = (await res.json()) as ExportApiResult & { error?: string }
    if (!res.ok) return { error: data.error, code: (data as { code?: string }).code }
    return data
  } catch {
    return null
  }
}

export async function exportToPNG(
  canvas: fabric.Canvas,
  filename: string = 'gildia-design',
  options?: { designId?: string; eventId?: string | null }
): Promise<boolean> {
  let watermark = false
  let multiplier = 2

  if (options?.designId) {
    const logged = await logExport(options.designId, 'png', options.eventId)
    if (!logged || logged.error) return false
    watermark = Boolean(logged.watermark)
    multiplier = logged.highQuality ? 2 : 1.5
  }

  const dataURL = await canvasToPngDataUrl(canvas, { watermark, multiplier })
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = dataURL
  link.click()
  return true
}

export async function exportToPDF(
  canvas: fabric.Canvas,
  filename: string = 'gildia-design',
  options?: { designId?: string; eventId?: string | null }
): Promise<boolean> {
  let watermark = false
  let multiplier = 3

  if (options?.designId) {
    const logged = await logExport(options.designId, 'pdf', options.eventId)
    if (!logged || logged.error) return false
    watermark = Boolean(logged.watermark)
    multiplier = logged.highQuality ? 3 : 2
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const dataURL = await canvasToPngDataUrl(canvas, { watermark, multiplier })

  pdf.addImage(dataURL, 'PNG', 0, 0, 210, 297)
  pdf.save(`${filename}.pdf`)
  return true
}

export async function saveDesign(
  designId: string,
  canvas: fabric.Canvas,
  name?: string
): Promise<boolean> {
  try {
    const canvasData = canvas.toJSON()
    const res = await fetch(`/api/designs/${designId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        canvasData,
        ...(name ? { name } : {}),
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function copyCanvasPreviewLink(canvas: fabric.Canvas): Promise<string> {
  const dataURL = canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 1 })
  try {
    const blob = await (await fetch(dataURL)).blob()
    const item = new ClipboardItem({ 'image/png': blob })
    await navigator.clipboard.write([item])
    return 'clipboard'
  } catch {
    await navigator.clipboard.writeText(dataURL)
    return 'dataurl'
  }
}
