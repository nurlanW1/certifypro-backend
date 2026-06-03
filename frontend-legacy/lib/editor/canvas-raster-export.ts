import type { CanvasElement } from "@/lib/editor/canvas-types"

export type RasterExportFormat = "png" | "jpg"

export type RasterExportOptions = {
  width: number
  height: number
  background: string
  elements: CanvasElement[]
  scale?: number
  format?: RasterExportFormat
  quality?: number
  /** When true, draws a semi-transparent plan watermark on the canvas. */
  watermark?: boolean
  watermarkText?: string
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Image load failed"))
    img.src = src
  })
}

async function drawElement(
  ctx: CanvasRenderingContext2D,
  el: CanvasElement
) {
  if (el.hidden) return
  ctx.globalAlpha = el.opacity ?? 1

  const draw = async () => {
    if (el.type === "text") {
      ctx.fillStyle = el.color || "#0f172a"
      ctx.font = `${el.fontWeight || 400} ${el.fontSize}px ${el.fontFamily || "Inter, sans-serif"}`
      ctx.textAlign = el.textAlign || "left"
      ctx.textBaseline = "middle"
      const lines = (el.label || "").split("\n")
      const lh = (el.lineHeight || 1.2) * el.fontSize
      const startY = el.y + el.height / 2 - ((lines.length - 1) * lh) / 2
      lines.forEach((line, i) => {
        let x = el.x + 8
        if (el.textAlign === "center") x = el.x + el.width / 2
        if (el.textAlign === "right") x = el.x + el.width - 8
        ctx.fillText(line, x, startY + i * lh, el.width - 16)
      })
      return
    }

    if (el.type === "shape") {
      if (el.shapeKind === "ellipse") {
        ctx.beginPath()
        ctx.ellipse(
          el.x + el.width / 2,
          el.y + el.height / 2,
          el.width / 2,
          el.height / 2,
          0,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = el.fill || "transparent"
        ctx.fill()
        if (el.strokeWidth > 0) {
          ctx.strokeStyle = el.stroke || "#000"
          ctx.lineWidth = el.strokeWidth
          ctx.stroke()
        }
        return
      }
      if (el.shapeKind === "line") {
        ctx.fillStyle = el.stroke || "#94a3b8"
        ctx.fillRect(el.x, el.y + (el.height - el.strokeWidth) / 2, el.width, el.strokeWidth || 2)
        return
      }
      const r = el.cornerRadius || 0
      roundRect(ctx, el.x, el.y, el.width, el.height, r)
      ctx.fillStyle = el.fill || "transparent"
      ctx.fill()
      if (el.strokeWidth > 0) {
        ctx.strokeStyle = el.stroke || "#000"
        ctx.lineWidth = el.strokeWidth
        ctx.stroke()
      }
      return
    }

    if (
      el.type === "image" ||
      el.type === "logo" ||
      el.type === "signature" ||
      el.type === "stamp" ||
      el.type === "background"
    ) {
      if (el.src) {
        try {
          const img = await loadImage(el.src)
          ctx.drawImage(img, el.x, el.y, el.width, el.height)
        } catch {
          ctx.fillStyle = "#f1f5f9"
          ctx.fillRect(el.x, el.y, el.width, el.height)
        }
      } else if (el.type === "background") {
        ctx.fillStyle = el.fill || "#ffffff"
        ctx.fillRect(el.x, el.y, el.width, el.height)
      }
      return
    }

    if (el.type === "qr") {
      const fg = el.qrForeground || el.color || "#0a1628"
      const bg = el.qrBackground || el.fill || "#ffffff"
      ctx.fillStyle = bg
      ctx.fillRect(el.x, el.y, el.width, el.height)
      const cell = Math.min(el.width, el.height) / 7
      ctx.fillStyle = fg
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if ((row + col) % 2 === 0) {
            ctx.fillRect(el.x + col * cell + cell, el.y + row * cell + cell, cell, cell)
          }
        }
      }
    }
  }

  if (el.rotation) {
    const cx = el.x + el.width / 2
    const cy = el.y + el.height / 2
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((el.rotation * Math.PI) / 180)
    ctx.translate(-cx, -cy)
    await draw()
    ctx.restore()
  } else {
    await draw()
  }

  ctx.globalAlpha = 1
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

export async function renderDesignToCanvas(
  options: RasterExportOptions
): Promise<HTMLCanvasElement> {
  const scale = options.scale ?? 2
  const w = Math.round(options.width * scale)
  const h = Math.round(options.height * scale)
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported")

  ctx.scale(scale, scale)
  ctx.fillStyle = options.background || "#ffffff"
  ctx.fillRect(0, 0, options.width, options.height)

  for (const el of options.elements) {
    await drawElement(ctx, el)
  }

  if (options.watermark) {
    const label = options.watermarkText ?? "CertifyPro"
    ctx.save()
    ctx.globalAlpha = 0.22
    ctx.fillStyle = "#64748b"
    ctx.font = `600 ${Math.max(14, Math.round(options.width * 0.04))}px Inter, sans-serif`
    ctx.textAlign = "right"
    ctx.textBaseline = "bottom"
    ctx.fillText(label, options.width - 16, options.height - 12)
    ctx.restore()
  }

  return canvas
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: RasterExportFormat = "png",
  quality = 0.92
) {
  const mime = format === "jpg" ? "image/jpeg" : "image/png"
  const url = canvas.toDataURL(mime, quality)
  triggerDownload(url, filename)
}

export function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a")
  a.href = href
  a.download = filename
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export async function exportDesignRaster(
  options: RasterExportOptions & { filename: string }
): Promise<void> {
  const canvas = await renderDesignToCanvas(options)
  const ext = options.format === "jpg" ? "jpg" : "png"
  downloadCanvas(canvas, `${options.filename}.${ext}`, options.format ?? "png", options.quality)
}
