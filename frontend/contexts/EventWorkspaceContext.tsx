'use client'

import { createContext, useContext } from 'react'
import type { Event } from '@/types/event'

interface EventWorkspaceContextValue {
  event: Event
  loading: boolean
  error: string | null
  refresh: () => void
}

export const EventWorkspaceContext = createContext<EventWorkspaceContextValue | null>(null)

export function useEventWorkspace() {
  const ctx = useContext(EventWorkspaceContext)
  if (!ctx) {
    throw new Error('useEventWorkspace must be used within EventWorkspaceShell')
  }
  return ctx
}
