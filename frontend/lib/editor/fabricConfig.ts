import { fabric } from 'fabric'

/** Professional Fabric 5.x canvas setup (spec-aligned selection + cursors). */
export function createProfessionalCanvas(
  el: HTMLCanvasElement,
  width: number,
  height: number
): fabric.Canvas {
  const canvas = new fabric.Canvas(el, {
    width,
    height,
    backgroundColor: '#ffffff',
    preserveObjectStacking: true,
    selection: true,
    selectionColor: 'rgba(123, 104, 238, 0.08)',
    selectionBorderColor: '#7B68EE',
    selectionLineWidth: 1,
    defaultCursor: 'default',
    hoverCursor: 'move',
    moveCursor: 'grabbing',
    renderOnAddRemove: true,
  })

  return canvas
}

export function enableSnapToGrid(canvas: fabric.Canvas, gridSize = 8) {
  canvas.on('object:moving', (e) => {
    const obj = e.target
    if (!obj) return
    obj.set({
      left: Math.round((obj.left ?? 0) / gridSize) * gridSize,
      top: Math.round((obj.top ?? 0) / gridSize) * gridSize,
    })
  })
}

export function enableAlignmentGuides(canvas: fabric.Canvas) {
  canvas.on('object:moving', (e) => {
    const obj = e.target
    if (!obj) return

    const canvasCenterX = (canvas.width ?? 0) / 2
    const canvasCenterY = (canvas.height ?? 0) / 2
    const objCenterX = (obj.left ?? 0) + (obj.getScaledWidth() / 2)
    const objCenterY = (obj.top ?? 0) + (obj.getScaledHeight() / 2)
    const threshold = 8

    if (Math.abs(objCenterX - canvasCenterX) < threshold) {
      obj.set({ left: canvasCenterX - obj.getScaledWidth() / 2 })
    }
    if (Math.abs(objCenterY - canvasCenterY) < threshold) {
      obj.set({ top: canvasCenterY - obj.getScaledHeight() / 2 })
    }

    canvas.requestRenderAll()
  })
}

export function moveLayerUp(canvas: fabric.Canvas) {
  const obj = canvas.getActiveObject()
  if (obj) {
    canvas.bringForward(obj)
    canvas.requestRenderAll()
  }
}

export function moveLayerDown(canvas: fabric.Canvas) {
  const obj = canvas.getActiveObject()
  if (obj) {
    canvas.sendBackwards(obj)
    canvas.requestRenderAll()
  }
}

export function moveLayerToTop(canvas: fabric.Canvas) {
  const obj = canvas.getActiveObject()
  if (obj) {
    canvas.bringToFront(obj)
    canvas.requestRenderAll()
  }
}

export function moveLayerToBottom(canvas: fabric.Canvas) {
  const obj = canvas.getActiveObject()
  if (obj) {
    canvas.sendToBack(obj)
    canvas.requestRenderAll()
  }
}

export function toggleLock(canvas: fabric.Canvas): boolean {
  const obj = canvas.getActiveObject()
  if (!obj) return false
  const locked = !obj.lockMovementX
  obj.set({
    lockMovementX: locked,
    lockMovementY: locked,
    lockRotation: locked,
    lockScalingX: locked,
    lockScalingY: locked,
    selectable: !locked,
    evented: !locked,
  })
  canvas.requestRenderAll()
  return locked
}

let clipboard: fabric.Object | null = null

export function copyObject(canvas: fabric.Canvas): void {
  const obj = canvas.getActiveObject()
  if (!obj) return
  obj.clone((cloned: fabric.Object) => {
    clipboard = cloned
  })
}

export function pasteObject(canvas: fabric.Canvas): void {
  if (!clipboard) return
  clipboard.clone((cloned: fabric.Object) => {
    canvas.discardActiveObject()
    cloned.set({
      left: (cloned.left ?? 0) + 20,
      top: (cloned.top ?? 0) + 20,
      evented: true,
    })
    if (cloned.type === 'activeSelection') {
      cloned.canvas = canvas
      ;(cloned as fabric.ActiveSelection).forEachObject((child) => canvas.add(child))
      cloned.setCoords()
    } else {
      canvas.add(cloned)
    }
    canvas.setActiveObject(cloned)
    canvas.requestRenderAll()
  })
}
