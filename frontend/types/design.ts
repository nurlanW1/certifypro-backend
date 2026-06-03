export interface CanvasObjectData {
  type: string
  left: number
  top: number
  width?: number
  height?: number
  fill?: string
  text?: string
  fontSize?: number
}

export interface DesignCanvasData {
  version: string
  width: number
  height: number
  objects: CanvasObjectData[]
  background?: string
}

export interface Design {
  id: string
  userId: string
  eventId?: string | null
  templateId: string
  name: string
  /** Fabric.js JSON yoki legacy format */
  canvasData: DesignCanvasData | Record<string, unknown>
  exportedUrl?: string | null
  createdAt: string
  updatedAt: string
}
