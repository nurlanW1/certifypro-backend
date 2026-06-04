import { fabric } from 'fabric'

const WATERMARK_TEXT = 'Gildia.uz'

type FabricExportable = fabric.Canvas | fabric.StaticCanvas

/** Renders canvas to PNG data URL, optionally with watermark stamp. */
export async function canvasToPngDataUrl(
  source: FabricExportable,
  options: { watermark?: boolean; multiplier?: number }
): Promise<string> {
  const multiplier = options.multiplier ?? 2

  if (!options.watermark) {
    return source.toDataURL({ format: 'png', quality: 1, multiplier })
  }

  const width = source.getWidth()
  const height = source.getHeight()
  const el = document.createElement('canvas')
  const staticCanvas = new fabric.StaticCanvas(el, { width, height })

  return new Promise((resolve, reject) => {
    staticCanvas.loadFromJSON(source.toJSON(), () => {
      try {
        const wm = new fabric.Text(WATERMARK_TEXT, {
          left: width * 0.5,
          top: height * 0.92,
          originX: 'center',
          originY: 'center',
          fontSize: Math.max(14, Math.round(width * 0.025)),
          fill: 'rgba(38, 33, 92, 0.35)',
          fontFamily: 'Arial',
          selectable: false,
          evented: false,
        })
        staticCanvas.add(wm)
        staticCanvas.renderAll()
        resolve(staticCanvas.toDataURL({ format: 'png', quality: 1, multiplier }))
      } catch (e) {
        reject(e)
      } finally {
        staticCanvas.dispose()
      }
    })
  })
}
