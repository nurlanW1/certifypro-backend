"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function ToolSection({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("space-y-2", className)}>
      {title ? (
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">{title}</p>
      ) : null}
      {children}
    </section>
  )
}

const toolCardClass =
  "flex w-full items-start gap-2.5 rounded-lg border border-[#e8ebf0] bg-white px-3 py-2.5 text-left transition hover:border-[#c7d2fe] hover:bg-[#f5f7ff]"

export function ToolCardButton({
  title,
  description,
  icon,
  onClick,
  className,
  fileInputId,
}: {
  title: string
  description?: string
  icon?: ReactNode
  onClick?: () => void
  className?: string
  /** Reliable native file picker via <label htmlFor> */
  fileInputId?: string
}) {
  const content = (
    <>
      {icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#f1f3f6] text-[#64748b]">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-[#0f172a]">{title}</span>
        {description ? (
          <span className="mt-0.5 block text-[10px] leading-snug text-[#94a3b8]">{description}</span>
        ) : null}
      </span>
    </>
  )

  if (fileInputId) {
    return (
      <label htmlFor={fileInputId} className={cn(toolCardClass, "cursor-pointer", className)}>
        {content}
      </label>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cn(toolCardClass, className)}>
      {content}
    </button>
  )
}

export function ToolHint({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-[#e8ebf0] bg-[#fafbfc] px-2.5 py-2 text-[10px] leading-relaxed text-[#64748b]">
      {children}
    </p>
  )
}
