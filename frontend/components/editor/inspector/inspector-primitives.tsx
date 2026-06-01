"use client"

import type { ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export const inspectorInput =
  "h-8 border-[#e2e5ea] bg-white text-sm shadow-none focus-visible:border-[#2563eb] focus-visible:ring-[#2563eb]/20"

export const inspectorTextarea =
  "min-h-[72px] w-full resize-y rounded-md border border-[#e2e5ea] bg-white px-2.5 py-2 text-sm text-[#0f172a] shadow-none focus-visible:border-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/20"

export function InspectorSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">{title}</p>
      {children}
    </section>
  )
}

export function InspectorField({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-[11px] font-medium text-[#64748b]">{label}</Label>
      {children}
      {hint ? <p className="text-[10px] text-[#94a3b8]">{hint}</p> : null}
    </div>
  )
}

export function InspectorDivider() {
  return <Separator className="bg-[#e8ebf0]" />
}

export function NumField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}) {
  return (
    <InspectorField label={label}>
      <div className="relative">
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={cn(inspectorInput, suffix && "pr-7")}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#94a3b8]">
            {suffix}
          </span>
        ) : null}
      </div>
    </InspectorField>
  )
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const safe = value.startsWith("#") ? value : "#000000"
  return (
    <InspectorField label={label}>
      <div className="flex gap-2">
        <Input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-11 shrink-0 cursor-pointer border-[#e2e5ea] bg-white p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inspectorInput, "flex-1 font-mono text-xs")}
        />
      </div>
    </InspectorField>
  )
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  format?: (v: number) => string
}) {
  return (
    <InspectorField label={label}>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 min-w-0 flex-1 accent-[#2563eb]"
        />
        <span className="w-10 shrink-0 text-right text-[11px] font-medium tabular-nums text-[#64748b]">
          {format ? format(value) : value}
        </span>
      </div>
    </InspectorField>
  )
}
