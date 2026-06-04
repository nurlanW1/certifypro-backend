import { fabric } from 'fabric'

/** Load SVG string onto canvas (scaled to fit certificate size). */
export async function loadSvgOntoCanvas(
  canvas: fabric.Canvas,
  svgContent: string
): Promise<boolean> {
  if (!svgContent?.trim() || !svgContent.includes('<svg')) {
    return false
  }

  return new Promise((resolve) => {
    fabric.loadSVGFromString(svgContent, (objects, options) => {
      try {
        if (!objects?.length) {
          resolve(false)
          return
        }
        const group = fabric.util.groupSVGElements(objects, options)
        const targetW = 794
        const targetH = 1123
        const scale = Math.min(
          targetW / (group.width || targetW),
          targetH / (group.height || targetH),
          1
        )
        group.scale(scale)
        group.set({
          left: (targetW - (group.width || 0) * scale) / 2,
          top: (targetH - (group.height || 0) * scale) / 2,
          selectable: true,
        })
        canvas.clear()
        canvas.setBackgroundColor('#ffffff', () => {})
        canvas.add(group)
        canvas.renderAll()
        resolve(true)
      } catch {
        resolve(false)
      }
    })
  })
}
