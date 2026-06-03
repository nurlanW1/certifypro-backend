"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import type { CatalogProduct } from "./types"
import {
  getOrCreateDraftValues,
  saveProductDraft,
  type ProductDraft,
} from "./product-draft-storage"

const AUTOSAVE_MS = 600

export function useProductDraft(product: CatalogProduct) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    getOrCreateDraftValues(product)
  )
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const persist = useCallback(
    (next: Record<string, string>) => {
      saveProductDraft(product, next)
      setLastSaved(new Date().toISOString())
      setIsDirty(false)
    },
    [product]
  )

  const setField = useCallback((key: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value }
      return next
    })
    setIsDirty(true)
  }, [])

  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    persist(values)
  }, [persist, values])

  useEffect(() => {
    if (!isDirty) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      persist(values)
    }, AUTOSAVE_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [values, isDirty, persist])

  useEffect(() => {
    const onBeforeUnload = () => {
      if (isDirty) saveProductDraft(product, values)
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [product, values, isDirty])

  return {
    values,
    setField,
    setValues,
    saveNow,
    isDirty,
    lastSaved,
    persist,
  }
}

export type { ProductDraft }
