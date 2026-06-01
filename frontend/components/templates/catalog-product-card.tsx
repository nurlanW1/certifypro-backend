"use client"

import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TemplateCanvasPreview } from "@/components/templates/template-canvas-preview"
import { buildEditorHref } from "@/lib/editor/editor-routes"
import type { CatalogProduct } from "@/lib/templates/types"
import { getCatalogPreviewFrame } from "@/lib/templates/catalog-layout"
import { checkBillingAccess, isPremiumProductAllowed } from "@/lib/billing/access"

type Props = {
  product: CatalogProduct
  categoryName: string
}

export function CatalogProductCard({ product, categoryName }: Props) {
  const router = useRouter()

  const editorHref = buildEditorHref({
    from: "catalog",
    templateId: product.id,
    eventId: null,
    category: null,
    fresh: true,
  })

  const openInEditor = () => {
    router.push(editorHref)
    void checkBillingAccess("canCreateDesign").then((designGate) => {
      if (!designGate.allowed) {
        toast.error(designGate.message)
        return
      }
      if (!product.isPremium) return
      void checkBillingAccess("canUsePremiumTemplate").then((premiumGate) => {
        if (!premiumGate.allowed) {
          toast.error(premiumGate.message)
          return
        }
        if (!isPremiumProductAllowed(premiumGate.billing, true)) {
          toast.error("Premium shablonlar Pro yoki Event paketida mavjud.")
        }
      })
    })
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openInEditor}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          openInEditor()
        }
      }}
      className="group flex w-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-premium-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex w-full min-w-0 items-center justify-center border-b border-border bg-muted/20 p-3">
        <TemplateCanvasPreview
          productId={product.id}
          productName={product.title}
          tone={product.previewTone}
          format={product.format}
          frameAspect={getCatalogPreviewFrame(product.previewTone, product.id)}
          className="w-full max-w-full"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1">
          <Badge text={product.isPremium ? "Premium" : "Free"} variant={product.isPremium ? "premium" : "free"} />
          {product.isPrint ? <Badge text="Print" variant="print" /> : null}
          {product.isOnline ? <Badge text="Online" variant="online" /> : null}
        </div>

        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-primary">{categoryName}</p>
        <h3 className="mt-1 text-base font-semibold text-foreground group-hover:text-primary">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
          <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
            {product.format}
          </span>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={(e) => {
              e.stopPropagation()
              openInEditor()
            }}
          >
            <Pencil className="size-3.5" />
            Editorda ochish
          </Button>
        </div>
      </div>
    </article>
  )
}
