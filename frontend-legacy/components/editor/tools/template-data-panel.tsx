"use client"

import { FileText } from "lucide-react"

import { ProductFormFields } from "@/components/templates/product-form-fields"
import {
  getFieldsForProduct,
  getFieldKeysForProduct,
} from "@/lib/templates/product-form-schema"
import type { CatalogProduct } from "@/lib/templates/types"

import { ToolHint, ToolSection } from "./tool-panel-primitives"

type Props = {
  product: CatalogProduct | null
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  templateLabel?: string
}

export function TemplateDataPanel({ product, values, onChange, templateLabel }: Props) {
  if (!product) {
    return (
      <div className="space-y-3">
        <ToolHint>
          Shablon tanlanmagan. Katalogdan mahsulot oching — maydonlar shu yerda paydo bo‘ladi va
          kanvasda jonli yangilanadi.
        </ToolHint>
      </div>
    )
  }

  const fields = getFieldsForProduct(product)
  const fieldCount = getFieldKeysForProduct(product).length

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#e0e7ff] bg-gradient-to-br from-[#f8faff] to-white p-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
            <FileText className="size-4 stroke-[1.75]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#0f172a]">{templateLabel ?? product.title}</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-[#64748b]">
              {fieldCount} ta maydon — kiritilgan ma’lumotlar kanvasda darhol ko‘rinadi.
            </p>
          </div>
        </div>
      </div>

      <ToolSection title="Shablon ma’lumotlari">
        <ProductFormFields fields={fields} values={values} onChange={onChange} />
      </ToolSection>

      <ToolHint>
        Elementlarni surish, kattalashtirish va aylantirish uchun <strong>Qo‘l</strong> yoki kanvasdagi
        tutqichlardan foydalaning. Qatlamlar — <strong>Qatlam</strong> panelida.
      </ToolHint>
    </div>
  )
}
