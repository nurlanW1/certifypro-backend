import { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { cardBase, cardInteractive, sectionDescription, sectionEyebrow, sectionTitle } from "@/lib/ui/styles"

type CardProps = {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: "sm" | "md" | "lg"
}

const paddingMap = { sm: "p-4", md: "p-6", lg: "p-8" }

export function Card({
  title,
  subtitle,
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div className={cn(hover ? cardInteractive : cardBase, paddingMap[padding], className)}>
      {title ? (
        <div className="mb-4">
          <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
}) {
  const alignClass = align === "center" ? "mx-auto text-center" : "text-left"
  return (
    <div className={cn("mb-12 max-w-2xl", alignClass)}>
      {eyebrow ? <p className={cn("mb-3", sectionEyebrow)}>{eyebrow}</p> : null}
      <h2 className={sectionTitle}>{title}</h2>
      {description ? <p className={sectionDescription}>{description}</p> : null}
    </div>
  )
}

/** shadcn-style card primitives for new layouts */
export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 px-6 pt-6", className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("text-base font-semibold leading-none text-foreground", className)} {...props} />
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-6 pb-6", className)} {...props} />
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center border-t border-border px-6 py-4", className)} {...props} />
}
