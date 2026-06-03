"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Options = {
  enabled?: boolean
  debounceMs?: number
  onSave: () => string | void | Promise<string | void>
}

export function useAutoSave({ enabled = true, debounceMs = 1500, onSave }: Options) {
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSaveRef = useRef(onSave)
  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  const markDirty = useCallback(() => {
    setIsDirty(true)
  }, [])

  const saveNow = useCallback(async () => {
    if (!enabled) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsSaving(true)
    try {
      const result = await onSaveRef.current()
      setLastSavedAt(typeof result === "string" ? result : new Date().toISOString())
      setIsDirty(false)
    } finally {
      setIsSaving(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !isDirty) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      void saveNow()
    }, debounceMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isDirty, enabled, debounceMs, saveNow])

  useEffect(() => {
    if (!enabled) return
    const flush = () => {
      if (isDirty) void onSaveRef.current()
    }
    window.addEventListener("beforeunload", flush)
    return () => window.removeEventListener("beforeunload", flush)
  }, [enabled, isDirty])

  return { lastSavedAt, isSaving, isDirty, markDirty, saveNow, setIsDirty }
}
