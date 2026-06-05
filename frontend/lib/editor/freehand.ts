import getStroke from 'perfect-freehand'
import { fabric } from 'fabric'

function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return ''
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q'] as (string | number)[]
  )
  d.push('Z')
  return d.join(' ')
}

/** Enable pen/freehand drawing on a Fabric canvas. Returns cleanup function. */
export function enableFreehandDrawing(
  fabricCanvas: fabric.Canvas,
  options?: { color?: string; size?: number; onStrokeComplete?: () => void }
): () => void {
  let isDrawing = false
  let points: number[][] = []
  let path: fabric.Path | null = null
  const color = options?.color ?? '#7B68EE'

  const onDown = (e: fabric.IEvent) => {
    const pointer = fabricCanvas.getPointer(e.e)
    isDrawing = true
    points = [[pointer.x, pointer.y, 0.5]]
  }

  const onMove = (e: fabric.IEvent) => {
    if (!isDrawing) return
    const pointer = fabricCanvas.getPointer(e.e)
    points.push([pointer.x, pointer.y, 0.5])

    const stroke = getStroke(points, {
      size: options?.size ?? 4,
      smoothing: 0.5,
      thinning: 0.5,
      streamline: 0.5,
    })

    const pathData = getSvgPathFromStroke(stroke)
    if (path) fabricCanvas.remove(path)

    path = new fabric.Path(pathData, {
      fill: color,
      stroke: 'none',
      selectable: false,
      evented: false,
    })
    fabricCanvas.add(path)
    fabricCanvas.requestRenderAll()
  }

  const onUp = () => {
    isDrawing = false
    if (path) {
      path.set({ selectable: true, evented: true })
      fabricCanvas.setActiveObject(path)
      options?.onStrokeComplete?.()
    }
    points = []
    path = null
  }

  fabricCanvas.on('mouse:down', onDown)
  fabricCanvas.on('mouse:move', onMove)
  fabricCanvas.on('mouse:up', onUp)

  return () => {
    fabricCanvas.off('mouse:down', onDown)
    fabricCanvas.off('mouse:move', onMove)
    fabricCanvas.off('mouse:up', onUp)
  }
}
