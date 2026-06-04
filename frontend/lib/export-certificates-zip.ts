import JSZip from 'jszip'
import { canvasDataToPngDataUrl } from '@/lib/export/canvas-data-export'

interface BulkCertItem {
  participantName: string
  canvasData: object
}

async function pngBase64(
  canvasData: object,
  watermark: boolean,
  highQuality: boolean
): Promise<string | null> {
  const png = await canvasDataToPngDataUrl(canvasData, { watermark, highQuality })
  return png.split(',')[1] ?? null
}

function safeName(name: string): string {
  return name.replace(/[^\w\-]+/g, '_').slice(0, 80) || 'cert'
}

export async function downloadBulkCertificatesZip(
  eventName: string,
  items: BulkCertItem[],
  options: { watermark?: boolean; highQuality?: boolean }
): Promise<void> {
  const zip = new JSZip()
  const folder = zip.folder(
    `${eventName.replace(/[^\w\-]+/g, '_')}-sertifikatlar` || 'sertifikatlar'
  )
  if (!folder) return

  const wm = Boolean(options.watermark)
  const hq = Boolean(options.highQuality)

  for (const item of items) {
    const base64 = await pngBase64(item.canvasData, wm, hq)
    if (!base64) continue
    folder.file(`${safeName(item.participantName)}.png`, base64, { base64: true })
  }

  folder.file(
    'README.txt',
    'Gildia ommaviy sertifikat eksporti. Har bir fayl — bitta ishtirokchi (PNG).\n'
  )

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${eventName.replace(/\s+/g, '-')}-sertifikatlar.zip`
  a.click()
  URL.revokeObjectURL(url)
}

/** Har bir sertifikat alohida PDF (ZIP ichida). */
export async function downloadBulkCertificatesPdfZip(
  eventName: string,
  items: BulkCertItem[],
  options: { watermark?: boolean }
): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const zip = new JSZip()
  const folder = zip.folder(
    `${eventName.replace(/[^\w\-]+/g, '_')}-sertifikatlar-pdf` || 'sertifikatlar-pdf'
  )
  if (!folder) return

  const wm = Boolean(options.watermark)

  for (const item of items) {
    const dataUrl = await canvasDataToPngDataUrl(item.canvasData, {
      watermark: wm,
      highQuality: true,
    })
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297)
    const pdfBase64 = pdf.output('datauristring').split(',')[1]
    if (pdfBase64) {
      folder.file(`${safeName(item.participantName)}.pdf`, pdfBase64, { base64: true })
    }
  }

  folder.file('README.txt', 'Gildia PDF sertifikatlar (A4).\n')

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${eventName.replace(/\s+/g, '-')}-sertifikatlar-pdf.zip`
  a.click()
  URL.revokeObjectURL(url)
}
