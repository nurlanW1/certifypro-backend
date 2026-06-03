import { fabric } from 'fabric'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/lib/editor/constants'

export type FabricObjectType = 'text' | 'image' | 'shape' | 'line' | 'unknown'

export function getFabricObjectType(obj: fabric.Object): FabricObjectType {
  if (obj instanceof fabric.IText || obj instanceof fabric.Text || obj instanceof fabric.Textbox) {
    return 'text'
  }
  if (obj instanceof fabric.Image) return 'image'
  if (obj instanceof fabric.Line) return 'line'
  if (obj instanceof fabric.Rect || obj instanceof fabric.Circle || obj instanceof fabric.Triangle) {
    return 'shape'
  }
  return 'unknown'
}

export function alignObject(
  canvas: fabric.Canvas,
  obj: fabric.Object,
  alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
) {
  const bound = obj.getBoundingRect()
  const canvasW = canvas.getWidth()
  const canvasH = canvas.getHeight()

  switch (alignment) {
    case 'left':
      obj.set({ left: 0 })
      break
    case 'center':
      obj.set({ left: canvasW / 2 - bound.width / 2 })
      break
    case 'right':
      obj.set({ left: canvasW - bound.width })
      break
    case 'top':
      obj.set({ top: 0 })
      break
    case 'middle':
      obj.set({ top: canvasH / 2 - bound.height / 2 })
      break
    case 'bottom':
      obj.set({ top: canvasH - bound.height })
      break
  }

  obj.setCoords()
  canvas.requestRenderAll()
}

export function addDefaultText(canvas: fabric.Canvas) {
  const text = new fabric.IText('Matn kiriting', {
    left: CANVAS_WIDTH / 2 - 80,
    top: CANVAS_HEIGHT / 2 - 20,
    fontFamily: 'Inter',
    fontSize: 24,
    fill: '#26215C',
  })
  canvas.add(text)
  canvas.setActiveObject(text)
  canvas.requestRenderAll()
  return text
}

export function addDefaultRect(canvas: fabric.Canvas) {
  const rect = new fabric.Rect({
    left: CANVAS_WIDTH / 2 - 100,
    top: CANVAS_HEIGHT / 2 - 60,
    width: 200,
    height: 120,
    fill: '#EEEDFE',
    stroke: '#534AB7',
    strokeWidth: 2,
    rx: 8,
    ry: 8,
  })
  canvas.add(rect)
  canvas.setActiveObject(rect)
  canvas.requestRenderAll()
  return rect
}

export function addDefaultCircle(canvas: fabric.Canvas) {
  const circle = new fabric.Circle({
    left: CANVAS_WIDTH / 2 - 60,
    top: CANVAS_HEIGHT / 2 - 60,
    radius: 60,
    fill: '#7F77DD',
    stroke: '#534AB7',
    strokeWidth: 2,
  })
  canvas.add(circle)
  canvas.setActiveObject(circle)
  canvas.requestRenderAll()
  return circle
}

export function addDefaultLine(canvas: fabric.Canvas) {
  const line = new fabric.Line(
    [CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2 + 80, CANVAS_HEIGHT / 2],
    {
      stroke: '#534AB7',
      strokeWidth: 3,
    }
  )
  canvas.add(line)
  canvas.setActiveObject(line)
  canvas.requestRenderAll()
  return line
}

export function loadImageToCanvas(canvas: fabric.Canvas, url: string): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      url,
      (img) => {
        if (!img) {
          reject(new Error('Rasm yuklanmadi'))
          return
        }
        const maxW = CANVAS_WIDTH * 0.6
        const scale = Math.min(1, maxW / (img.width ?? maxW))
        img.set({
          left: CANVAS_WIDTH / 2 - ((img.width ?? 0) * scale) / 2,
          top: CANVAS_HEIGHT / 2 - ((img.height ?? 0) * scale) / 2,
          scaleX: scale,
          scaleY: scale,
        })
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.requestRenderAll()
        resolve(img)
      },
      { crossOrigin: 'anonymous' }
    )
  })
}

export function serializeCanvas(canvas: fabric.Canvas): string {
  return JSON.stringify(canvas.toJSON())
}

export function isFabricCanvasJson(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && ('objects' in data || 'version' in data)
}
