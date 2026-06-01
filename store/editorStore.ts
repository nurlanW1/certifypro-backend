'use client'

import { create } from 'zustand'
import type { CanvasData } from '@/types/design'

interface EditorState {
  designId: string | null
  canvasData: CanvasData | null
  isDirty: boolean
  isSaving: boolean
  setDesignId: (id: string | null) => void
  setCanvasData: (data: CanvasData | null) => void
  setIsDirty: (dirty: boolean) => void
  setIsSaving: (saving: boolean) => void
  reset: () => void
}

const initialState = {
  designId: null,
  canvasData: null,
  isDirty: false,
  isSaving: false,
}

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setDesignId: (designId) => set({ designId }),
  setCanvasData: (canvasData) => set({ canvasData, isDirty: true }),
  setIsDirty: (isDirty) => set({ isDirty }),
  setIsSaving: (isSaving) => set({ isSaving }),
  reset: () => set(initialState),
}))
