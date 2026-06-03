"use client"

import { useCallback, useRef, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { parseFormAsset } from "@/lib/uploads/serialize"
import { processFileUploadSerialized } from "@/lib/uploads/process-upload"
import type { UploadKind } from "@/lib/uploads/types"
import { acceptForKind } from "@/lib/uploads/validation"
import { cn } from "@/lib/utils"

type Props = {
  kind: UploadKind
  value: string
  onChange: (serialized: string) => void
  onSessionsParsed?: (rows: Record<string, string>[]) => void
  label?: string
  hint?: string
  disabled?: boolean
  className?: string
  variant?: "default" | "excel"
}

export function AssetUploadField({
  kind,
  value,
  onChange,
  onSessionsParsed,
  hint,
  disabled = false,
  className,
  variant = "default",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const asset = parseFormAsset(value)
  const isExcel = kind === "excel" || variant === "excel"
  const accept = acceptForKind(kind)

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || disabled) return
      setError(null)
      setLoading(true)
      try {
        const { serialized, sessions } = await processFileUploadSerialized(file, kind)
        onChange(serialized)
        if (sessions?.length && onSessionsParsed) {
          onSessionsParsed(sessions)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Yuklash muvaffaqiyatsiz")
      } finally {
        setLoading(false)
      }
    },
    [disabled, kind, onChange, onSessionsParsed]
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    void handleFile(e.dataTransfer.files?.[0])
  }

  const remove = () => {
    onChange("")
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  if (asset?.dataUrl && !isExcel) {
    return (
      <div className={cn("space-y-2", className)}>
        <PreviewCard
          asset={asset}
          loading={loading}
          onReplace={() => inputRef.current?.click()}
          onRemove={remove}
          disabled={disabled}
        />
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          disabled={disabled || loading}
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        {error ? <ErrorBanner message={error} /> : null}
      </div>
    )
  }

  if (asset && isExcel) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
          <FileSpreadsheet className="size-8 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{asset.name}</p>
            <p className="text-xs text-muted-foreground">
              {(asset.size / 1024).toFixed(0)} KB · Excel yuklandi
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled || loading}
              onClick={() => inputRef.current?.click()}
              title="Almashtirish"
            >
              <RefreshCw className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              disabled={disabled || loading}
              onClick={remove}
              title="O‘chirish"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          disabled={disabled || loading}
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        {error ? <ErrorBanner message={error} /> : null}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={() => !disabled && !loading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all",
          isExcel ? "border-emerald-300/70 bg-emerald-50/40" : "border-border bg-muted/20",
          dragging && "border-primary bg-primary/5",
          !disabled && "cursor-pointer hover:border-primary/40 hover:bg-primary/5",
          disabled && "pointer-events-none opacity-50",
          loading && "pointer-events-none"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          disabled={disabled || loading}
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        {loading ? (
          <Loader2 className="size-8 animate-spin text-primary" />
        ) : isExcel ? (
          <FileSpreadsheet className="size-8 text-emerald-600" />
        ) : (
          <Upload className="size-8 text-muted-foreground" />
        )}
        <p className="mt-3 text-sm font-medium text-foreground">
          {loading ? "Yuklanmoqda…" : "Faylni shu yerga tashlang"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">yoki tanlash uchun bosing</p>
        {hint ? <p className="mt-2 text-[10px] text-muted-foreground">{hint}</p> : null}
      </div>
      {error ? <ErrorBanner message={error} /> : null}
      {asset && !asset.dataUrl ? (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          {asset.name}
        </p>
      ) : null}
    </div>
  )
}

function PreviewCard({
  asset,
  loading,
  onReplace,
  onRemove,
  disabled,
}: {
  asset: NonNullable<ReturnType<typeof parseFormAsset>>
  loading: boolean
  onReplace: () => void
  onRemove: () => void
  disabled: boolean
}) {
  const isImage = asset.mimeType.startsWith("image/")

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative flex min-h-[120px] items-center justify-center bg-muted/30 p-4">
        {isImage && asset.dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.dataUrl}
            alt={asset.name}
            className="max-h-28 max-w-full rounded-lg object-contain"
          />
        ) : (
          <ImagePlus className="size-10 text-muted-foreground" />
        )}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{asset.name}</p>
        <span className="text-[10px] text-muted-foreground">
          {(asset.size / 1024).toFixed(0)} KB
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled || loading}
          onClick={onReplace}
          title="Almashtirish"
        >
          <RefreshCw className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          disabled={disabled || loading}
          onClick={onRemove}
          title="O‘chirish"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
