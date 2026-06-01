"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FormFieldDefinition } from "@/lib/templates/product-form-schema"

type Props = {
  fields: FormFieldDefinition[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

export function ProductFormFields({ fields, values, onChange }: Props) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label htmlFor={field.key} className="text-xs font-semibold text-muted-foreground">
            {field.label}
          </Label>
          {renderControl(field, values[field.key] ?? "", (v) => onChange(field.key, v))}
          {field.hint ? <p className="text-[10px] text-muted-foreground">{field.hint}</p> : null}
        </div>
      ))}
    </div>
  )
}

function renderControl(
  field: FormFieldDefinition,
  value: string,
  onChange: (value: string) => void
) {
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={field.key}
          rows={2}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case "date":
      return (
        <Input
          id={field.key}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case "url":
      return (
        <Input
          id={field.key}
          type="url"
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case "color":
      return (
        <div className="flex gap-2">
          <Input
            id={field.key}
            type="color"
            value={value || "#2563eb"}
            className="h-10 w-14 shrink-0 cursor-pointer p-1"
            onChange={(e) => onChange(e.target.value)}
          />
          <Input
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )
    case "select":
      return (
        <Select
          value={value || field.options?.[0]?.value}
          onValueChange={(val) => onChange(val ?? "")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tanlang" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    default:
      return (
        <Input
          id={field.key}
          type="text"
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
}
