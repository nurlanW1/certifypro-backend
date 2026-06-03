export const ZOOM_MIN = 25
export const ZOOM_MAX = 200

export function clampZoom(zoom: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(zoom)))
}

export type ViewportPoint = { x: number; y: number }

/** Zoom around screen point; returns new zoom and pan */
export function zoomAtScreenPoint(
  zoom: number,
  pan: ViewportPoint,
  screenX: number,
  screenY: number,
  viewportRect: DOMRect,
  factor: number
): { zoom: number; pan: ViewportPoint } {
  const oldScale = zoom / 100
  const newZoom = clampZoom(zoom * factor)
  const newScale = newZoom / 100
  if (oldScale === newScale) return { zoom, pan }

  const vx = screenX - viewportRect.left
  const vy = screenY - viewportRect.top
  const worldX = (vx - pan.x) / oldScale
  const worldY = (vy - pan.y) / oldScale

  return {
    zoom: newZoom,
    pan: {
      x: vx - worldX * newScale,
      y: vy - worldY * newScale,
    },
  }
}

export function computeFitView(
  viewportWidth: number,
  viewportHeight: number,
  artboardWidth: number,
  artboardHeight: number,
  padding = 48
): { zoom: number; pan: ViewportPoint } {
  const availW = Math.max(1, viewportWidth - padding * 2)
  const availH = Math.max(1, viewportHeight - padding * 2)
  const scale = Math.min(availW / artboardWidth, availH / artboardHeight)
  const zoom = clampZoom(scale * 100)
  const s = zoom / 100
  return {
    zoom,
    pan: {
      x: (viewportWidth - artboardWidth * s) / 2,
      y: (viewportHeight - artboardHeight * s) / 2,
    },
  }
}

export function centerArtboard(
  viewportWidth: number,
  viewportHeight: number,
  artboardWidth: number,
  artboardHeight: number,
  zoom: number
): ViewportPoint {
  const s = zoom / 100
  return {
    x: (viewportWidth - artboardWidth * s) / 2,
    y: (viewportHeight - artboardHeight * s) / 2,
  }
}
