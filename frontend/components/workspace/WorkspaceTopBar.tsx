'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Printer,
  Share2,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import toast from 'react-hot-toast'
import { useEditorStore } from '@/store/editorStore'
import { exportToPNG, exportToPDF, saveDesign, copyCanvasPreviewLink } from '@/lib/export'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface WorkspaceTopBarProps {
  designId: string
}

const STYLE_PRESETS = ['Minimal', 'Klassik', 'Hi-Tech']

export function WorkspaceTopBar({ designId }: WorkspaceTopBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const [editingName, setEditingName] = useState(false)
  const [styleIdx, setStyleIdx] = useState(0)

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
    printPreview,
    setPrintPreview,
    assetMode,
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
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-divide bg-canvas px-4">
      <button
        type="button"
        onClick={() =>
          eventId ? router.push(`/events/${eventId}/materials`) : router.back()
        }
        className="btn-ghost btn-icon-sm"
        aria-label="Orqaga"
      >
        <ArrowLeft size={14} />
      </button>

      <div className="mx-1 h-5 w-px bg-divide" />

      {editingName ? (
        <input
          type="text"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          onBlur={() => setEditingName(false)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
          className={cn(
            'w-44 bg-transparent px-1 py-0.5 text-sm font-medium text-text-primary outline-none',
            'border-b border-accent transition-colors'
          )}
          autoFocus
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingName(true)}
          className="max-w-[176px] truncate border-b border-transparent bg-transparent px-1 py-0.5 text-sm font-medium text-text-primary transition-colors hover:border-divide focus:border-accent"
        >
          {designName}
        </button>
      )}

      <div className="ml-2 hidden items-center gap-1 md:flex">
        {STYLE_PRESETS.map((style, i) => (
          <button
            key={style}
            type="button"
            onClick={() => setStyleIdx(i)}
            className={cn(
              'rounded px-2.5 py-1 text-xs font-medium transition-all',
              i === styleIdx
                ? 'border border-accent-border bg-accent-dim text-accent-hover'
                : 'text-text-disabled hover:bg-subtle hover:text-text-secondary'
            )}
          >
            {style}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={undo}
        disabled={!canUndo()}
        className="btn-ghost btn-icon-sm disabled:opacity-40"
        aria-label="Bekor qilish"
      >
        <Undo2 size={13} />
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={!canRedo()}
        className="btn-ghost btn-icon-sm disabled:opacity-40"
        aria-label="Qaytarish"
      >
        <Redo2 size={13} />
      </button>

      <div className="mx-1 h-5 w-px bg-divide" />

      <ThemeToggle />

      {isDirty && saveStatus === 'idle' && (
        <span className="hidden text-xs text-warning lg:inline">Saqlanmagan</span>
      )}

      {assetMode && (
        <button
          type="button"
          className={cn(
            'btn-ghost btn-icon-sm',
            printPreview && 'border border-accent-border bg-accent-dim text-accent-hover'
          )}
          aria-label="Chop etish ko‘rinishi"
          onClick={() => setPrintPreview(!printPreview)}
        >
          <Eye size={13} />
        </button>
      )}

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={saveStatus === 'saving'}
        className={cn(
          'btn-secondary btn-sm inline-flex items-center gap-1.5',
          saveStatus === 'error' && 'bg-danger hover:bg-danger'
        )}
      >
        {saveStatus === 'saving' && <Loader2 size={12} className="animate-spin" />}
        {saveStatus === 'saved' && <Check size={12} />}
        {saveStatus === 'error' && <X size={12} />}
        {saveStatus === 'idle' && <Save size={12} />}
        Saqlash
      </button>

      <button
        type="button"
        className="btn-ghost btn-sm hidden items-center gap-1.5 text-text-secondary sm:inline-flex"
        aria-label="Print"
      >
        <Printer size={12} />
        Print
      </button>

      <button
        type="button"
        className="btn-ghost btn-sm hidden items-center gap-1.5 text-text-secondary sm:inline-flex"
        aria-label="Yuborish"
      >
        <Share2 size={12} />
        Yuborish
      </button>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="btn-primary btn-sm inline-flex items-center gap-1.5">
            <Download size={12} />
            Eksport
            <ChevronDown size={10} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="z-50 min-w-[200px] rounded border border-divide bg-ink p-1 shadow-lg"
          >
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-subtle hover:text-text-primary"
              onSelect={() => {
                if (!fabricCanvas) return
                void exportToPNG(fabricCanvas, filename, { designId, eventId }).then((ok) => {
                  if (!ok) toast.error('Eksport limiti yoki xatolik')
                })
              }}
            >
              <FileImage size={14} className="text-text-tertiary" />
              PNG yuklab olish
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-subtle hover:text-text-primary"
              onSelect={() => {
                if (!fabricCanvas) return
                void exportToPDF(fabricCanvas, filename, { designId, eventId }).then((ok) => {
                  if (!ok) toast.error('Eksport limiti yoki xatolik')
                })
              }}
            >
              <FileText size={14} className="text-text-tertiary" />
              PDF yuklab olish
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-subtle hover:text-text-primary"
              onSelect={() => {
                if (!fabricCanvas) return
                void copyCanvasPreviewLink(fabricCanvas).then(() => {
                  toast.success('Nusxa olindi')
                })
              }}
            >
              <Link2 size={14} className="text-text-tertiary" />
              Link nusxalash
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
