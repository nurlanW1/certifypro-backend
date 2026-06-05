import { jsPDF } from 'jspdf'
import { fabric } from 'fabric'

/** High-quality PNG export from Fabric canvas. */
export function exportCanvasPNG(
  fabricCanvas: fabric.Canvas,
  filename = 'gildia-design',
  multiplier = 3
): void {
  const dataURL = fabricCanvas.toDataURL({ format: 'png', quality: 1, multiplier })
  const a = document.createElement('a')
  a.href = dataURL
  a.download = `${filename}.png`
  a.click()
}

/** A4 PDF export from Fabric canvas. */
export function exportCanvasPDF(
  fabricCanvas: fabric.Canvas,
  filename = 'gildia-design',
  orientation: 'portrait' | 'landscape' = 'portrait'
): void {
  const multiplier = 3
  const dataURL = fabricCanvas.toDataURL({ format: 'png', quality: 1, multiplier })
  const [w, h] = orientation === 'portrait' ? [210, 297] : [297, 210]
  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' })
  pdf.addImage(dataURL, 'PNG', 0, 0, w, h)
  pdf.save(`${filename}.pdf`)
}

/** SVG export from Fabric canvas. */
export function exportCanvasSVG(fabricCanvas: fabric.Canvas, filename = 'gildia-design'): void {
  const svg = fabricCanvas.toSVG()
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

/** Add non-interactive preview watermark. */
export function addWatermark(fabricCanvas: fabric.Canvas): void {
  const existing = fabricCanvas.getObjects().find((o) => (o as fabric.Object & { name?: string }).name === '__watermark__')
  if (existing) return

  const wm = new fabric.IText('GILDIA PREVIEW', {
    left: (fabricCanvas.width ?? 0) / 2,
    top: (fabricCanvas.height ?? 0) / 2,
    originX: 'center',
    originY: 'center',
    angle: -35,
    fontSize: 48,
    fill: 'rgba(123,104,238,0.12)',
    fontFamily: 'Inter',
    fontWeight: '700',
    selectable: false,
    evented: false,
  })
  ;(wm as fabric.Object & { name?: string }).name = '__watermark__'
  fabricCanvas.add(wm)
  fabricCanvas.requestRenderAll()
}
