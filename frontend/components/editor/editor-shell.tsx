"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { EditorLeftPanel, type EditorToolId } from "@/components/editor/editor-left-panel"
import { EditorCanvas, type EditorCanvasHandle } from "@/components/editor/editor-canvas"
import { EditorInspector } from "@/components/editor/editor-inspector"
import { EditorStatusBar } from "@/components/editor/editor-status-bar"
import { ExportPanel } from "@/components/editor/export-panel"
import {
  EditorLoadingState,
  EditorMobileGate,
  EditorShortcutsDialog,
} from "@/components/editor/editor-ui-states"
import { EditorToolsPanel } from "@/components/editor/tools/editor-tools-panel"
import { editorChrome } from "@/lib/editor/editor-chrome"
import { interactionModeForTool } from "@/lib/editor/editor-tools"
import {
  createImageElement,
  createQrElement,
  createShapeElement,
  createTextElement,
  duplicateElement,
  normalizeElement,
} from "@/lib/editor/canvas-factory"
import { fitImageElementSize, loadEditorImageFromFile } from "@/lib/editor/image-upload"
import { elementsFromEventMaterial } from "@/lib/editor/seed-from-preview"
import { reorderElements, type LayerReorderAction } from "@/lib/editor/layer-utils"
import type { CanvasElement, EditorDesignStatus } from "@/lib/editor/canvas-types"
import { buildDesignState, designElementsFromState } from "@/lib/editor/build-design-state"
import { captureDesignThumbnail } from "@/lib/editor/canvas-thumbnail"
import {
  duplicateEditorDesign,
  loadEditorDesign,
  resolveEditorScope,
  saveEditorDesign,
} from "@/lib/editor/design-storage"
import { getEditorBackHref } from "@/lib/editor/editor-routes"
import {
  resolveArtboardForProduct,
  resolveArtboardFromSaved,
  resolveArtboardFormat,
  type ResolvedArtboard,
} from "@/lib/editor/product-artboards"
import { useCanvasHistory } from "@/lib/editor/use-canvas-history"
import { getProductById } from "@/lib/templates/product-catalog"
import {
  getEditorProductName,
  getOrCreateDraftValues,
  loadProductDraft,
  saveProductDraft,
  toPreviewFormData,
} from "@/lib/templates/product-draft-storage"
import { syncFormValuesToElements } from "@/lib/editor/sync-template-fields"
import { loadBuilderDraft, loadEventSetup } from "@/lib/event-create/storage"
import { useAutoSave } from "@/hooks/use-auto-save"
import { compileDefaultDesignTemplate } from "@/lib/templates/design-templates"
import {
  applyLoadedTemplateToState,
  loadTemplateCanvas,
  shouldPreferFreshTemplate,
} from "@/lib/editor/load-template-canvas"

function defaultSeedElements(): CanvasElement[] {
  return [
    createTextElement({
      id: "title",
      name: "Sarlavha",
      label: "{{event_name}}",
      x: 120,
      y: 80,
      width: 320,
      height: 48,
      fontSize: 28,
      fontWeight: 700,
    }),
    createTextElement({
      id: "name",
      name: "Ism",
      label: "{{full_name}}",
      x: 160,
      y: 180,
      width: 240,
      height: 36,
      fontSize: 22,
    }),
  ]
}

