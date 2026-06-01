import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        brand:
          "bg-[image:var(--gradient-accent)] text-white shadow-[var(--shadow-glow)] hover:brightness-105",
        outline:
          "border-border bg-background shadow-sm hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-3.5 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

type LinkButtonProps = {
  href: string
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "outline" | "ghost" | "brand"
  size?: "sm" | "md" | "lg"
}

const linkVariantMap = {
  primary: "default" as const,
  brand: "brand" as const,
  secondary: "secondary" as const,
  outline: "outline" as const,
  ghost: "ghost" as const,
}

const linkSizeMap = {
  sm: "sm" as const,
  md: "default" as const,
  lg: "lg" as const,
}

export function LinkButton({
  href,
  children,
  className = "",
  variant = "primary",
  size = "md",
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: linkVariantMap[variant], size: linkSizeMap[size] }),
        className
      )}
    >
      {children}
    </Link>
  )
}

export { Button, buttonVariants }
