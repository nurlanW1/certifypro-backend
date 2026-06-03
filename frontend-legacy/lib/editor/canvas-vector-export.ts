import type { CanvasElement } from "@/lib/editor/canvas-types"

import { triggerDownload } from "@/lib/editor/canvas-raster-export"

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function elementToSvg(el: CanvasElement): string {
  if (el.hidden) return ""
  const transform =
    el.rotation !== 0
      ? ` transform="rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})"`
      : ""
  const opacity = el.opacity < 1 ? ` opacity="${el.opacity}"` : ""

  if (el.type === "text") {
    const anchor =
      el.textAlign === "center" ? "middle" : el.textAlign === "right" ? "end" : "start"
    const x =
      el.textAlign === "center"
        ? el.x + el.width / 2
        : el.textAlign === "right"
          ? el.x + el.width - 8
          : el.x + 8
    return `<text x="${x}" y="${el.y + el.height / 2}" font-family="${escapeXml(el.fontFamily)}" font-size="${el.fontSize}" font-weight="${el.fontWeight}" fill="${escapeXml(el.color)}" text-anchor="${anchor}" dominant-baseline="middle"${transform}${opacity}>${escapeXml(el.label)}</text>`
  }

  if (el.type === "shape") {
    if (el.shapeKind === "ellipse") {
      return `<ellipse cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" rx="${el.width / 2}" ry="${el.height / 2}" fill="${escapeXml(el.fill)}" stroke="${escapeXml(el.stroke)}" stroke-width="${el.strokeWidth}"${transform}${opacity}/>`
    }
    if (el.shapeKind === "line") {
      return `<line x1="${el.x}" y1="${el.y + el.height / 2}" x2="${el.x + el.width}" y2="${el.y + el.height / 2}" stroke="${escapeXml(el.stroke)}" stroke-width="${el.strokeWidth || 2}"${transform}${opacity}/>`
    }
    return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.cornerRadius}" fill="${escapeXml(el.fill)}" stroke="${escapeXml(el.stroke)}" stroke-width="${el.strokeWidth}"${transform}${opacity}/>`
  }

  if (el.src && (el.type === "image" || el.type === "logo" || el.type === "signature" || el.type === "stamp" || el.type === "background")) {
    return `<image href="${escapeXml(el.src)}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" preserveAspectRatio="xMidYMid slice"${transform}${opacity}/>`
  }

  if (el.type === "qr") {
    const fg = el.qrForeground || el.color || "#0a1628"
    const bg = el.qrBackground || el.fill || "#ffffff"
    let cells = `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${escapeXml(bg)}"${transform}${opacity}/>`
    const cell = Math.min(el.width, el.height) / 7
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if ((row + col) % 2 === 0) {
          cells += `<rect x="${el.x + col * cell + cell}" y="${el.y + row * cell + cell}" width="${cell}" height="${cell}" fill="${escapeXml(fg)}"${transform}/>`
        }
      }
    }
    return cells
  }

  return ""
}

export function buildDesignSvg(options: {
  width: number
  height: number
  background: string
  elements: CanvasElement[]
}): string {
  const body = options.elements.map(elementToSvg).join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}">
  <rect width="100%" height="100%" fill="${escapeXml(options.background)}"/>
  ${body}
</svg>`
}

export function exportDesignSvg(
  options: {
    width: number
    height: number
    background: string
    elements: CanvasElement[]
    filename: string
  }
): void {
  const svg = buildDesignSvg(options)
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, `${options.filename}.svg`)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
