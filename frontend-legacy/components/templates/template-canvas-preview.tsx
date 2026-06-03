"use client"

import { useLayoutEffect, useMemo, useRef, useState } from "react"

import { CanvasElementRenderer } from "@/components/editor/canvas-element-renderer"
import { ProductPreviewPlaceholder } from "@/components/templates/product-preview-placeholder"
import { compileDefaultDesignTemplate } from "@/lib/templates/design-templates"
import type { CanvasElement } from "@/lib/editor/canvas-types"
import type { PreviewTone, ProductFormData } from "@/lib/templates/types"
import { cn } from "@/lib/utils"

type Props = {
  productId: string
  productName: string
  tone: PreviewTone
  format?: string
  className?: string
  aspectClass?: string
  /** Override preview frame ratio (e.g. A4 landscape 297×210) */
  frameAspect?: { width: number; height: number }
  preview?: Partial<ProductFormData>
}

export function TemplateCanvasPreview({
  productId,
  productName,
  tone,
  format,
  className,
  aspectClass = "aspect-[4/3]",
  frameAspect,
  preview,
}: Props) {
  const compiled = useMemo(
    () => compileDefaultDesignTemplate(productId, preview),
    [productId, preview]
  )

  if (!compiled) {
    return (
      <ProductPreviewPlaceholder
        productName={productName}
        tone={tone}
        format={format}
        className={className}
        aspectClass={aspectClass}
      />
    )
  }

  const { artboardWidth, artboardHeight, elements } = compiled
  const useCatalogFrame = Boolean(frameAspect)
  const frameW = frameAspect?.width ?? artboardWidth
  const frameH = frameAspect?.height ?? artboardHeight

  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-lg bg-[#e2e8f0] ring-1 ring-border/50",
        !useCatalogFrame && aspectClass,
        className
      )}
      style={
        useCatalogFrame || !aspectClass
          ? { aspectRatio: `${frameW} / ${frameH}` }
          : undefined
      }
    >
      <ScaledArtboard width={artboardWidth} height={artboardHeight} elements={elements} />
      {format ? (
        <span className="absolute right-2 top-2 z-10 rounded bg-black/55 px-1.5 py-0.5 text-[8px] font-medium text-white/90">
          {format}
        </span>
      ) : null}
    </div>
  )
}

function ScaledArtboard({
  width,
  height,
  elements,
}: {
  width: number
  height: number
  elements: CanvasElement[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const pw = el.clientWidth
      const ph = el.clientHeight
      if (pw <= 0 || ph <= 0) return
      setScale(Math.min(pw / width, ph / height))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, height])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-white">
      <div
        className="absolute left-1/2 top-1/2 origin-center"
        style={{
          width,
          height,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <div className="relative size-full bg-white">
          {elements.map((el) => (
            <div
              key={el.id}
              className="absolute"
              style={{ left: el.x, top: el.y, width: el.width, height: el.height }}
            >
              <CanvasElementRenderer element={el} selected={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
