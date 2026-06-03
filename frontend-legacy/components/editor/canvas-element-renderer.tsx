"use client"

import type { CanvasElement } from "@/lib/editor/canvas-types"
import { cn } from "@/lib/utils"

export function CanvasElementRenderer({
  element,
  selected,
}: {
  element: CanvasElement
  selected: boolean
}) {
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    opacity: element.opacity,
    pointerEvents: "none",
  }

  if (element.type === "text") {
    return (
      <div
        style={{
          ...style,
          color: element.color,
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          fontWeight: element.fontWeight,
          textAlign: element.textAlign,
          display: "flex",
          alignItems: "center",
          justifyContent:
            element.textAlign === "center"
              ? "center"
              : element.textAlign === "right"
                ? "flex-end"
                : "flex-start",
          padding: "4px 8px",
          wordBreak: "break-word",
          lineHeight: element.lineHeight,
          letterSpacing: `${element.letterSpacing}px`,
        }}
      >
        {element.label}
      </div>
    )
  }

  if (element.type === "qr") {
    const fg = element.qrForeground || element.color || "#0a1628"
    const bg = element.qrBackground || element.fill || "#ffffff"
    return (
      <div
        className={cn("flex flex-col items-center justify-center p-1", selected && "ring-1 ring-primary/30")}
        style={{ ...style, backgroundColor: bg }}
      >
        <div className="grid grid-cols-5 gap-px p-1">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="size-2.5"
              style={{ backgroundColor: i % 2 === 0 ? fg : "transparent" }}
            />
          ))}
        </div>
        <p
          className="mt-1 max-w-full truncate text-[8px]"
          style={{ color: fg, opacity: 0.55 }}
        >
          {element.qrValue.replace(/^https?:\/\//, "")}
        </p>
      </div>
    )
  }

  if (element.type === "image" || element.type === "logo" || element.type === "signature" || element.type === "stamp") {
    if (element.src) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={element.src}
          alt={element.name}
          className="size-full"
          style={{ ...style, objectFit: element.objectFit }}
          draggable={false}
        />
      )
    }
    return (
      <div
        className="flex size-full flex-col items-center justify-center gap-1 border border-dashed border-[#cbd5e1] bg-[#f8fafc] text-[10px] font-medium text-[#94a3b8]"
        style={style}
      >
        <span className="text-[#cbd5e1]">◇</span>
        <span className="max-w-full truncate px-1">{element.name}</span>
      </div>
    )
  }

  if (element.type === "background") {
    if (element.src) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={element.src}
          alt={element.name}
          className="size-full"
          style={{ ...style, objectFit: element.objectFit }}
          draggable={false}
        />
      )
    }
    return (
      <div
        style={{
          ...style,
          background: element.fill,
          borderRadius: element.cornerRadius,
          border:
            element.strokeWidth > 0
              ? `${element.strokeWidth}px solid ${element.stroke}`
              : undefined,
        }}
      />
    )
  }

  if (element.type === "shape") {
    if (element.shapeKind === "ellipse") {
      return (
        <div
          style={{
            ...style,
            borderRadius: "50%",
            background: element.fill,
            border: `${element.strokeWidth}px solid ${element.stroke}`,
          }}
        />
      )
    }
    if (element.shapeKind === "line") {
      return (
        <div
          style={{
            ...style,
            height: element.strokeWidth,
            background: element.stroke,
            marginTop: (element.height - element.strokeWidth) / 2,
          }}
        />
      )
    }
    if (element.shapeKind === "triangle") {
      return (
        <div style={style} className="flex items-center justify-center">
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${element.width / 2}px solid transparent`,
              borderRight: `${element.width / 2}px solid transparent`,
              borderBottom: `${element.height}px solid ${element.fill}`,
            }}
          />
        </div>
      )
    }
    const radius =
      element.shapeKind === "rect"
        ? element.cornerRadius
        : element.shapeKind === "star"
          ? Math.max(element.cornerRadius, 4)
          : 2
    return (
      <div
        style={{
          ...style,
          background: element.fill,
          border: `${element.strokeWidth}px solid ${element.stroke}`,
          borderRadius: radius,
        }}
      />
    )
  }

  return null
}
