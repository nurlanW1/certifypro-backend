'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { EditorCanvas } from '@/components/editor/EditorCanvas'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { EditorSidebar } from '@/components/editor/EditorSidebar'
import { useEditor } from '@/hooks/useEditor'
import { useEditorStore } from '@/store/editorStore'

export default function EditorPage() {
  const { designId } = useParams<{ designId: string }>()
  const { saveDesign, initEditor, canvasData } = useEditor(designId)
  const setIsDirty = useEditorStore((s) => s.setIsDirty)

  useEffect(() => {
    initEditor()
  }, [initEditor])

  const handleSave = () => {
    if (canvasData) {
      void saveDesign(canvasData)
    } else {
      toast.error('Kanvas ma\'lumoti yo\'q')
    }
  }

  const handleExport = async () => {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId, canvasData }),
      })
      if (!res.ok) throw new Error('Export failed')
      toast.success('Eksport tayyor')
      setIsDirty(false)
    } catch {
      toast.error('Eksportda xatolik')
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <EditorToolbar onSave={handleSave} onExport={handleExport} />
      <div className="flex flex-1 overflow-hidden">
        <EditorCanvas />
        <EditorSidebar />
      </div>
    </div>
  )
}
