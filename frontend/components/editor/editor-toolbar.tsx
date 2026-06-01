"use client"

import {
  ArrowLeft,
  Copy,
  Download,
  FilePen,
  Redo2,
  Save,
  Trash2,
  Undo2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { editorChrome } from "@/lib/editor/editor-chrome"
import { cn } from "@/lib/utils"

type Props = {
  productName: string
  formatLabel?: string
  formatShortLabel?: string
  backLabel?: string
  onProductNameChange: (name: string) => void
  onBack: () => void
  onSave: () => void
  onSaveDraft: () => void
  onDuplicate: () => void
  onDeleteSelected?: () => void
  onUndo: () => void
  onRedo: () => void
  onExport: () => void
  canUndo?: boolean
  canRedo?: boolean
  lastSavedAt?: string | null
  isSaving?: boolean
  isDuplicating?: boolean
}

export function EditorToolbar({
  productName,
  formatLabel,
  formatShortLabel,
  backLabel = "Orqaga",
  onProductNameChange,
  onBack,
  onSave,
  onSaveDraft,
  onDuplicate,
  onDeleteSelected,
  onUndo,
  onRedo,
  onExport,
  canUndo = false,
  canRedo = false,
  lastSavedAt = null,
  isSaving = false,
  isDuplicating = false,
}: Props) {
  const savedLabel = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
    : null

  return (
    <header className={editorChrome.toolbar}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 shrink-0 gap-1.5 px-2.5 text-[#475569] hover:bg-[#f4f5f7] hover:text-[#0f172a]"
        onClick={onBack}
        title={backLabel}
      >
        <ArrowLeft className="size-4 stroke-[1.75]" />
        <span className="hidden sm:inline">Orqaga</span>
      </Button>

      <Separator orientation="vertical" className="hidden h-5 bg-[#e2e5ea] sm:block" />

      <div className={editorChrome.toolbarGroup}>
        <Button
          variant="ghost"
          size="icon-sm"
          className={editorChrome.iconBtn}
          onClick={onUndo}
          disabled={!canUndo}
          title="Bekor qilish (⌘Z)"
        >
          <Undo2 className="size-4 stroke-[1.75]" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className={editorChrome.iconBtn}
          onClick={onRedo}
          disabled={!canRedo}
          title="Qayta (⌘⇧Z)"
        >
          <Redo2 className="size-4 stroke-[1.75]" />
        </Button>
      </div>

      <Separator orientation="vertical" className="hidden h-5 bg-[#e2e5ea] md:block" />

      <div className={cn(editorChrome.toolbarGroup, "hidden md:flex")}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-[13px] font-medium text-[#334155] hover:bg-white hover:text-[#0f172a]"
          onClick={onSave}
          disabled={isSaving}
          title="Saqlash (⌘S)"
        >
          <Save className="size-3.5 stroke-[1.75]" />
          Saqlash
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-[13px] font-medium text-[#334155] hover:bg-white hover:text-[#0f172a]"
          onClick={onSaveDraft}
          disabled={isSaving}
          title="Qoralama"
        >
          <FilePen className="size-3.5 stroke-[1.75]" />
          Qoralama
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-[13px] font-medium text-[#334155] hover:bg-white hover:text-[#0f172a]"
          onClick={onDuplicate}
          disabled={isDuplicating}
          title="Nusxa"
        >
          <Copy className="size-3.5 stroke-[1.75]" />
          Nusxa
        </Button>
        {onDeleteSelected ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onDeleteSelected}
            title="O‘chirish (Del)"
          >
            <Trash2 className="size-3.5 stroke-[1.75]" />
            O‘chirish
          </Button>
        ) : null}
      </div>

      <div className="mx-1 hidden min-w-0 flex-1 lg:block">
        <div className="flex max-w-xl items-center gap-2">
          <Input
            value={productName}
            onChange={(e) => onProductNameChange(e.target.value)}
            className={cn(editorChrome.input, "h-8 min-w-0 flex-1 font-medium tracking-tight")}
            placeholder="Dizayn nomi"
          />
          {formatShortLabel || formatLabel ? (
            <span className={cn(editorChrome.badge, "hidden xl:inline-flex")} title={formatLabel}>
              {formatShortLabel ?? formatLabel}
            </span>
          ) : null}
        </div>
      </div>

      {formatShortLabel ? (
        <span className={cn(editorChrome.badge, "hidden sm:inline-flex lg:hidden")} title={formatLabel}>
          {formatShortLabel}
        </span>
      ) : null}

      <span className="hidden shrink-0 text-[11px] tabular-nums text-[#94a3b8] xl:inline">
        {isSaving ? "Saqlanmoqda…" : savedLabel ? `Saqlandi · ${savedLabel}` : "Tayyor"}
      </span>

      <div className="flex-1 sm:hidden" />

      <div className={cn(editorChrome.toolbarGroup, "md:hidden")}>
        <Button variant="ghost" size="icon-sm" className={editorChrome.iconBtn} onClick={onSave} disabled={isSaving} title="Saqlash">
          <Save className="size-4 stroke-[1.75]" />
        </Button>
        <Button variant="ghost" size="icon-sm" className={editorChrome.iconBtn} onClick={onSaveDraft} disabled={isSaving} title="Qoralama">
          <FilePen className="size-4 stroke-[1.75]" />
        </Button>
        <Button variant="ghost" size="icon-sm" className={editorChrome.iconBtn} onClick={onDuplicate} disabled={isDuplicating} title="Nusxa">
          <Copy className="size-4 stroke-[1.75]" />
        </Button>
      </div>

      <Button
        size="sm"
        className="h-8 gap-1.5 bg-[#4f46e5] px-3.5 text-white shadow-sm hover:bg-[#4338ca]"
        onClick={onExport}
      >
        <Download className="size-3.5 stroke-[1.75]" />
        <span className="hidden sm:inline">Export</span>
      </Button>
    </header>
  )
}
