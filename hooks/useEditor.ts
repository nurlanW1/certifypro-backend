'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useEditorStore } from '@/store/editorStore'
import type { CanvasData } from '@/types/design'

export function useEditor(designId: string) {
  const {
    canvasData,
    isDirty,
    isSaving,
    setCanvasData,
    setIsDirty,
    setIsSaving,
    setDesignId,
  } = useEditorStore()

  const saveDesign = useCallback(
    async (data: CanvasData) => {
      setIsSaving(true)
      try {
        const res = await fetch('/api/designs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: designId, canvasData: data }),
        })
        if (!res.ok) throw new Error('Failed to save')
        setCanvasData(data)
        setIsDirty(false)
        toast.success('Saqlangan')
      } catch {
        toast.error('Saqlashda xatolik')
      } finally {
        setIsSaving(false)
      }
    },
    [designId, setCanvasData, setIsDirty, setIsSaving]
  )

  const initEditor = useCallback(() => {
    setDesignId(designId)
  }, [designId, setDesignId])

  return {
    canvasData,
    isDirty,
    isSaving,
    setCanvasData,
    saveDesign,
    initEditor,
  }
}
