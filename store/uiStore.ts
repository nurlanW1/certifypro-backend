'use client'

import { create } from 'zustand'

interface UiStore {
  sidebarOpen: boolean
  mobileNavOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleMobileNav: () => void
  setMobileNavOpen: (open: boolean) => void
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  mobileNavOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}))
