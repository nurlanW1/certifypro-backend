import * as React from "react"

import { cn } from "@/lib/utils"
import { controlBase } from "@/lib/ui/styles"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          controlBase,
          "field-sizing-content min-h-24 resize-y px-3.5 py-2.5",
          className
        )}
        {...props}
      />
    )
  }
)

export { Textarea }
