"use client"

import { TemplateCanvasPreview } from "@/components/templates/template-canvas-preview"
import { ProductPreviewPlaceholder } from "@/components/templates/product-preview-placeholder"
import { getCatalogPreviewFrame } from "@/lib/templates/catalog-layout"
import { hasDefaultDesignTemplate } from "@/lib/templates/design-templates"
import { toPreviewFormData } from "@/lib/templates/product-draft-storage"
import type { CatalogProduct } from "@/lib/templates/types"

type Props = {
  product: CatalogProduct
  values: Record<string, string>
}

function aspectForProduct(product: CatalogProduct) {
  const frame = getCatalogPreviewFrame(product.previewTone, product.id)
  return `aspect-[${frame.width}/${frame.height}]`
}

export function ProductLivePreview({ product, values }: Props) {
  const previewData = toPreviewFormData(values)
  const aspectClass = aspectForProduct(product)
  const frameAspect = getCatalogPreviewFrame(product.previewTone, product.id)

  if (hasDefaultDesignTemplate(product.id)) {
    return (
      <div className="w-full min-w-0">
        <TemplateCanvasPreview
          productId={product.id}
          productName={product.title}
          tone={product.previewTone}
          format={product.format}
          preview={previewData}
          frameAspect={frameAspect}
          className="w-full max-w-full shadow-md"
        />
      </div>
    )
  }

  return (
    <div className="w-full min-w-0">
      <ProductPreviewPlaceholder
        productName={previewData.subtitle || product.title}
        tone={product.previewTone}
        format={product.format}
        aspectClass={aspectClass}
      />
    </div>
  )
}
