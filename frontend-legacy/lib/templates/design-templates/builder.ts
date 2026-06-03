import {
  createBackgroundElement,
  createImageElement,
  createQrElement,
  createShapeElement,
  createTextElement,
} from "@/lib/editor/canvas-factory"
import type { CanvasElement } from "@/lib/editor/canvas-types"
import { resolveArtboardForProduct } from "@/lib/editor/product-artboards"
import { applyTemplateTokens } from "./tokens"
import type {
  BackgroundLayerSpec,
  CompiledDesignTemplate,
  DesignTemplateDefinition,
  ImageLayerSpec,
  QrLayerSpec,
  ShapeLayerSpec,
  TemplateLayerSpec,
  TemplateTokens,
  TextLayerSpec,
} from "./types"

function compileBackground(layer: BackgroundLayerSpec): CanvasElement {
  return createBackgroundElement({
    id: layer.id,
    name: layer.name ?? "Fon",
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    fill: layer.fill,
    stroke: layer.stroke ?? "transparent",
    strokeWidth: layer.strokeWidth ?? 0,
    rotation: layer.rotation ?? 0,
    opacity: layer.opacity ?? 1,
    locked: layer.locked ?? false,
    shapeKind: "rect",
  })
}

function compileShape(layer: ShapeLayerSpec): CanvasElement {
  return createShapeElement(layer.shape, {
    id: layer.id,
    name: layer.name ?? "Shakl",
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    fill: layer.fill,
    stroke: layer.stroke ?? "transparent",
    strokeWidth: layer.strokeWidth ?? 0,
    rotation: layer.rotation ?? 0,
    opacity: layer.opacity ?? 1,
    locked: layer.locked ?? false,
  })
}

function compileText(layer: TextLayerSpec, tokens: TemplateTokens): CanvasElement {
  return createTextElement({
    id: layer.id,
    name: layer.name,
    label: applyTemplateTokens(layer.placeholder, tokens),
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    fontSize: layer.fontSize,
    fontWeight: layer.fontWeight ?? 600,
    color: layer.color,
    textAlign: layer.textAlign ?? "center",
    fontFamily: layer.fontFamily ?? "Georgia, serif",
    opacity: layer.opacity ?? 1,
    locked: layer.locked ?? false,
  })
}

function compileImage(layer: ImageLayerSpec): CanvasElement {
  return createImageElement(layer.kind, "", {
    id: layer.id,
    name: layer.name,
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    objectFit: layer.objectFit ?? "contain",
    opacity: layer.opacity ?? 1,
    locked: layer.locked ?? false,
  })
}

function compileQr(layer: QrLayerSpec, tokens: TemplateTokens): CanvasElement {
  const value = layer.placeholder
    ? applyTemplateTokens(layer.placeholder, tokens)
    : "https://gildia.uz/verify"
  return createQrElement(value, {
    id: layer.id,
    name: layer.name ?? "QR kod",
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    locked: layer.locked ?? false,
  })
}

function compileLayer(layer: TemplateLayerSpec, tokens: TemplateTokens): CanvasElement {
  switch (layer.kind) {
    case "background":
      return compileBackground(layer)
    case "shape":
      return compileShape(layer)
    case "text":
      return compileText(layer, tokens)
    case "image":
    case "logo":
    case "signature":
    case "stamp":
      return compileImage(layer)
    case "qr":
      return compileQr(layer, tokens)
    default:
      return compileShape(layer as ShapeLayerSpec)
  }
}

export function compileDesignTemplate(
  definition: DesignTemplateDefinition,
  tokens?: Partial<TemplateTokens>
): CompiledDesignTemplate {
  const merged: TemplateTokens = {
    eventName: tokens?.eventName ?? "{{event_name}}",
    fullName: tokens?.fullName ?? "{{full_name}}",
    organization: tokens?.organization ?? "{{organization}}",
    position: tokens?.position ?? "{{position}}",
    date: tokens?.date ?? "{{date}}",
    subtitle: tokens?.subtitle ?? "{{subtitle}}",
  }

  const elements = definition.layers.map((layer) => compileLayer(layer, merged))
  const artboard = resolveArtboardForProduct(definition.productId)

  return {
    productId: definition.productId,
    title: definition.title,
    artboardWidth: artboard.width,
    artboardHeight: artboard.height,
    artboardLabel: artboard.label,
    elements,
  }
}
