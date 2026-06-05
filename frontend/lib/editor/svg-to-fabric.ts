import { fabric } from 'fabric'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/lib/editor/constants'

/** Load SVG string onto canvas as individual editable Fabric objects. */
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

        const targetW = CANVAS_WIDTH
        const targetH = CANVAS_HEIGHT

        const group = fabric.util.groupSVGElements(objects, options)
        const rawW = group.width || targetW
        const rawH = group.height || targetH
        const scale = Math.min(targetW / rawW, targetH / rawH, 1) * 0.92

        canvas.clear()
        canvas.setBackgroundColor('#ffffff', () => {})

        const offsetX = (targetW - rawW * scale) / 2
        const offsetY = (targetH - rawH * scale) / 2

        objects.forEach((obj) => {
          obj.scale(scale)
          obj.set({
            left: (obj.left ?? 0) * scale + offsetX,
            top: (obj.top ?? 0) * scale + offsetY,
            selectable: true,
            evented: true,
          })
          canvas.add(obj)
        })

        canvas.renderAll()
        resolve(true)
      } catch {
        resolve(false)
      }
    })
  })
}
