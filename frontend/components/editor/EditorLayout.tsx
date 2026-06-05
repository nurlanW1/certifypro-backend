'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout'
import { useEditorShortcuts } from '@/hooks/useEditorShortcuts'
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
  p: 'pen',
}

export function EditorLayout({ designId }: EditorLayoutProps) {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const templateIdParam = searchParams.get('templateId')
  const assetParam = searchParams.get('asset') === '1'

  const {
    initEditor,
    fabricCanvas,
    undo,
    redo,
    designName,
    setSaveStatus,
    setLastSaved,
    setDirty,
    setAssetMode,
    setEventContext,
  } = useEditorStore()

  useEditorShortcuts(fabricCanvas)

  useEffect(() => {
    void initEditor(designId, { templateId: templateIdParam })
    return () => useEditorStore.getState().reset()
  }, [designId, templateIdParam, initEditor])

  useEffect(() => {
    setAssetMode(assetParam)
  }, [assetParam, setAssetMode])

  useEffect(() => {
    if (!eventId) {
      setEventContext(null)
      return
    }
    void fetch(`/api/events/${eventId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { event?: { name: string; organization: string; location: string; date: string } } | null) => {
        if (!d?.event) return
        setEventContext({
          eventName: d.event.name,
          organization: d.event.organization,
          location: d.event.location,
          date: d.event.date ? formatDate(d.event.date) : '',
        })
      })
      .catch(() => setEventContext(null))
  }, [eventId, setEventContext])

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
      const { assetMode } = useEditorStore.getState()
      if (assetMode && tool && ['rect', 'circle', 'line'].includes(tool)) return
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

  return <WorkspaceLayout designId={designId} eventId={eventId} />
}
