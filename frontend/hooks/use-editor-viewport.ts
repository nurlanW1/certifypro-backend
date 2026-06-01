"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  centerArtboard,
  clampZoom,
  computeFitView,
  type ViewportPoint,
  zoomAtScreenPoint,
  ZOOM_MAX,
  ZOOM_MIN,
} from "@/lib/editor/viewport-math"

type PanSession = {
  pointerId: number
  startClientX: number
  startClientY: number
  startPanX: number
  startPanY: number
}

type Options = {
  zoom: number
  onZoomChange: (zoom: number) => void
  artboardWidth: number
  artboardHeight: number
  /** When true, left-drag pans instead of selecting (hand tool) */
  handToolActive?: boolean
}

export function useEditorViewport({
  zoom,
  onZoomChange,
  artboardWidth,
  artboardHeight,
  handToolActive = false,
}: Options) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState<ViewportPoint>({ x: 0, y: 0 })
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [smoothTransform, setSmoothTransform] = useState(false)

  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)
  const panSessionRef = useRef<PanSession | null>(null)
  const spaceHeldRef = useRef(false)

  useEffect(() => {
    panRef.current = pan
  }, [pan])

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  const getViewportRect = useCallback(() => {
    return viewportRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0)
  }, [])

  const applyZoomPan = useCallback(
    (nextZoom: number, nextPan: ViewportPoint, smooth = false) => {
      setSmoothTransform(smooth)
      onZoomChange(clampZoom(nextZoom))
      setPan(nextPan)
    },
    [onZoomChange]
  )

  const centerView = useCallback(
    (nextZoom = zoomRef.current, smooth = false) => {
      const rect = getViewportRect()
      if (!rect.width) return
      applyZoomPan(nextZoom, centerArtboard(rect.width, rect.height, artboardWidth, artboardHeight, nextZoom), smooth)
    },
    [applyZoomPan, artboardWidth, artboardHeight, getViewportRect]
  )

  const zoomToFit = useCallback(() => {
    const rect = getViewportRect()
    if (!rect.width) return
    const { zoom: z, pan: p } = computeFitView(rect.width, rect.height, artboardWidth, artboardHeight)
    applyZoomPan(z, p, true)
  }, [applyZoomPan, artboardWidth, artboardHeight, getViewportRect])

  const zoomToPreset = useCallback(
    (preset: number) => {
      const rect = getViewportRect()
      if (!rect.width) {
        onZoomChange(clampZoom(preset))
        return
      }
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const { zoom: z, pan: p } = zoomAtScreenPoint(
        zoomRef.current,
        panRef.current,
        cx,
        cy,
        rect,
        preset / zoomRef.current
      )
      applyZoomPan(z, p, true)
    },
    [applyZoomPan, getViewportRect, onZoomChange]
  )

  const zoomByDelta = useCallback(
    (delta: number) => {
      const rect = getViewportRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const factor = delta > 0 ? 1.12 : 1 / 1.12
      const { zoom: z, pan: p } = zoomAtScreenPoint(
        zoomRef.current,
        panRef.current,
        cx,
        cy,
        rect,
        factor
      )
      applyZoomPan(z, p, true)
    },
    [applyZoomPan, getViewportRect]
  )

  const zoomAtWheel = useCallback(
    (clientX: number, clientY: number, deltaY: number) => {
      const rect = getViewportRect()
      const factor = deltaY < 0 ? 1.08 : 1 / 1.08
      const { zoom: z, pan: p } = zoomAtScreenPoint(
        zoomRef.current,
        panRef.current,
        clientX,
        clientY,
        rect,
        factor
      )
      setSmoothTransform(false)
      onZoomChange(z)
      setPan(p)
    },
    [getViewportRect, onZoomChange]
  )

  const endPan = useCallback(() => {
    panSessionRef.current = null
    setIsPanning(false)
  }, [])

  const onPanPointerMove = useCallback((e: PointerEvent) => {
    const session = panSessionRef.current
    if (!session || e.pointerId !== session.pointerId) return
    const dx = e.clientX - session.startClientX
    const dy = e.clientY - session.startClientY
    setSmoothTransform(false)
    setPan({
      x: session.startPanX + dx,
      y: session.startPanY + dy,
    })
  }, [])

  const startPan = useCallback(
    (e: React.PointerEvent) => {
      const el = viewportRef.current
      if (!el) return
      panSessionRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startPanX: panRef.current.x,
        startPanY: panRef.current.y,
      }
      setIsPanning(true)
      setSmoothTransform(false)
      el.setPointerCapture(e.pointerId)
    },
    []
  )

  const handToolRef = useRef(handToolActive)
  useEffect(() => {
    handToolRef.current = handToolActive
  }, [handToolActive])

  const shouldStartPan = useCallback((e: React.PointerEvent) => {
    if (e.button === 2) return true
    if (e.button === 0 && (spaceHeldRef.current || handToolRef.current)) return true
    return false
  }, [])

  const onViewportPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (shouldStartPan(e)) {
        e.preventDefault()
        e.stopPropagation()
        startPan(e)
        return
      }
      if (e.button === 0 && !spaceHeldRef.current && e.target === e.currentTarget) {
        // handled by parent for deselect
      }
    },
    [shouldStartPan, startPan]
  )

  const onViewportPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (panSessionRef.current?.pointerId === e.pointerId) {
        onPanPointerMove(e.nativeEvent)
      }
    },
    [onPanPointerMove]
  )

  const onViewportPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (panSessionRef.current?.pointerId === e.pointerId) {
        viewportRef.current?.releasePointerCapture(e.pointerId)
        endPan()
      }
    },
    [endPan]
  )

  const screenToArtboard = useCallback(
    (clientX: number, clientY: number) => {
      const rect = getViewportRect()
      const scale = zoomRef.current / 100
      return {
        x: (clientX - rect.left - panRef.current.x) / scale,
        y: (clientY - rect.top - panRef.current.y) / scale,
      }
    },
    [getViewportRect]
  )

  const viewportCursor = isPanning
    ? "grabbing"
    : spaceHeld
      ? "grab"
      : "default"

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return
      e.preventDefault()
      spaceHeldRef.current = true
      setSpaceHeld(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceHeldRef.current = false
        setSpaceHeld(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      zoomAtWheel(e.clientX, e.clientY, e.deltaY)
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [zoomAtWheel])

  const viewInitialized = useRef(false)
  useEffect(() => {
    if (viewInitialized.current) return
    const id = requestAnimationFrame(() => {
      centerView(zoomRef.current, false)
      viewInitialized.current = true
    })
    return () => cancelAnimationFrame(id)
  }, [centerView])

  useEffect(() => {
    if (!isPanning) return
    const move = (e: PointerEvent) => onPanPointerMove(e)
    const up = (e: PointerEvent) => {
      if (panSessionRef.current?.pointerId === e.pointerId) endPan()
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", up)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
    }
  }, [isPanning, onPanPointerMove, endPan])

  return {
    viewportRef,
    pan,
    scale: zoom / 100,
    smoothTransform,
    viewportCursor,
    spaceHeld,
    isPanning,
    screenToArtboard,
    onViewportPointerDown,
    onViewportPointerMove,
    onViewportPointerUp,
    onViewportContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    shouldStartPan,
    startPan,
    zoomToFit,
    zoomToPreset,
    zoomByDelta,
    centerView,
    ZOOM_MIN,
    ZOOM_MAX,
  }
}
