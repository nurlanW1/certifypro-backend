import {
  createImageElement,
  createQrElement,
  createTextElement,
} from "@/lib/editor/canvas-factory"
import type { CanvasElement } from "@/lib/editor/canvas-types"
import { loadBuilderDraft, loadEventSetup } from "@/lib/event-create/storage"
import { mapToPreviewData } from "@/lib/event-create/preview-data"
import { assetDataUrlFromFormValue } from "@/lib/uploads/serialize"

export function elementsFromEventMaterial(eventId: string, category: string): CanvasElement[] {
  const setup = loadEventSetup(eventId)
  const draft = loadBuilderDraft(eventId)
  const formData = draft?.forms?.[category] ?? {}
  const preview = mapToPreviewData(category, formData, setup)

  const els: CanvasElement[] = [
    createTextElement({
      id: "title",
      name: "Sarlavha",
      label: preview.headline || preview.eventName,
      x: 120,
      y: 72,
      width: 320,
      height: 48,
      fontSize: 26,
      fontWeight: 700,
      color: preview.primaryColor || "#0a1628",
    }),
    createTextElement({
      id: "name",
      name: "Ism",
      label: preview.fullName,
      x: 140,
      y: 168,
      width: 280,
      height: 40,
      fontSize: 20,
    }),
  ]

  const logoUrl =
    preview.logoDataUrl ||
    assetDataUrlFromFormValue(formData.logo) ||
    assetDataUrlFromFormValue(formData.coverLogo)

  if (logoUrl) {
    els.push(createImageElement("logo", logoUrl, { id: "logo", x: 40, y: 40 }))
  }

  const sig1 = preview.signature1DataUrl || assetDataUrlFromFormValue(formData.signature1)
  if (sig1) {
    els.push(createImageElement("signature", sig1, { id: "signature1", x: 60, y: 300, width: 100, height: 40 }))
  }

  const sig2 = preview.signature2DataUrl || assetDataUrlFromFormValue(formData.signature2)
  if (sig2) {
    els.push(createImageElement("signature", sig2, { id: "signature2", x: 400, y: 300, width: 100, height: 40 }))
  }

  const stampUrl = preview.stampDataUrl || assetDataUrlFromFormValue(formData.stamp)
  if (stampUrl) {
    els.push(createImageElement("stamp", stampUrl, { id: "stamp", x: 240, y: 290, width: 72, height: 72 }))
  }

  const photoUrl = preview.photoDataUrl || assetDataUrlFromFormValue(formData.photo)
  if (photoUrl) {
    els.push(createImageElement("image", photoUrl, { id: "photo", x: 420, y: 120, width: 80, height: 100 }))
  }

  const bgUrl = preview.backgroundDataUrl || assetDataUrlFromFormValue(formData.background)
  if (bgUrl) {
    els.unshift(
      createImageElement("image", bgUrl, {
        id: "background",
        x: 0,
        y: 0,
        width: 560,
        height: 396,
        opacity: 0.35,
      })
    )
  }

  if (preview.qrCode) {
    els.push(createQrElement(preview.qrCode, { id: "qr", x: 420, y: 280 }))
  }

  return els
}
