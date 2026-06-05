'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
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
import { exportCanvasSVG } from '@/lib/editor/canvas-export'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface EditorTopBarProps {
  designId: string
}

export function EditorTopBar({ designId }: EditorTopBarProps) {
  const t = useTranslations('workspace')
  const tc = useTranslations('common')
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
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
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{t('back')}</span>
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
          className="max-w-[140px] truncate border-b border-transparent bg-transparent px-1 py-0.5 text-sm font-medium text-text-primary transition-colors hover:border-divide focus:border-accent md:max-w-xs"
        >
          {designName}
        </button>
      )}

      <div className="mx-1 hidden h-5 w-px bg-divide sm:block" />

      <div className="hidden items-center gap-1 sm:flex">
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
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        {isDirty && saveStatus === 'idle' && (
          <span className="hidden text-xs text-warning md:inline">{t('unsaved')}</span>
        )}

        {assetMode && (
          <button
            type="button"
            className={cn(
              'hidden rounded-lg p-2 md:inline-flex',
              printPreview
                ? 'bg-accent-dim text-accent-hover'
                : 'text-text-tertiary hover:bg-subtle'
            )}
            aria-label="Chop etish ko‘rinishi"
            onClick={() => setPrintPreview(!printPreview)}
          >
            <Eye className="h-4 w-4" />
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
          {saveStatus === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
          {saveStatus === 'saved' && <Check className="h-4 w-4" />}
          {saveStatus === 'error' && <X className="h-4 w-4" />}
          {saveStatus === 'idle' && <Save className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {saveStatus === 'saving'
              ? t('saving')
              : saveStatus === 'saved'
                ? t('saved')
                : saveStatus === 'error'
                  ? tc('error')
                  : t('save')}
          </span>
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type="button" className="btn-primary btn-sm inline-flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t('export')}</span>
              <ChevronDown className="h-3 w-3" />
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
                  void exportToPNG(fabricCanvas, filename, {
                    designId,
                    eventId,
                  }).then((ok) => {
                    if (!ok) toast.error('Eksport limiti yoki xatolik')
                  })
                }}
              >
                <FileImage className="h-4 w-4 text-text-muted" />
                {t('downloadPNG')}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-subtle hover:text-text-primary"
                onSelect={() => {
                  if (!fabricCanvas) return
                  void exportToPDF(fabricCanvas, filename, {
                    designId,
                    eventId,
                  }).then((ok) => {
                    if (!ok) toast.error('Eksport limiti yoki xatolik')
                  })
                }}
              >
                <FileText className="h-4 w-4 text-text-muted" />
                {t('downloadPDF')}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-subtle hover:text-text-primary"
                onSelect={() => {
                  if (!fabricCanvas) return
                  exportCanvasSVG(fabricCanvas, filename)
                }}
              >
                <FileText className="h-4 w-4 text-text-muted" />
                {t('downloadSVG')}
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
