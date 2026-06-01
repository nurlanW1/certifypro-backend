"use client"

import { DragEvent, InputHTMLAttributes, ReactNode, useRef, useState } from "react"
import { CloudUpload, FileUp } from "lucide-react"

import { cn } from "@/lib/utils"

type UploadAreaProps = {
  title?: string
  description?: string
  hint?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
  icon?: ReactNode
  onFiles?: (files: FileList) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "className">

export function UploadArea({
  title = "Faylni shu yerga tashlang",
  description = "yoki kompyuterdan tanlang",
  hint,
  accept,
  multiple = false,
  disabled = false,
  className,
  icon,
  onFiles,
  ...inputProps
}: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files?.length || disabled) return
    onFiles?.(files)
    if (inputRef.current) inputRef.current.value = ""
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) inputRef.current?.click()
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all outline-none",
        "border-border bg-muted/20 hover:border-primary/40 hover:bg-primary/5",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
        dragging && "border-primary bg-primary/5",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files)
        }}
        onClick={(e) => e.stopPropagation()}
        {...inputProps}
      />
      <div
        className={cn(
          "mb-4 flex size-12 items-center justify-center rounded-2xl bg-background text-primary shadow-sm ring-1 ring-border transition-transform",
          !disabled && "group-hover:scale-105"
        )}
      >
        {icon ?? (dragging ? <FileUp className="size-5" /> : <CloudUpload className="size-5" />)}
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {hint ? <p className="mt-3 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
