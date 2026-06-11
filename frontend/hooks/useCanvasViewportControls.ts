'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

interface CanvasViewportControlsOptions {
  containerRef: RefObject<HTMLElement>
  contentRef?: RefObject<HTMLElement>
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
  contentRef,
  zoom,
  setZoom,
  minZoom = 0.3,
  maxZoom = 3,
  leftPanEnabled = false,
}: CanvasViewportControlsOptions) {
  const [isPanning, setIsPanning] = useState(false)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const zoomRef = useRef(zoom)
  const panOffsetRef = useRef(panOffset)
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
    panOffsetRef.current = panOffset
  }, [panOffset])

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
      const nextOffset = {
        x: panOffsetRef.current.x + event.clientX - pan.clientX,
        y: panOffsetRef.current.y + event.clientY - pan.clientY,
      }
      panOffsetRef.current = nextOffset
      setPanOffset(nextOffset)
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

      const content = contentRef?.current
      const previousBounds = content?.getBoundingClientRect()
      const contentX = previousBounds
        ? (event.clientX - previousBounds.left) / currentZoom
        : null
      const contentY = previousBounds
        ? (event.clientY - previousBounds.top) / currentZoom
        : null

      zoomRef.current = nextZoom
      setZoom(nextZoom)
      if (content && contentX !== null && contentY !== null) {
        requestAnimationFrame(() => {
          const nextBounds = content.getBoundingClientRect()
          const nextOffset = {
            x:
              panOffsetRef.current.x +
              event.clientX -
              contentX * nextZoom -
              nextBounds.left,
            y:
              panOffsetRef.current.y +
              event.clientY -
              contentY * nextZoom -
              nextBounds.top,
          }
          panOffsetRef.current = nextOffset
          setPanOffset(nextOffset)
        })
      }
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
  }, [containerRef, contentRef, leftPanEnabled, maxZoom, minZoom, setZoom])

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

    const releaseSpace = () => {
      spacePressedRef.current = false
      setIsSpacePressed(false)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') releaseSpace()
    }
    const onWindowBlur = () => releaseSpace()

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onWindowBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onWindowBlur)
    }
  }, [maxZoom, minZoom, setZoom])

  const resetPan = () => {
    const origin = { x: 0, y: 0 }
    panOffsetRef.current = origin
    setPanOffset(origin)
  }

  return { isPanning, isSpacePressed, panOffset, resetPan }
}
