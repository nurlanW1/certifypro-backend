import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageFrameProps = {
  children: ReactNode
  className?: string
  /** default | narrow | full */
  width?: "default" | "narrow" | "full"
}

const widthClass = {
  default: "gildia-container",
  narrow: "gildia-container max-w-3xl",
  full: "w-full max-w-none px-0",
}

/** Unified page content width — matches marketing and dashboard padding */
export function PageFrame({ children, className, width = "default" }: PageFrameProps) {
  return <div className={cn(widthClass[width], "py-8 md:py-10", className)}>{children}</div>
}

export function SectionCard({
  children,
  className,
  title,
  description,
}: {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6",
        className
      )}
    >
      {title ? (
        <header className="mb-4 border-b border-border pb-4">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}
