export interface CanvasData {
  version: string
  objects: unknown[]
  background?: string
}

export interface Design {
  id: string
  userId: string
  eventId?: string | null
  templateId: string
  name: string
  canvasData: CanvasData
  exportedUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface DesignFormData {
  name: string
  templateId: string
  eventId?: string
}
