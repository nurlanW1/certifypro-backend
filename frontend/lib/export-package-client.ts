import { fabric } from 'fabric'
import JSZip from 'jszip'
import { applyVariablesToCanvasJson } from '@/lib/editor/variables'
import type { EventVariableContext } from '@/lib/editor/variables'
import { canvasToPngDataUrl } from '@/lib/export-watermark'

interface PackageItem {
  materialLabel: string
  designName: string
  canvasData: object
}

function renderCanvasToPng(
  canvasData: object,
  watermark: boolean,
  highQuality: boolean
): Promise<string> {
  return new Promise((resolve, reject) => {
    const el = document.createElement('canvas')
    const staticCanvas = new fabric.StaticCanvas(el, { width: 794, height: 1123 })
    staticCanvas.loadFromJSON(canvasData, () => {
      void canvasToPngDataUrl(staticCanvas, {
        watermark,
        multiplier: highQuality ? 2 : 1.5,
      })
        .then(resolve)
        .catch(reject)
        .finally(() => staticCanvas.dispose())
    })
  })
}

export async function downloadEventPackageZip(
  eventName: string,
  items: PackageItem[],
  options?: EventVariableContext & { watermark?: boolean; highQuality?: boolean }
): Promise<void> {
  const variableContext = options
  const watermark = Boolean(options?.watermark)
  const highQuality = Boolean(options?.highQuality)
  const zip = new JSZip()
  const folder = zip.folder(eventName.replace(/[^\w\-]+/g, '_') || 'tadbir')
  if (!folder) return

  for (const item of items) {
    const data = variableContext
      ? applyVariablesToCanvasJson(item.canvasData, variableContext)
      : item.canvasData
    const png = await renderCanvasToPng(data, watermark, highQuality)
    const base64 = png.split(',')[1]
    if (!base64) continue
    const filename = `${item.materialLabel}-${item.designName}.png`.replace(
      /[^\w\-\.]+/g,
      '_'
    )
    folder.file(filename, base64, { base64: true })
  }

  folder.file(
    'README.txt',
    'Gildia paket eksporti. Har bir PNG alohida material uchun.\n'
  )

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${eventName.replace(/\s+/g, '-')}-paket.zip`
  a.click()
  URL.revokeObjectURL(url)
}
