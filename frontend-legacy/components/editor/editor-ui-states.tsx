"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { Keyboard, Loader2, Monitor, MousePointer2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  EDITOR_SHORTCUTS,
  SHORTCUT_CATEGORY_LABEL,
  type EditorShortcut,
} from "@/lib/editor/keyboard-shortcuts"
import { cn } from "@/lib/utils"

export function EditorLoadingState({ label = "Dizayn studiyasi yuklanmoqda…" }: { label?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[linear-gradient(165deg,#e8ebf0_0%,#dfe3e9_100%)]">
      <div className="relative">
        <div className="size-14 rounded-2xl bg-white shadow-[0_8px_32px_rgba(15,23,42,0.1)] ring-1 ring-[#e2e5ea]" />
        <Loader2 className="absolute inset-0 m-auto size-6 animate-spin text-[#6366f1]" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium tracking-tight text-[#334155]">{label}</p>
        <p className="mt-1 text-xs text-[#94a3b8]">Qatlamlar va maket tayyorlanmoqda</p>
      </div>
    </div>
  )
}

function subscribeMobileQuery(onChange: () => void) {
  const mq = window.matchMedia("(max-width: 767px)")
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches
}

function getMobileServerSnapshot() {
  return false
}

export function EditorMobileGate({ children }: { children: React.ReactNode }) {
  const isMobile = useSyncExternalStore(
    subscribeMobileQuery,
    getMobileSnapshot,
    getMobileServerSnapshot
  )
  const [dismissed, setDismissed] = useState(false)

  if (!isMobile || dismissed) return <>{children}</>

  return (
    <>
      {children}
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0f172a]/55 p-4 backdrop-blur-sm sm:items-center"
        role="dialog"
        aria-labelledby="editor-mobile-title"
      >
        <div className="w-full max-w-md rounded-2xl border border-[#e2e5ea] bg-white p-6 shadow-2xl">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#eef2ff] text-[#4f46e5]">
            <Monitor className="size-6 stroke-[1.5]" />
          </div>
          <h2 id="editor-mobile-title" className="mt-4 text-lg font-semibold tracking-tight text-[#0f172a]">
            Keng ekran tavsiya etiladi
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
            Dizayn studiyasi planshet yoki kompyuterda eng qulay ishlaydi. Mobil qurilmada ba&apos;zi
            asboblar cheklangan bo&apos;lishi mumkin.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1 shadow-sm" onClick={() => setDismissed(true)}>
              Davom etish
            </Button>
            <Link
              href="/templates"
              className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-[#e2e5ea] bg-white px-3 text-sm font-medium text-[#334155] transition-colors hover:bg-[#f8f9fb]"
            >
              Shablonlarga
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export function EditorCanvasEmptyHint() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center p-6"
      aria-hidden
    >
      <div className="max-w-[220px] rounded-xl border border-dashed border-[#c7d2fe]/80 bg-white/90 px-4 py-5 text-center shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-[#eef2ff] text-[#6366f1]">
          <Sparkles className="size-5 stroke-[1.75]" />
        </div>
        <p className="mt-3 text-xs font-semibold text-[#334155]">Bo‘sh maket</p>
        <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">
          Chap paneldan matn, rasm yoki shablon qo‘shing
        </p>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#94a3b8]">
          <MousePointer2 className="size-3.5" />
          <span>Element tanlang yoki qo‘shing</span>
        </div>
      </div>
    </div>
  )
}

type ShortcutsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditorShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  const categories = ["canvas", "edit", "layers"] as const

  return (
    <Modal open={open} onClose={() => onOpenChange(false)} title="Klaviatura yorliqlari" size="md">
      <p className="text-sm text-muted-foreground">
        Tezkor tugmalar — professional dizayn muhitida ishlash uchun.
      </p>
      <div className="mt-4 space-y-4">
        {categories.map((cat) => (
          <section key={cat}>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">
              {SHORTCUT_CATEGORY_LABEL[cat]}
            </h3>
            <ul className="space-y-1">
              {EDITOR_SHORTCUTS.filter((s) => s.category === cat).map((shortcut) => (
                <ShortcutRow key={shortcut.keys + shortcut.label} shortcut={shortcut} />
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Button className="mt-4 w-full" size="sm" variant="outline" onClick={() => onOpenChange(false)}>
        Yopish
      </Button>
    </Modal>
  )
}

function ShortcutRow({ shortcut }: { shortcut: EditorShortcut }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-[#f8f9fb]">
      <span className="text-xs text-[#475569]">{shortcut.label}</span>
      <kbd
        className={cn(
          "shrink-0 rounded-md border border-[#e2e5ea] bg-[#f4f5f7] px-2 py-0.5",
          "font-mono text-[10px] font-medium text-[#334155]"
        )}
      >
        {shortcut.keys}
      </kbd>
    </li>
  )
}

export function EditorShortcutsTrigger({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-[#e8ebf0] bg-[#fafbfc] px-2 py-1",
        "text-[10px] font-medium text-[#64748b] transition-colors hover:border-[#c7d2fe] hover:bg-white hover:text-[#4338ca]",
        className
      )}
      title="Klaviatura yorliqlari"
    >
      <Keyboard className="size-3.5 stroke-[1.75]" />
      <span className="hidden sm:inline">Tugmalar</span>
    </button>
  )
}
