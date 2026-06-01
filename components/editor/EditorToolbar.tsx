'use client'

import { Save, Download, Undo2, Redo2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEditorStore } from '@/store/editorStore'

interface EditorToolbarProps {
  onSave: () => void
  onExport: () => void
}

export function EditorToolbar({ onSave, onExport }: EditorToolbarProps) {
  const isSaving = useEditorStore((s) => s.isSaving)
  const isDirty = useEditorStore((s) => s.isDirty)

  return (
    <div className="flex items-center gap-2 border-b border-border bg-white px-4 py-2">
      <Button variant="ghost" size="sm" disabled>
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" disabled>
        <Redo2 className="h-4 w-4" />
      </Button>
      <div className="mx-2 h-6 w-px bg-border" />
      <Button size="sm" onClick={onSave} loading={isSaving}>
        <Save className="mr-1.5 h-4 w-4" />
        {isDirty ? 'Saqlash *' : 'Saqlash'}
      </Button>
      <Button variant="secondary" size="sm" onClick={onExport}>
        <Download className="mr-1.5 h-4 w-4" />
        Eksport
      </Button>
    </div>
  )
}
