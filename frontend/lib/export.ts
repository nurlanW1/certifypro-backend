import { fabric } from 'fabric'
import jsPDF from 'jspdf'

export async function exportToPNG(
  canvas: fabric.Canvas,
  filename: string = 'gildia-design'
): Promise<void> {
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 2,
  })
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = dataURL
  link.click()
}

export async function exportToPDF(
  canvas: fabric.Canvas,
  filename: string = 'gildia-design'
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 3,
  })

  pdf.addImage(dataURL, 'PNG', 0, 0, 210, 297)
  pdf.save(`${filename}.pdf`)
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
