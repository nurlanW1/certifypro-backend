import { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageContainerProps = {
  children: ReactNode
  className?: string
  /** default | narrow | wide | full */
  size?: "default" | "narrow" | "wide" | "full"
}

const sizeMap = {
  default: "",
  narrow: "max-w-3xl",
  wide: "max-w-[1400px]",
  full: "max-w-none !px-0",
}

export function PageContainer({
  children,
  className,
  size = "default",
}: PageContainerProps) {
  return (
    <div className={cn("gildia-container py-8 md:py-10", sizeMap[size], className)}>
      {children}
    </div>
  )
}
