import { fabric } from 'fabric'
import jsPDF from 'jspdf'
import { canvasToPngDataUrl } from '@/lib/export-watermark'

const DEFAULT_WIDTH = 794
const DEFAULT_HEIGHT = 1123

export interface CanvasExportOptions {
  watermark?: boolean
  highQuality?: boolean
}

function loadStaticCanvas(canvasData: object): Promise<fabric.StaticCanvas> {
  return new Promise((resolve, reject) => {
    const el = document.createElement('canvas')
    const staticCanvas = new fabric.StaticCanvas(el, {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    })
    staticCanvas.loadFromJSON(canvasData, () => resolve(staticCanvas))
    staticCanvas.on('error', () => reject(new Error('Canvas load failed')))
  })
}

export async function canvasDataToPngDataUrl(
  canvasData: object,
  options: CanvasExportOptions = {}
): Promise<string> {
  const canvas = await loadStaticCanvas(canvasData)
  try {
    return await canvasToPngDataUrl(canvas, {
      watermark: options.watermark,
      multiplier: options.highQuality ? 2 : 1.5,
    })
  } finally {
    canvas.dispose()
  }
}

export async function downloadCanvasDataAsPng(
  canvasData: object,
  filename: string,
  options: CanvasExportOptions = {}
): Promise<void> {
  const dataUrl = await canvasDataToPngDataUrl(canvasData, options)
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `${filename}.png`
  a.click()
}

export async function downloadCanvasDataAsPdf(
  canvasData: object,
  filename: string,
  options: CanvasExportOptions = {}
): Promise<void> {
  const dataUrl = await canvasDataToPngDataUrl(canvasData, {
    ...options,
    highQuality: true,
  })
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297)
  pdf.save(`${filename}.pdf`)
}
