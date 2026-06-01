import { Crown } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-muted text-muted-foreground",
        premium:
          "border-amber-300/90 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 shadow-sm [&_svg]:fill-amber-500 [&_svg]:text-amber-600",
        free: "border-emerald-300/90 bg-emerald-50 text-emerald-800 [&_svg]:fill-emerald-500/90 [&_svg]:text-emerald-600",
        print: "border-blue-200 bg-blue-50 text-blue-700",
        online: "border-violet-200 bg-violet-50 text-violet-700",
        new: "border-amber-200 bg-amber-50 text-amber-700",
        outline: "border-border bg-background text-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

function TierCrown({ variant }: { variant: "premium" | "free" }) {
  return (
    <Crown
      className={cn(
        "size-3 shrink-0",
        variant === "premium" ? "text-amber-500" : "text-emerald-500"
      )}
      strokeWidth={2.25}
      aria-hidden
    />
  )
}

function showTierCrown(variant: BadgeVariant, icon?: boolean): variant is "premium" | "free" {
  if (icon === false) return false
  return variant === "premium" || variant === "free"
}

/** Legacy API: `text` prop */
export function Badge({
  text,
  variant = "default",
  icon,
}: {
  text: string
  variant?: BadgeVariant
  /** Crown for Premium (yellow) / Free (green). Default on for those variants only. */
  icon?: boolean
}) {
  return (
    <span className={cn(badgeVariants({ variant }))}>
      {showTierCrown(variant, icon) ? <TierCrown variant={variant} /> : null}
      {text}
    </span>
  )
}

/** shadcn-style API */
export function BadgeChip({
  children,
  variant = "default",
  className,
  icon,
}: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  icon?: boolean
}) {
  const tier =
    showTierCrown(variant, icon) && (variant === "premium" || variant === "free")
      ? variant
      : null
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {tier ? <TierCrown variant={tier} /> : null}
      {children}
    </span>
  )
}

export { badgeVariants }
