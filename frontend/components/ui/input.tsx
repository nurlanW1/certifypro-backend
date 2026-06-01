import { forwardRef, InputHTMLAttributes } from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { controlBase } from "@/lib/ui/styles"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        data-slot="input"
        className={cn(controlBase, "px-3.5 py-2.5", className)}
        {...props}
      />
    )
  }
)

export function SearchInput({
  placeholder = "Qidirish...",
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-10" placeholder={placeholder} type="search" {...props} />
    </div>
  )
}
