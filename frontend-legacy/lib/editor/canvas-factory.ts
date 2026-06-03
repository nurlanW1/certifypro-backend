import type { CanvasElement, CanvasElementType, ShapeKind } from "@/lib/editor/canvas-types"

let idCounter = 0

export function nextElementId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

const baseDefaults = (): Omit<CanvasElement, "id" | "type" | "name" | "label"> => ({
  x: 120,
  y: 120,
  width: 200,
  height: 48,
  rotation: 0,
  opacity: 1,
  locked: false,
  hidden: false,
  fontSize: 18,
  fontFamily: "Inter, sans-serif",
  color: "#0a1628",
  textAlign: "center",
  fontWeight: 600,
  lineHeight: 1.25,
  letterSpacing: 0,
  objectFit: "cover",
  shapeKind: "rect",
  fill: "#2563eb",
  stroke: "#0a1628",
  strokeWidth: 2,
  cornerRadius: 0,
  qrValue: "https://gildia.uz",
  qrForeground: "#0a1628",
  qrBackground: "#ffffff",
})

export function createTextElement(partial?: Partial<CanvasElement>): CanvasElement {
  return {
    id: nextElementId("text"),
    type: "text",
    name: "Matn",
    label: "Yangi matn",
    ...baseDefaults(),
    width: 220,
    height: 40,
    ...partial,
  }
}

export function createShapeElement(kind: ShapeKind, partial?: Partial<CanvasElement>): CanvasElement {
  const isLine = kind === "line"
  return {
    id: nextElementId("shape"),
    type: "shape",
    name: `Shakl (${kind})`,
    label: "",
    ...baseDefaults(),
    shapeKind: kind,
    width: isLine ? 160 : 120,
    height: isLine ? 4 : 120,
    fill: kind === "line" ? "transparent" : "#2563eb33",
    stroke: "#2563eb",
    ...partial,
  }
}

export function createImageElement(
  type: Extract<CanvasElementType, "image" | "logo" | "signature" | "stamp">,
  src: string,
  partial?: Partial<CanvasElement>
): CanvasElement {
  const names: Record<string, string> = {
    image: "Rasm",
    logo: "Logo",
    signature: "Imzo",
    stamp: "Muhr",
  }
  return {
    id: nextElementId(type),
    type,
    name: names[type] ?? "Rasm",
    label: "",
    ...baseDefaults(),
    src,
    width: type === "stamp" ? 72 : type === "signature" ? 120 : 140,
    height: type === "stamp" ? 72 : type === "signature" ? 48 : 100,
    ...partial,
  }
}

export function createBackgroundElement(partial?: Partial<CanvasElement>): CanvasElement {
  return {
    id: nextElementId("background"),
    type: "background",
    name: "Fon",
    label: "",
    ...baseDefaults(),
    width: 560,
    height: 396,
    fill: "#ffffff",
    stroke: "transparent",
    strokeWidth: 0,
    locked: false,
    ...partial,
  }
}

export function createQrElement(value: string, partial?: Partial<CanvasElement>): CanvasElement {
  return {
    id: nextElementId("qr"),
    type: "qr",
    name: "QR kod",
    label: "",
    ...baseDefaults(),
    qrValue: value || "https://gildia.uz",
    width: 96,
    height: 96,
    fill: "#ffffff",
    color: "#0a1628",
    qrForeground: "#0a1628",
    qrBackground: "#ffffff",
    ...partial,
  }
}

export function duplicateElement(el: CanvasElement): CanvasElement {
  return {
    ...el,
    id: nextElementId(el.type),
    name: `${el.name} (nusxa)`,
    x: el.x + 16,
    y: el.y + 16,
  }
}

/** Merge persisted / legacy partial elements with full defaults */
export function normalizeElement(
  raw: Partial<CanvasElement> & Pick<CanvasElement, "id" | "type">
): CanvasElement {
  const seed =
    raw.type === "text"
      ? createTextElement()
      : raw.type === "shape"
        ? createShapeElement(raw.shapeKind ?? "rect")
        : raw.type === "qr"
          ? createQrElement(raw.qrValue ?? "")
          : raw.type === "background"
            ? createBackgroundElement()
            : raw.type === "image" || raw.type === "logo" || raw.type === "signature" || raw.type === "stamp"
              ? createImageElement(raw.type, raw.src ?? "")
              : createTextElement()

  return {
    ...seed,
    ...raw,
    id: raw.id,
    type: raw.type,
    hidden: raw.hidden ?? seed.hidden ?? false,
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
