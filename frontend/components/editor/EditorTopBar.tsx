'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Download,
  Undo2,
  Redo2,
  Eye,
  ChevronDown,
  FileImage,
  FileText,
  Link2,
  Loader2,
  Check,
  X,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import toast from 'react-hot-toast'
import { useEditorStore } from '@/store/editorStore'
import { exportToPNG, exportToPDF, saveDesign, copyCanvasPreviewLink } from '@/lib/export'
import { cn } from '@/lib/utils'

interface EditorTopBarProps {
  designId: string
}

export function EditorTopBar({ designId }: EditorTopBarProps) {
  const router = useRouter()
  const [editingName, setEditingName] = useState(false)

  const {
    designName,
    setDesignName,
    fabricCanvas,
    saveStatus,
    setSaveStatus,
    setLastSaved,
    isDirty,
    undo,
    redo,
    canUndo,
    canRedo,
    setDirty,
  } = useEditorStore()

  const handleSave = async () => {
    if (!fabricCanvas) return
    setSaveStatus('saving')
    const ok = await saveDesign(designId, fabricCanvas, designName)
    if (ok) {
      setSaveStatus('saved')
      setLastSaved(new Date())
      setDirty(false)
      window.setTimeout(() => setSaveStatus('idle'), 2000)
    } else {
      setSaveStatus('error')
      toast.error('Saqlab bo‘lmadi')
      window.setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const filename = designName.replace(/\s+/g, '-').toLowerCase() || 'gildia-design'

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 md:px-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 rounded-lg p-2 text-sm text-text-secondary transition-all duration-150 hover:bg-brand-50 hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Orqaga</span>
      </button>

      {editingName ? (
        <input
          type="text"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          onBlur={() => setEditingName(false)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
          className="gildia-input max-w-[200px] py-1.5 text-sm font-medium md:max-w-xs"
          autoFocus
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingName(true)}
          className="max-w-[140px] truncate px-2 text-sm font-semibold text-text-primary hover:text-brand-600 md:max-w-xs"
        >
          {designName}
        </button>
      )}

      <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

      <div className="hidden items-center gap-1 sm:flex">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo()}
          className="rounded-lg p-2 text-text-muted transition-all duration-150 hover:bg-brand-50 disabled:opacity-40"
          aria-label="Bekor qilish"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo()}
          className="rounded-lg p-2 text-text-muted transition-all duration-150 hover:bg-brand-50 disabled:opacity-40"
          aria-label="Qaytarish"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {isDirty && saveStatus === 'idle' && (
          <span className="hidden text-xs text-warning md:inline">Saqlanmagan</span>
        )}

        <button
          type="button"
          className="hidden rounded-lg p-2 text-text-muted hover:bg-brand-50 md:inline-flex"
          aria-label="Ko'rinish"
          onClick={() => toast('Ko\'rinish rejimi tez orada')}
        >
          <Eye className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saveStatus === 'saving'}
          className={cn(
            'gildia-btn-primary inline-flex items-center gap-2 px-3 py-2 text-sm',
            saveStatus === 'error' && 'bg-danger hover:bg-danger'
          )}
        >
          {saveStatus === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
          {saveStatus === 'saved' && <Check className="h-4 w-4" />}
          {saveStatus === 'error' && <X className="h-4 w-4" />}
          {saveStatus === 'idle' && <Save className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {saveStatus === 'saving'
              ? 'Saqlanmoqda...'
              : saveStatus === 'saved'
                ? 'Saqlandi'
                : saveStatus === 'error'
                  ? 'Xato'
                  : 'Saqlash'}
          </span>
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type="button" className="gildia-btn-secondary inline-flex items-center gap-1 px-3 py-2 text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Eksport</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="z-50 min-w-[200px] rounded-xl border border-border bg-surface p-1 shadow-lg"
            >
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary outline-none hover:bg-brand-50"
                onSelect={() => {
                  if (fabricCanvas) void exportToPNG(fabricCanvas, filename)
                }}
              >
                <FileImage className="h-4 w-4 text-text-muted" />
                PNG yuklash
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary outline-none hover:bg-brand-50"
                onSelect={() => {
                  if (fabricCanvas) void exportToPDF(fabricCanvas, filename)
                }}
              >
                <FileText className="h-4 w-4 text-text-muted" />
                PDF yuklash
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary outline-none hover:bg-brand-50"
                onSelect={() => {
                  if (!fabricCanvas) return
                  void copyCanvasPreviewLink(fabricCanvas).then(() => {
                    toast.success('Nusxa olindi')
                  })
                }}
              >
                <Link2 className="h-4 w-4 text-text-muted" />
                Link nusxalash
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
