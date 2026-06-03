'use client'

import { useEffect } from 'react'
import { EditorTopBar } from '@/components/editor/EditorTopBar'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { EditorCanvas } from '@/components/editor/EditorCanvas'
import { EditorProperties } from '@/components/editor/EditorProperties'
import { useEditorStore, type ActiveTool } from '@/store/editorStore'
import { AUTO_SAVE_INTERVAL_MS } from '@/lib/editor/constants'
import { saveDesign } from '@/lib/export'
import {
  addDefaultCircle,
  addDefaultLine,
  addDefaultRect,
  addDefaultText,
} from '@/lib/editor/fabric-utils'

interface EditorLayoutProps {
  designId: string
}

const SHORTCUTS: Record<string, ActiveTool | 'undo' | 'redo' | 'save'> = {
  v: 'select',
  t: 'text',
  i: 'image',
  r: 'rect',
  c: 'circle',
  l: 'line',
}

export function EditorLayout({ designId }: EditorLayoutProps) {
  const { initEditor, fabricCanvas, undo, redo, designName, setSaveStatus, setLastSaved, setDirty } =
    useEditorStore()

  useEffect(() => {
    void initEditor(designId)
    return () => useEditorStore.getState().reset()
  }, [designId, initEditor])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (fabricCanvas) {
          void saveDesign(designId, fabricCanvas, designName).then((ok) => {
            if (ok) {
              setSaveStatus('saved')
              setLastSaved(new Date())
              setDirty(false)
              window.setTimeout(() => setSaveStatus('idle'), 2000)
            }
          })
        }
        return
      }

      const key = e.key.toLowerCase()
      const tool = SHORTCUTS[key]
      if (tool && tool !== 'undo' && tool !== 'redo' && tool !== 'save') {
        useEditorStore.getState().setActiveTool(tool)
        const canvas = useEditorStore.getState().fabricCanvas
        if (!canvas) return
        switch (tool) {
          case 'text':
            addDefaultText(canvas)
            break
          case 'rect':
            addDefaultRect(canvas)
            break
          case 'circle':
            addDefaultCircle(canvas)
            break
          case 'line':
            addDefaultLine(canvas)
            break
          case 'image':
            document.querySelector<HTMLInputElement>('input[type=file][accept*="image"]')?.click()
            break
          default:
            break
        }
        useEditorStore.getState().pushHistory()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [designId, designName, fabricCanvas, redo, undo, setDirty, setLastSaved, setSaveStatus])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const { fabricCanvas: canvas, isDirty: dirty, designName: name } = useEditorStore.getState()
      if (!canvas || !dirty) return
      void saveDesign(designId, canvas, name).then((ok) => {
        if (ok) {
          setLastSaved(new Date())
          setDirty(false)
        }
      })
    }, AUTO_SAVE_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [designId, setDirty, setLastSaved])

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-tertiary">
      <EditorTopBar designId={designId} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <EditorToolbar />
        <EditorCanvas />
        <EditorProperties />
      </div>
    </div>
  )
}
