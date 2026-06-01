"use client"

import { Plus, Trash2 } from "lucide-react"

import { AssetUploadField } from "@/components/uploads/asset-upload-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CatalogField, CategoryFormData } from "@/lib/event-create/types"
import type { MaterialFormField } from "@/lib/event-create/material-form-schema"
import { uploadKindForFieldKey } from "@/lib/uploads/field-kind"
import { cn } from "@/lib/utils"

type Props = {
  fields: MaterialFormField[]
  values: CategoryFormData
  onChange: (key: string, value: string | Record<string, string>[]) => void
}

export function MaterialFormFields({ fields, values, onChange }: Props) {
  const visibleFields = fields.filter((field) => isFieldVisible(field, values))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visibleFields.map((field) => (
        <div
          key={field.key}
          className={cn(field.colSpan === 2 && "sm:col-span-2")}
        >
          {renderField(field, values, onChange)}
        </div>
      ))}
    </div>
  )
}

function isFieldVisible(field: CatalogField, values: CategoryFormData): boolean {
  if (!field.showWhen) return true
  return String(values[field.showWhen.key] ?? "") === field.showWhen.value
}

function renderField(
  field: MaterialFormField,
  values: CategoryFormData,
  onChange: (key: string, value: string | Record<string, string>[]) => void
) {
  const val = values[field.key]
  const label = (
    <Label className="text-xs font-semibold text-muted-foreground">
      {field.label}
      {field.required ? " *" : ""}
    </Label>
  )

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        {label}
        <Textarea
          rows={3}
          placeholder={field.placeholder}
          value={(val as string) || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
        {field.hint ? <Hint text={field.hint} /> : null}
      </div>
    )
  }

  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        {label}
        <select
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm"
          value={(val as string) || field.options?.[0] || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {field.hint ? <Hint text={field.hint} /> : null}
      </div>
    )
  }

  if (field.type === "file" || field.type === "excel") {
    const kind = uploadKindForFieldKey(field.key, field.type)
    return (
      <div className="space-y-1.5">
        {label}
        <AssetUploadField
          kind={kind}
          variant={field.type === "excel" ? "excel" : "default"}
          value={(val as string) || ""}
          onChange={(serialized) => onChange(field.key, serialized)}
          onSessionsParsed={
            field.type === "excel"
              ? (rows) => onChange("sessions", rows)
              : undefined
          }
          hint={field.hint}
        />
      </div>
    )
  }

  if (field.type === "repeater") {
    const rows = (val as Record<string, string>[]) || [{}]
    return (
      <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
        {label}
        <div className="space-y-3">
          {rows.map((row, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Qator {idx + 1}
                </span>
                {rows.length > 1 ? (
                  <button
                    type="button"
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                    onClick={() => onChange(field.key, rows.filter((_, i) => i !== idx))}
                    aria-label="Qatorni o‘chirish"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {field.repeaterFields?.map((rf) => (
                  <RepeaterSubField
                    key={rf.key}
                    field={rf}
                    value={row[rf.key] || ""}
                    onChange={(v) => {
                      const next = [...rows]
                      next[idx] = { ...next[idx], [rf.key]: v }
                      onChange(field.key, next)
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => onChange(field.key, [...rows, {}])}
        >
          <Plus className="size-3.5" />
          Qator qo‘shish
        </Button>
      </div>
    )
  }

  const inputType =
    field.type === "date"
      ? "date"
      : field.type === "time"
        ? "time"
        : field.type === "color"
          ? "color"
          : field.type === "url"
            ? "url"
            : "text"

  return (
    <div className="space-y-1.5">
      {label}
      <Input
        type={inputType}
        placeholder={field.placeholder}
        value={(val as string) || ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={field.type === "color" ? "h-10 w-full" : undefined}
      />
      {field.hint ? <Hint text={field.hint} /> : null}
    </div>
  )
}

function RepeaterSubField({
  field,
  value,
  onChange,
}: {
  field: CatalogField
  value: string
  onChange: (value: string) => void
}) {
  if (field.type === "textarea") {
    return (
      <div className="sm:col-span-2 space-y-1">
        <span className="text-[10px] font-medium text-muted-foreground">{field.label}</span>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
          rows={2}
          placeholder={field.label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <span className="text-[10px] font-medium text-muted-foreground">{field.label}</span>
      <input
        className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
        type={field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
        placeholder={field.label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function Hint({ text }: { text: string }) {
  return <p className="text-[10px] text-muted-foreground">{text}</p>
}
