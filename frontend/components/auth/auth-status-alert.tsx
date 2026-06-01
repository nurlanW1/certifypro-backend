"use client"

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

type Props = {
  variant: "error" | "success" | "loading"
  title?: string
  message: string
  className?: string
}

export function AuthStatusAlert({ variant, title, message, className }: Props) {
  const Icon =
    variant === "success" ? CheckCircle2 : variant === "loading" ? Loader2 : AlertCircle

  return (
    <Alert
      variant={variant === "error" ? "destructive" : "default"}
      className={cn(
        "mb-6",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
        variant === "loading" && "border-border bg-muted/50",
        className
      )}
    >
      <Icon
        className={cn(
          variant === "loading" && "animate-spin",
          variant === "success" && "text-emerald-600"
        )}
      />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription
        className={cn(variant === "success" && "text-emerald-800", variant === "error" && "")}
      >
        {message}
      </AlertDescription>
    </Alert>
  )
}