export function EditorShell() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")
  const from = searchParams.get("from")
  const eventId = searchParams.get("eventId")
  const category = searchParams.get("category")
  const eventProductId = searchParams.get("eventProductId")
  const scopeOverride = searchParams.get("scope")
  const fromCatalog = from === "catalog" || Boolean(templateId && from !== "event-create")
  const fromEvent = from === "event-create"

  const scope =
    scopeOverride ??
    resolveEditorScope({ from, templateId, eventId, category, eventProductId })
  const scopeRef = useRef(scope)
  useEffect(() => {
    scopeRef.current = scope
  }, [scope])

  const [productName, setProductName] = useState("Konferensiya sertifikati")
  const [leftTool, setLeftTool] = useState<EditorToolId>("select")
  const [zoom, setZoom] = useState(85)
  const [selectedId, setSelectedId] = useState<string | null>("name")
  const [exportOpen, setExportOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [designStatus, setDesignStatus] = useState<EditorDesignStatus>("draft")
  const [qrInput, setQrInput] = useState("https://gildia.uz")
  const [hydrated, setHydrated] = useState(false)
  const forceFreshOpen = searchParams.get("fresh") === "1"
  const loadKey = `${scope}|${templateId ?? ""}|${from ?? ""}|${eventId ?? ""}|${category ?? ""}|${forceFreshOpen ? "fresh" : ""}`
  const defaultArtboard = resolveArtboardForProduct(templateId)
  const [artboardFormatId, setArtboardFormatId] = useState(defaultArtboard.formatId)
  const [artboard, setArtboard] = useState<ResolvedArtboard>(defaultArtboard)
  const [artboardBackground, setArtboardBackground] = useState("#ffffff")
  const [templateFormValues, setTemplateFormValues] = useState<Record<string, string>>({})

  const templateLabel = useMemo(() => {
    if (templateId) {
      return getProductById(templateId)?.title ?? templateId
    }
    if (fromEvent && category) {
      return category.replace(/-/g, " ")
    }
    return "Standart maket"
  }, [templateId, fromEvent, category])

  const {
    elements,
    pushHistory,
    replaceElements,
    updateElementLive,
    commitHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasHistory(defaultSeedElements())

  const canvasRef = useRef<EditorCanvasHandle>(null)
  const elementsRef = useRef(elements)
  useEffect(() => {
    elementsRef.current = elements
  }, [elements])
  const interactionMode = interactionModeForTool(leftTool)

  const initTemplateFormValues = useCallback((productId: string) => {
    const product = getProductById(productId)
    if (!product) return {}
    return getOrCreateDraftValues(product)
  }, [])

  const handleTemplateFieldChange = useCallback(
    (key: string, value: string) => {
      setTemplateFormValues((prev) => {
        const next = { ...prev, [key]: value }
        const product = templateId ? getProductById(templateId) : null
        if (product) {
          saveProductDraft(product, next)
          const synced = syncFormValuesToElements(
            elementsRef.current,
            next,
            product.title
          )
          replaceElements(synced, false)
          if (key === "qrUrl" && value.trim()) {
            setQrInput(value.trim())
          }
          if (key === "eventName" || key === "subtitle" || key === "headline") {
            setProductName(getEditorProductName(product, next))
          }
        }
        return next
      })
    },
    [templateId, replaceElements]
  )

  useEffect(() => {
    setHydrated(false)
  }, [loadKey])

  useEffect(() => {
    if (hydrated) return

    const hydrate = () => {
      const saved = loadEditorDesign(scope)
      const savedElements = saved ? designElementsFromState(saved) : []
      const openingCatalogTemplate =
        Boolean(templateId) && (fromCatalog || (!fromEvent && !eventId))
      const preferFreshTemplate =
        openingCatalogTemplate &&
        shouldPreferFreshTemplate(saved, templateId!, { forceFresh: forceFreshOpen })

      if (saved && savedElements.length > 0 && !preferFreshTemplate) {
        setProductName(saved.productName)
        setDesignStatus(saved.status ?? "draft")
        const resolved = resolveArtboardFromSaved(templateId, {
          artboardFormatId: saved.artboardFormatId,
          artboardWidth: saved.artboardWidth,
          artboardHeight: saved.artboardHeight,
        })
        setArtboardFormatId(resolved.formatId)
        setArtboard(resolved)
        setArtboardBackground(saved.artboardBackground ?? "#ffffff")
        const normalized = savedElements.map((e) => normalizeElement(e))
        if (templateId && openingCatalogTemplate) {
          const product = getProductById(templateId)
          const formVals = product ? initTemplateFormValues(templateId) : {}
          setTemplateFormValues(formVals)
          replaceElements(
            product
              ? syncFormValuesToElements(normalized, formVals, product.title)
              : normalized,
            true
          )
        } else {
          replaceElements(normalized, true)
        }
        const firstText = normalized.find((e) => e.type === "text" && !e.locked)
        setSelectedId(firstText?.id ?? normalized[0]?.id ?? null)
        setHydrated(true)
        if (searchParams.get("export") === "1") setExportOpen(true)
        return
      }

      if (openingCatalogTemplate && templateId) {
        const product = getProductById(templateId)
        if (!product) {
          toast.error("Shablon topilmadi")
          setHydrated(true)
          return
        }
        const formVals = initTemplateFormValues(templateId)
        setTemplateFormValues(formVals)
        if (formVals.qrUrl) setQrInput(formVals.qrUrl)
        const loaded = loadTemplateCanvas(templateId, formVals)
        if (loaded) {
          const applied = applyLoadedTemplateToState(loaded)
          setProductName(applied.productName)
          setArtboardFormatId(applied.artboard.formatId)
          setArtboard(applied.artboard)
          setArtboardBackground(applied.artboardBackground)
          const synced = syncFormValuesToElements(
            applied.elements,
            formVals,
            product.title
          )
          replaceElements(synced, true)
          setSelectedId(applied.selectedId)
        } else {
          replaceElements(defaultSeedElements(), true)
          setSelectedId("title")
        }
        if (searchParams.get("export") === "1") setExportOpen(true)
        setHydrated(true)
        return
      }

      if (fromEvent && eventId && category) {
        const draft = loadBuilderDraft(eventId)
        const setup = loadEventSetup(eventId)
        const itemName = draft?.basics?.eventName || setup?.eventName || "Tadbir materiali"
        setProductName(itemName)
        const eventCompiled = compileDefaultDesignTemplate(category)
        if (eventCompiled?.elements.length) {
          const eventArtboard = resolveArtboardForProduct(category)
          setArtboardFormatId(eventArtboard.formatId)
          setArtboard(eventArtboard)
          replaceElements(eventCompiled.elements.map((e) => normalizeElement(e)), true)
          setSelectedId(eventCompiled.elements[0]?.id ?? null)
        } else {
          const eventArtboard = resolveArtboardForProduct(category)
          setArtboardFormatId(eventArtboard.formatId)
          setArtboard(eventArtboard)
          replaceElements(elementsFromEventMaterial(eventId, category), true)
        }
        setHydrated(true)
        return
      }

      const fallback = resolveArtboardForProduct(templateId)
      setArtboardFormatId(fallback.formatId)
      setArtboard(fallback)
      replaceElements(defaultSeedElements(), true)
      setHydrated(true)
    }

    queueMicrotask(hydrate)
  }, [
    hydrated,
    loadKey,
    scope,
    fromCatalog,
    fromEvent,
    templateId,
    eventId,
    category,
    eventProductId,
    forceFreshOpen,
    replaceElements,
    searchParams,
  ])

  const selected = elements.find((e) => e.id === selectedId) ?? null

  const persistDesign = useCallback(
    async (status: EditorDesignStatus = designStatus) => {
      const activeScope = scopeRef.current
      const thumbnail = await captureDesignThumbnail({
        width: artboard.width,
        height: artboard.height,
        background: artboardBackground,
        elements,
      })
      const state = buildDesignState({
        productName,
        elements,
        artboard: {
          width: artboard.width,
          height: artboard.height,
          background: artboardBackground,
          formatId: artboardFormatId,
        },
        productType: templateId ?? category ?? undefined,
        eventId: eventId ?? undefined,
        category: category ?? undefined,
        status,
        thumbnail,
      })
      setDesignStatus(status)
      saveEditorDesign(activeScope, state, {
        source: fromEvent ? "event" : "catalog",
        productId: templateId ?? undefined,
        eventId: eventId ?? undefined,
        category: category ?? undefined,
        thumbnail,
      })
      if (fromCatalog && templateId) {
        const product = getProductById(templateId)
        if (product) {
          const draft = loadProductDraft(templateId)
          if (draft) saveProductDraft(product, draft.values)
        }
      }
      return state.updatedAt
    },
    [
      productName,
      elements,
      artboard,
      artboardFormatId,
      artboardBackground,
      fromCatalog,
      fromEvent,
      templateId,
      eventId,
      category,
      designStatus,
    ]
  )

  const { lastSavedAt, isSaving, markDirty, saveNow } = useAutoSave({
    enabled: hydrated,
    debounceMs: 2000,
    onSave: () => persistDesign("draft"),
  })

  useEffect(() => {
    if (hydrated) markDirty()
  }, [elements, productName, artboard, artboardFormatId, artboardBackground, hydrated, markDirty])

  const applyArtboardFormat = useCallback((formatId: string) => {
    const resolved = resolveArtboardFormat(formatId)
    setArtboardFormatId(resolved.formatId)
    setArtboard(resolved)
    queueMicrotask(() => canvasRef.current?.zoomToFit())
    markDirty()
  }, [markDirty])

  useEffect(() => {
    if (!hydrated) return
    queueMicrotask(() => canvasRef.current?.zoomToFit())
  }, [artboard.width, artboard.height, hydrated])

  const documentSettings = useMemo(
    () => ({
      productName,
      templateLabel,
      artboardFormatId,
      artboardWidth: artboard.width,
      artboardHeight: artboard.height,
      artboardLabel: artboard.label,
      artboardShortLabel: artboard.shortLabel,
      artboardPhysicalLabel: artboard.physicalLabel,
      artboardBackground,
    }),
    [productName, templateLabel, artboardFormatId, artboard, artboardBackground]
  )

  const applyDesignTemplate = useCallback(
    (productId: string) => {
      const product = getProductById(productId)
      if (!product) {
        toast.error("Shablon topilmadi")
        return
      }
      const formVals = getOrCreateDraftValues(product)
      const preview = toPreviewFormData(formVals)
      const compiled = compileDefaultDesignTemplate(productId, preview)
      if (!compiled) {
        toast.error("Shablon topilmadi")
        return
      }
      const resolved = resolveArtboardForProduct(productId)
      setArtboardFormatId(resolved.formatId)
      setArtboard(resolved)
      setTemplateFormValues(formVals)
      if (formVals.qrUrl) setQrInput(formVals.qrUrl)
      const normalized = compiled.elements.map((e) => normalizeElement(e))
      const synced = syncFormValuesToElements(normalized, formVals, product.title)
      replaceElements(synced, true)
      setSelectedId(synced.find((e) => e.type === "text" && !e.locked)?.id ?? synced[0]?.id ?? null)
      setProductName(getEditorProductName(product, formVals))
      toast.success("Shablon qo‘llandi")
      markDirty()
    },
    [replaceElements, markDirty]
  )

  const handleEditorSave = async () => {
    await persistDesign("saved")
    toast.success("Dizayn saqlandi")
  }

  const handleSaveDraft = async () => {
    await persistDesign("draft")
    toast.success("Qoralama saqlandi")
  }

  const handleBack = async () => {
    await persistDesign(designStatus)
    router.push(
      getEditorBackHref({ from, templateId, eventId, category })
    )
  }

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    try {
      const updatedAt = await persistDesign("draft")
      const state = buildDesignState({
        productName,
        elements,
        artboard: {
          width: artboard.width,
          height: artboard.height,
          background: artboardBackground,
          formatId: artboardFormatId,
        },
        productType: templateId ?? category ?? undefined,
        eventId: eventId ?? undefined,
        category: category ?? undefined,
        status: "draft",
        thumbnail: await captureDesignThumbnail({
          width: artboard.width,
          height: artboard.height,
          background: artboardBackground,
          elements,
        }),
      })
      state.updatedAt = updatedAt ?? state.updatedAt
      const { href } = duplicateEditorDesign(scopeRef.current, state, {
        from,
        templateId,
        eventId,
        category,
      })
      toast.success("Dizayn nusxasi yaratildi")
      router.push(href)
    } finally {
      setIsDuplicating(false)
    }
  }

  const exportContext = useMemo(
    () => ({
      designName: productName,
      width: artboard.width,
      height: artboard.height,
      background: artboardBackground,
      elements,
    }),
    [productName, artboard, artboardBackground, elements]
  )

  const addElement = useCallback(
    (el: CanvasElement) => {
      pushHistory([...elements, el])
      setSelectedId(el.id)
    },
    [elements, pushHistory]
  )

  const updateElement = useCallback(
    (id: string, patch: Partial<CanvasElement>) => {
      const next = elements.map((e) => (e.id === id ? { ...e, ...patch } : e))
      pushHistory(next)
    },
    [elements, pushHistory]
  )

  const replaceElementImage = useCallback(
    async (id: string, file: File) => {
      try {
        const { src } = await loadEditorImageFromFile(file)
        updateElement(id, { src })
        toast.success("Rasm yangilandi")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Rasm yuklanmadi")
      }
    },
    [updateElement]
  )

  const deleteElement = useCallback(
    (id: string) => {
      pushHistory(elements.filter((e) => e.id !== id))
      if (selectedId === id) setSelectedId(null)
    },
    [elements, pushHistory, selectedId]
  )

  const duplicateSelected = useCallback(
    (id: string) => {
      const source = elements.find((e) => e.id === id)
      if (!source) return
      const copy = duplicateElement(source)
      pushHistory([...elements, copy])
      setSelectedId(copy.id)
    },
    [elements, pushHistory]
  )

  const reorderElement = useCallback(
    (id: string, action: LayerReorderAction) => {
      const next = reorderElements(elements, id, action)
      if (next) pushHistory(next)
    },
    [elements, pushHistory]
  )

  useEffect(() => {
    if (!hydrated) return
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }
      if (e.key === "v" || e.key === "V") {
        setLeftTool("select")
        return
      }
      if (e.key === "h" || e.key === "H") {
        setLeftTool("hand")
        return
      }
      if (e.key === "Escape") {
        setSelectedId(null)
        return
      }
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        void handleEditorSave()
        return
      }
      if (!selectedId) return
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        deleteElement(selectedId)
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        duplicateSelected(selectedId)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [hydrated, selectedId, deleteElement, duplicateSelected])

  const centerOnArtboard = useCallback(
    (width: number, height: number) => ({
      x: Math.max(16, Math.round((artboard.width - width) / 2)),
      y: Math.max(16, Math.round((artboard.height - height) / 2)),
    }),
    [artboard]
  )

  const handleFileUpload = useCallback(
    async (
      files: FileList | null,
      type: "image" | "logo" | "signature" | "stamp",
      at?: { x: number; y: number }
    ) => {
      if (!files?.length) return
      const file = files[0]
      try {
        const { src, width: nw, height: nh } = await loadEditorImageFromFile(file)
        const maxW =
          type === "stamp" ? 120 : type === "signature" ? 200 : Math.min(artboard.width - 48, 320)
        const maxH =
          type === "stamp" ? 120 : type === "signature" ? 80 : Math.min(artboard.height - 48, 280)
        const { width, height } = fitImageElementSize(nw, nh, maxW, maxH)

        let position = at
        if (!position) {
          if (type === "logo") position = { x: 40, y: 40 }
          else if (type === "signature")
            position = { x: 80, y: Math.max(16, artboard.height - height - 24) }
          else if (type === "stamp")
            position = {
              x: Math.max(16, artboard.width - width - 24),
              y: Math.max(16, artboard.height - height - 24),
            }
          else position = centerOnArtboard(width, height)
        }

        const el = createImageElement(type, src, {
          ...position,
          width,
          height,
        })
        addElement(el)
        setLeftTool("select")
        toast.success(
          type === "logo"
            ? "Logo qo‘shildi"
            : type === "signature"
              ? "Imzo qo‘shildi"
              : type === "stamp"
                ? "Muhr qo‘shildi"
                : "Rasm qo‘shildi"
        )
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Fayl yuklanmadi")
      }
    },
    [addElement, artboard, centerOnArtboard]
  )

  const handleDropFiles = useCallback(
    (files: FileList, offsetX: number, offsetY: number) => {
      const w = 140
      const h = 100
      void handleFileUpload(files, "image", {
        x: Math.max(8, offsetX - w / 2),
        y: Math.max(8, offsetY - h / 2),
      })
    },
    [handleFileUpload]
  )

  const applyBrandToSelection = useCallback(
    (patch: Partial<CanvasElement>) => {
      if (!selectedId) {
        toast.message("Avval element tanlang")
        return
      }
      updateElement(selectedId, patch)
    },
    [selectedId, updateElement]
  )

  const toolActions = useMemo(
    () => ({
      onAddHeading: () =>
        addElement(
          createTextElement({
            name: "Sarlavha",
            label: "Sarlavha",
            fontSize: 32,
            fontWeight: 800,
            width: Math.min(artboard.width - 64, 480),
            height: 56,
            ...centerOnArtboard(Math.min(artboard.width - 64, 480), 56),
          })
        ),
      onAddSubheading: () =>
        addElement(
          createTextElement({
            name: "Quyi sarlavha",
            label: "Quyi sarlavha",
            fontSize: 22,
            fontWeight: 600,
            width: Math.min(artboard.width - 64, 400),
            height: 40,
            ...centerOnArtboard(Math.min(artboard.width - 64, 400), 40),
          })
        ),
      onAddParagraph: () =>
        addElement(
          createTextElement({
            name: "Paragraf",
            label: "Matn matni yoki {{event_name}}",
            fontSize: 14,
            fontWeight: 400,
            width: Math.min(artboard.width - 80, 360),
            height: 72,
            textAlign: "left",
            ...centerOnArtboard(Math.min(artboard.width - 80, 360), 72),
          })
        ),
      onAddCaption: () =>
        addElement(
          createTextElement({
            name: "Caption",
            label: "Kichik izoh",
            fontSize: 11,
            fontWeight: 500,
            color: "#64748b",
            width: 200,
            height: 24,
            ...centerOnArtboard(200, 24),
          })
        ),
      onUpload: (files: FileList, kind: "logo" | "signature" | "stamp" | "image") => {
        const at =
          kind === "logo"
            ? { x: 40, y: 40 }
            : kind === "signature"
              ? { x: 80, y: artboard.height - 120 }
              : kind === "stamp"
                ? { x: artboard.width - 120, y: artboard.height - 120 }
                : centerOnArtboard(140, 100)
        void handleFileUpload(files, kind, at)
      },
      onAddLine: () =>
        addElement(
          createShapeElement("line", {
            name: "Chiziq",
            x: 48,
            y: Math.round(artboard.height / 2),
            width: artboard.width - 96,
            height: 4,
            strokeWidth: 2,
            stroke: "#94a3b8",
          })
        ),
      onAddDivider: () =>
        addElement(
          createShapeElement("line", {
            name: "Ajratgich",
            x: 40,
            y: Math.round(artboard.height * 0.45),
            width: artboard.width - 80,
            height: 2,
            strokeWidth: 1,
            stroke: "#e2e8f0",
          })
        ),
      onAddBadge: () =>
        addElement(
          createShapeElement("rect", {
            name: "Bejik ramka",
            width: 128,
            height: 40,
            cornerRadius: 8,
            fill: "#f1f5f9",
            stroke: "#2563eb",
            strokeWidth: 2,
            ...centerOnArtboard(128, 40),
          })
        ),
      onAddFrame: () =>
        addElement(
          createShapeElement("rect", {
            name: "Foto ramka",
            width: 160,
            height: 120,
            cornerRadius: 4,
            fill: "transparent",
            stroke: "#cbd5e1",
            strokeWidth: 2,
            ...centerOnArtboard(160, 120),
          })
        ),
      onAddIconPlaceholder: () =>
        addElement(
          createImageElement("image", "", {
            name: "Icon",
            width: 48,
            height: 48,
            ...centerOnArtboard(48, 48),
          })
        ),
      onAddShape: (shape: "rectangle" | "rounded-rect" | "circle" | "line" | "blob") => {
        const pos = centerOnArtboard(120, 120)
        switch (shape) {
          case "rectangle":
            addElement(createShapeElement("rect", { x: pos.x, y: pos.y, width: 120, height: 120 }))
            break
          case "rounded-rect":
            addElement(
              createShapeElement("rect", {
                x: pos.x,
                y: pos.y,
                width: 140,
                height: 88,
                cornerRadius: 16,
                fill: "#2563eb22",
                stroke: "#2563eb",
              })
            )
            break
          case "circle":
            addElement(
              createShapeElement("ellipse", { x: pos.x, y: pos.y, width: 120, height: 120 })
            )
            break
          case "line":
            addElement(
              createShapeElement("line", {
                x: 60,
                y: pos.y + 60,
                width: artboard.width - 120,
                height: 4,
              })
            )
            break
          case "blob":
            addElement(
              createShapeElement("ellipse", {
                x: pos.x - 20,
                y: pos.y - 10,
                width: 180,
                height: 140,
                fill: "#7c3aed33",
                stroke: "#7c3aed",
                strokeWidth: 0,
              })
            )
            break
        }
      },
      onQrValueChange: setQrInput,
      onGenerateQr: () => {
        const size = 96
        addElement(
          createQrElement(qrInput, {
            width: size,
            height: size,
            ...centerOnArtboard(size, size),
          })
        )
      },
      onApplyTemplate: applyDesignTemplate,
      onUploadLogo: (files: FileList) => void handleFileUpload(files, "logo", { x: 40, y: 40 }),
      onUploadSignature: (files: FileList) =>
        void handleFileUpload(files, "signature", { x: 80, y: artboard.height - 100 }),
      onUploadStamp: (files: FileList) =>
        void handleFileUpload(files, "stamp", {
          x: artboard.width - 100,
          y: artboard.height - 100,
        }),
      onApplyBrandColor: (color: string) => {
        const el = elements.find((e) => e.id === selectedId)
        if (!el) {
          applyBrandToSelection({})
          return
        }
        if (el.type === "text") applyBrandToSelection({ color })
        else if (el.type === "shape" || el.type === "background") applyBrandToSelection({ fill: color })
        else if (el.type === "qr") applyBrandToSelection({ qrForeground: color, color })
      },
      onApplyBrandFont: (fontFamily: string) => applyBrandToSelection({ fontFamily }),
    }),
    [
      addElement,
      artboard,
      applyDesignTemplate,
      applyBrandToSelection,
      centerOnArtboard,
      elements,
      handleFileUpload,
      qrInput,
      selectedId,
    ]
  )

  const showCanvasEmptyHint = elements.filter((e) => !e.hidden).length === 0

  if (!hydrated) {
    return <EditorLoadingState />
  }

  return (
    <EditorMobileGate>
    <div className={editorChrome.shell}>
      <EditorToolbar
        productName={productName}
        formatLabel={artboard.label}
        formatShortLabel={artboard.shortLabel}
        backLabel={
          fromEvent
            ? "Event Builder"
            : fromCatalog
              ? "Shablonlar"
              : "Shablonlar"
        }
        onProductNameChange={setProductName}
        onBack={() => void handleBack()}
        onSave={() => void handleEditorSave()}
        onSaveDraft={() => void handleSaveDraft()}
        onDuplicate={() => void handleDuplicate()}
        onDeleteSelected={
          selectedId
            ? () => {
                deleteElement(selectedId)
                toast.message("Element o‘chirildi")
              }
            : undefined
        }
        onUndo={undo}
        onRedo={redo}
        onExport={async () => {
          await saveNow()
          setExportOpen(true)
        }}
        canUndo={canUndo}
        canRedo={canRedo}
        lastSavedAt={lastSavedAt}
        isSaving={isSaving}
        isDuplicating={isDuplicating}
      />

      <div className="flex min-h-0 flex-1">
        <EditorLeftPanel active={leftTool} onChange={setLeftTool}>
          <EditorToolsPanel
            tool={leftTool}
            templateId={templateId}
            templateFormValues={templateFormValues}
            onTemplateFieldChange={handleTemplateFieldChange}
            qrValue={qrInput}
            elements={elements}
            selectedId={selectedId}
            actions={toolActions}
            onSelect={setSelectedId}
            onUpdate={updateElement}
            onDelete={deleteElement}
            onDuplicate={duplicateSelected}
            onReorder={reorderElement}
          />
        </EditorLeftPanel>

        <EditorCanvas
          ref={canvasRef}
          productName={productName}
          zoom={zoom}
          onZoomChange={setZoom}
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateElement={updateElementLive}
          onCommitHistory={commitHistory}
          onDropFiles={handleDropFiles}
          artboardWidth={artboard.width}
          artboardHeight={artboard.height}
          artboardBackground={artboardBackground}
          interactionMode={interactionMode}
          showEmptyHint={showCanvasEmptyHint}
        />

        <EditorInspector
          selected={selected}
          elements={elements}
          selectedId={selectedId}
          documentSettings={documentSettings}
          onProductNameChange={setProductName}
          onArtboardFormatChange={applyArtboardFormat}
          onArtboardBackgroundChange={setArtboardBackground}
          onSelect={setSelectedId}
          onUpdate={updateElement}
          onDelete={deleteElement}
          onDuplicate={duplicateSelected}
          onReorder={reorderElement}
          onReplaceImage={replaceElementImage}
        />
      </div>

      <EditorStatusBar
        zoom={zoom}
        onZoomChange={setZoom}
        onZoomFit={() => canvasRef.current?.zoomToFit()}
        onZoomPreset={(p) => canvasRef.current?.zoomToPreset(p)}
        onZoomStep={(d) => canvasRef.current?.zoomByDelta(d)}
        artboardSize={`${artboard.shortLabel} · ${artboard.physicalLabel}`}
        selectedLabel={selected?.name ?? selected?.label}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      <ExportPanel
        trigger={null}
        open={exportOpen}
        onOpenChange={setExportOpen}
        design={exportContext}
      />

      <EditorShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
    </EditorMobileGate>
  )
}
