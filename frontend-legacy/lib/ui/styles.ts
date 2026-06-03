import { cn } from "@/lib/utils"

/** Shared control styles for Input, Textarea, Select trigger overrides */
export const controlBase = cn(
  "w-full rounded-xl border border-border bg-background text-sm text-foreground shadow-sm transition-all",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20"
)

export const cardBase = cn(
  "rounded-2xl border border-border bg-card text-card-foreground shadow-[var(--shadow-premium)]"
)

export const cardInteractive = cn(
  cardBase,
  "transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-premium)]",
  "hover:-translate-y-0.5 hover:border-border/80 hover:shadow-[var(--shadow-premium-lg)]"
)

export const sectionEyebrow = "text-xs font-semibold uppercase tracking-[0.18em] text-primary"

export const sectionTitle = "text-3xl font-bold tracking-tight text-foreground md:text-4xl"

export const sectionDescription = "mt-4 text-lg leading-relaxed text-muted-foreground"
