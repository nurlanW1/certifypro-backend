'use client'

import { useHotkeys } from 'react-hotkeys-hook'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import {
  copyObject,
  pasteObject,
  moveLayerUp,
  moveLayerDown,
} from '@/lib/editor/fabricConfig'

export function useEditorShortcuts(canvas: fabric.Canvas | null) {
  const { undo, redo, setZoom, zoom, setActiveTool } = useEditorStore()

  useHotkeys(
    'ctrl+c, meta+c',
    () => {
      if (canvas) copyObject(canvas)
    },
    [canvas]
  )

  useHotkeys(
    'ctrl+v, meta+v',
    () => {
      if (canvas) pasteObject(canvas)
    },
    [canvas]
  )

  useHotkeys(
    'ctrl+z, meta+z',
    (e) => {
      if (e.shiftKey) redo()
      else undo()
    },
    [undo, redo]
  )

  useHotkeys(
    'ctrl+shift+z, meta+shift+z, ctrl+y, meta+y',
    () => redo(),
    [redo]
  )

  useHotkeys(
    'delete, backspace',
    (e) => {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return
      const obj = canvas?.getActiveObject()
      if (obj && canvas) {
        canvas.remove(obj)
        canvas.requestRenderAll()
        useEditorStore.getState().pushHistory()
      }
    },
    [canvas]
  )

  useHotkeys(
    'ctrl+], meta+]',
    () => {
      if (canvas) moveLayerUp(canvas)
    },
    [canvas]
  )

  useHotkeys(
    'ctrl+[, meta+[',
    () => {
      if (canvas) moveLayerDown(canvas)
    },
    [canvas]
  )

  useHotkeys('ctrl+=, meta+=', () => setZoom(Math.min(zoom + 0.1, 3)), [zoom, setZoom])
  useHotkeys('ctrl+-, meta+-', () => setZoom(Math.max(zoom - 0.1, 0.3)), [zoom, setZoom])
  useHotkeys('ctrl+0, meta+0', () => setZoom(0.75), [setZoom])

  useHotkeys('v', () => setActiveTool('select'), [setActiveTool])
  useHotkeys('t', () => setActiveTool('text'), [setActiveTool])
  useHotkeys('r', () => setActiveTool('rect'), [setActiveTool])
  useHotkeys('c', () => setActiveTool('circle'), [setActiveTool])
  useHotkeys('p', () => setActiveTool('pen'), [setActiveTool])
  useHotkeys('i', () => setActiveTool('image'), [setActiveTool])
}
