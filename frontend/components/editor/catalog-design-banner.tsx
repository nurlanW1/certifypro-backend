"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

import { getProductById } from "@/lib/templates/product-catalog"
import { loadProductDraft } from "@/lib/templates/product-draft-storage"

export function CatalogDesignBanner() {
  const params = useSearchParams()
  const from = params.get("from")
  const templateId = params.get("template")
  const title = useMemo(() => {
    if (from !== "catalog" || !templateId) return null
    const product = getProductById(templateId)
    const draft = loadProductDraft(templateId)
    return draft?.meta.productTitle ?? product?.title ?? "Mahsulot"
  }, [from, templateId])

  if (from !== "catalog" || !templateId || !title) return null

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-primary/30 bg-primary/10 px-4 py-2">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-primary">Dizayn yaratish</p>
        <p className="truncate text-sm text-foreground">
          {title ?? "Mahsulot"} — draft saqlangan, export uchun tayyorlang
        </p>
      </div>
      <Link
        href="/templates"
        className="shrink-0 rounded-lg bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm ring-1 ring-primary/20 hover:bg-muted"
      >
        ← Katalogga
      </Link>
    </div>
  )
}
