"use client"

import { useCallback, useRef, useState } from "react"

import type { CanvasElement } from "@/lib/editor/canvas-types"

export function useCanvasHistory(initial: CanvasElement[]) {
  const [elements, setElements] = useState<CanvasElement[]>(initial)
  const historyRef = useRef<CanvasElement[][]>([initial])
  const indexRef = useRef(0)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const sync = () => {
    setCanUndo(indexRef.current > 0)
    setCanRedo(indexRef.current < historyRef.current.length - 1)
  }

  const pushHistory = useCallback((next: CanvasElement[]) => {
    setElements(next)
    const slice = historyRef.current.slice(0, indexRef.current + 1)
    slice.push(next)
    historyRef.current = slice
    indexRef.current = slice.length - 1
    sync()
  }, [])

  const replaceElements = useCallback((next: CanvasElement[], resetHistory = false) => {
    setElements(next)
    if (resetHistory) {
      historyRef.current = [next]
      indexRef.current = 0
      sync()
    }
  }, [])

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return
    indexRef.current -= 1
    setElements(historyRef.current[indexRef.current] ?? [])
    sync()
  }, [])

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return
    indexRef.current += 1
    setElements(historyRef.current[indexRef.current] ?? [])
    sync()
  }, [])

  const updateElementLive = useCallback((id: string, patch: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }, [])

  const commitHistory = useCallback(() => {
    setElements((prev) => {
      const slice = historyRef.current.slice(0, indexRef.current + 1)
      slice.push(prev.map((e) => ({ ...e })))
      historyRef.current = slice
      indexRef.current = slice.length - 1
      sync()
      return prev
    })
  }, [])

  return {
    elements,
    pushHistory,
    replaceElements,
    updateElementLive,
    commitHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
