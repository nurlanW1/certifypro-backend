'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

interface CanvasViewportControlsOptions {
  containerRef: RefObject<HTMLElement>
  zoom: number
  setZoom: (zoom: number) => void
  minZoom?: number
  maxZoom?: number
  leftPanEnabled?: boolean
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

export function useCanvasViewportControls({
  containerRef,
  zoom,
  setZoom,
  minZoom = 0.3,
  maxZoom = 3,
  leftPanEnabled = false,
}: CanvasViewportControlsOptions) {
  const [isPanning, setIsPanning] = useState(false)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const zoomRef = useRef(zoom)
  const spacePressedRef = useRef(false)
  const panRef = useRef<{
    pointerId: number
    clientX: number
    clientY: number
  } | null>(null)

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const stopPan = (event?: PointerEvent) => {
      const pan = panRef.current
      if (!pan || (event && event.pointerId !== pan.pointerId)) return
      if (container.hasPointerCapture(pan.pointerId)) {
        container.releasePointerCapture(pan.pointerId)
      }
      panRef.current = null
      setIsPanning(false)
    }

    const onPointerDown = (event: PointerEvent) => {
      const shouldPan =
        event.button === 2 ||
        event.button === 1 ||
        (event.button === 0 && (leftPanEnabled || spacePressedRef.current))
      if (!shouldPan) return

      event.preventDefault()
      event.stopPropagation()
      panRef.current = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
      }
      container.setPointerCapture(event.pointerId)
      setIsPanning(true)
    }

    const onPointerMove = (event: PointerEvent) => {
      const pan = panRef.current
      if (!pan || pan.pointerId !== event.pointerId) return
      event.preventDefault()
      container.scrollLeft -= event.clientX - pan.clientX
      container.scrollTop -= event.clientY - pan.clientY
      pan.clientX = event.clientX
      pan.clientY = event.clientY
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const currentZoom = zoomRef.current
      const direction = event.deltaY < 0 ? 1 : -1
      const nextZoom = Math.min(
        maxZoom,
        Math.max(minZoom, Number((currentZoom + direction * 0.1).toFixed(2)))
      )
      if (nextZoom === currentZoom) return

      const bounds = container.getBoundingClientRect()
      const localX = event.clientX - bounds.left
      const localY = event.clientY - bounds.top
      const contentX = (container.scrollLeft + localX) / currentZoom
      const contentY = (container.scrollTop + localY) / currentZoom

      zoomRef.current = nextZoom
      setZoom(nextZoom)
      requestAnimationFrame(() => {
        container.scrollLeft = contentX * nextZoom - localX
        container.scrollTop = contentY * nextZoom - localY
      })
    }

    const onContextMenu = (event: MouseEvent) => event.preventDefault()

    container.addEventListener('pointerdown', onPointerDown, true)
    container.addEventListener('pointermove', onPointerMove, true)
    container.addEventListener('pointerup', stopPan, true)
    container.addEventListener('pointercancel', stopPan, true)
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('contextmenu', onContextMenu)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown, true)
      container.removeEventListener('pointermove', onPointerMove, true)
      container.removeEventListener('pointerup', stopPan, true)
      container.removeEventListener('pointercancel', stopPan, true)
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('contextmenu', onContextMenu)
    }
  }, [containerRef, leftPanEnabled, maxZoom, minZoom, setZoom])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault()
        spacePressedRef.current = true
        setIsSpacePressed(true)
        return
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return

      const isZoomIn = event.key === '+' || event.key === '=' || event.code === 'NumpadAdd'
      const isZoomOut = event.key === '-' || event.code === 'NumpadSubtract'
      if (!isZoomIn && !isZoomOut) return

      event.preventDefault()
      const delta = isZoomIn ? 0.1 : -0.1
      const nextZoom = Math.min(
        maxZoom,
        Math.max(minZoom, Number((zoomRef.current + delta).toFixed(2)))
      )
      zoomRef.current = nextZoom
      setZoom(nextZoom)
    }

    const releaseSpace = (event?: KeyboardEvent) => {
      if (event && event.code !== 'Space') return
      spacePressedRef.current = false
      setIsSpacePressed(false)
    }
    const onWindowBlur = () => releaseSpace()

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', releaseSpace)
    window.addEventListener('blur', onWindowBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', releaseSpace)
      window.removeEventListener('blur', onWindowBlur)
    }
  }, [maxZoom, minZoom, setZoom])

  return { isPanning, isSpacePressed }
}
