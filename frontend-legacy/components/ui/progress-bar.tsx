"use client"

import {
  Progress,
  ProgressLabel,
  ProgressTrack,
  ProgressIndicator,
  ProgressValue,
} from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type ProgressBarProps = {
  value?: number
  label?: string
  showValue?: boolean
  className?: string
}

/** Simplified progress bar — `value` 0–100 */
export function ProgressBar({
  value = 0,
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  return (
    <Progress value={value} className={cn("w-full gap-2", className)}>
      {label ? <ProgressLabel>{label}</ProgressLabel> : null}
      {showValue ? <ProgressValue /> : null}
      <ProgressTrack className="w-full min-w-0 flex-1">
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  )
}
