"use client"

import { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
}

/** Legacy controlled modal API — powered by shadcn Dialog */
export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton
        className={cn(
          "gap-0 rounded-2xl border-border p-0 shadow-[var(--shadow-premium-lg)] sm:max-w-[calc(100%-2rem)]",
          sizes[size]
        )}
      >
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
