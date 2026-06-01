'use client'

import { create } from 'zustand'
import { fabric } from 'fabric'
import { serializeCanvas } from '@/lib/editor/fabric-utils'

export type ActiveTool = 'select' | 'text' | 'image' | 'rect' | 'circle' | 'line'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface EditorStore {
  designId: string | null
  designName: string
  setDesignName: (name: string) => void

  fabricCanvas: fabric.Canvas | null
  setFabricCanvas: (canvas: fabric.Canvas | null) => void

  activeTool: ActiveTool
  setActiveTool: (tool: ActiveTool) => void

  zoom: number
  setZoom: (zoom: number) => void

  selectedObject: fabric.Object | null
  setSelectedObject: (obj: fabric.Object | null) => void

  canvasData: object | null
  setCanvasData: (data: object | null) => void
  canvasReady: boolean
  setCanvasReady: (ready: boolean) => void

  isDirty: boolean
  setDirty: (dirty: boolean) => void

  saveStatus: SaveStatus
  setSaveStatus: (status: SaveStatus) => void
  lastSaved: Date | null
  setLastSaved: (d: Date | null) => void

  layersOpen: boolean
  setLayersOpen: (open: boolean) => void

  history: string[]
  historyIndex: number
  pushHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  initEditor: (designId: string) => Promise<void>
  syncFromCanvas: () => void
  reset: () => void
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  designId: null,
  designName: 'Nomsiz dizayn',
  setDesignName: (designName) => set({ designName, isDirty: true }),

  fabricCanvas: null,
  setFabricCanvas: (fabricCanvas) => set({ fabricCanvas }),

  activeTool: 'select',
  setActiveTool: (activeTool) => set({ activeTool }),

  zoom: 0.75,
  setZoom: (zoom) => set({ zoom }),

  selectedObject: null,
  setSelectedObject: (selectedObject) => set({ selectedObject }),

  canvasData: null,
  setCanvasData: (canvasData) => set({ canvasData }),
  canvasReady: false,
  setCanvasReady: (canvasReady) => set({ canvasReady }),

  isDirty: false,
  setDirty: (isDirty) => set({ isDirty }),

  saveStatus: 'idle',
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  lastSaved: null,
  setLastSaved: (lastSaved) => set({ lastSaved }),

  layersOpen: false,
  setLayersOpen: (layersOpen) => set({ layersOpen }),

  history: [],
  historyIndex: -1,

  pushHistory: () => {
    const { fabricCanvas, history, historyIndex } = get()
    if (!fabricCanvas) return
    const snapshot = serializeCanvas(fabricCanvas)
    const trimmed = history.slice(0, historyIndex + 1)
    trimmed.push(snapshot)
    set({ history: trimmed, historyIndex: trimmed.length - 1, isDirty: true })
  },

  undo: () => {
    const { history, historyIndex, fabricCanvas } = get()
    if (!fabricCanvas || historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    fabricCanvas.loadFromJSON(JSON.parse(prev) as object, () => {
      fabricCanvas.renderAll()
      get().setSelectedObject(null)
    })
    set({ historyIndex: historyIndex - 1, isDirty: true })
  },

  redo: () => {
    const { history, historyIndex, fabricCanvas } = get()
    if (!fabricCanvas || historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    fabricCanvas.loadFromJSON(JSON.parse(next) as object, () => {
      fabricCanvas.renderAll()
      get().setSelectedObject(null)
    })
    set({ historyIndex: historyIndex + 1, isDirty: true })
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => {
    const { history, historyIndex } = get()
    return historyIndex < history.length - 1
  },

  syncFromCanvas: () => {
    const { fabricCanvas } = get()
    if (!fabricCanvas) return
    set({ canvasData: fabricCanvas.toJSON() as object })
  },

  initEditor: async (designId) => {
    set({
      designId,
      canvasReady: false,
      history: [],
      historyIndex: -1,
      selectedObject: null,
      isDirty: false,
      saveStatus: 'idle',
    })

    try {
      const res = await fetch(`/api/designs/${designId}`)
      if (res.ok) {
        const data = (await res.json()) as {
          design: { name: string; canvasData: object | null }
        }
        set({
          designName: data.design.name,
          canvasData: data.design.canvasData,
        })
        return
      }
    } catch {
      // fallback
    }

    try {
      const fallback = await fetch(`/api/designs?id=${designId}`)
      if (fallback.ok) {
        const data = (await fallback.json()) as {
          design: { name: string; canvasData: object | null }
        }
        set({
          designName: data.design.name,
          canvasData: data.design.canvasData,
        })
      }
    } catch {
      set({
        canvasData: { version: '5.3.0', objects: [], background: '#ffffff' },
      })
    }
  },

  reset: () =>
    set({
      designId: null,
      designName: 'Nomsiz dizayn',
      fabricCanvas: null,
      activeTool: 'select',
      zoom: 0.75,
      selectedObject: null,
      canvasData: null,
      canvasReady: false,
      isDirty: false,
      saveStatus: 'idle',
      lastSaved: null,
      layersOpen: false,
      history: [],
      historyIndex: -1,
    }),
}))
