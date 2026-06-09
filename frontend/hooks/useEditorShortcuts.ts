'use client'

import { useEffect } from 'react'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import {
  copyObject,
  pasteObject,
  moveLayerUp,
  moveLayerDown,
} from '@/lib/editor/fabricConfig'

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

export function useEditorShortcuts(canvas: fabric.Canvas | null) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return

      const modifier = event.ctrlKey || event.metaKey
      const key = event.key.toLowerCase()

      if (modifier && key === 'z') {
        event.preventDefault()
        if (event.shiftKey) useEditorStore.getState().redo()
        else useEditorStore.getState().undo()
        return
      }
      if (modifier && key === 'y') {
        event.preventDefault()
        useEditorStore.getState().redo()
        return
      }
      if (modifier && key === 'c' && canvas) {
        event.preventDefault()
        copyObject(canvas)
        return
      }
      if (modifier && key === 'v' && canvas) {
        event.preventDefault()
        pasteObject(canvas)
        return
      }
      if (modifier && event.key === ']' && canvas) {
        event.preventDefault()
        moveLayerUp(canvas)
        return
      }
      if (modifier && event.key === '[' && canvas) {
        event.preventDefault()
        moveLayerDown(canvas)
        return
      }
      if (modifier && (event.key === '=' || event.key === '+')) {
        event.preventDefault()
        const { zoom, setZoom } = useEditorStore.getState()
        setZoom(Math.min(zoom + 0.1, 3))
        return
      }
      if (modifier && event.key === '-') {
        event.preventDefault()
        const { zoom, setZoom } = useEditorStore.getState()
        setZoom(Math.max(zoom - 0.1, 0.3))
        return
      }
      if (modifier && event.key === '0') {
        event.preventDefault()
        useEditorStore.getState().setZoom(0.75)
        return
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && canvas) {
        const object = canvas.getActiveObject()
        if (!object) return
        event.preventDefault()
        canvas.remove(object)
        canvas.requestRenderAll()
        useEditorStore.getState().pushHistory()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [canvas])
}
