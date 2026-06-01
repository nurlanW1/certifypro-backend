"use client"

import { Suspense } from "react"

import { EditorLoadingState } from "@/components/editor/editor-ui-states"
import { EditorShell } from "@/components/editor/editor-shell"
import { CatalogDesignBanner } from "@/components/editor/catalog-design-banner"
import { EventCreateBanner } from "@/components/editor/event-create-banner"

function EditorContent() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <EventCreateBanner />
      <CatalogDesignBanner />
      <div className="min-h-0 flex-1">
        <EditorShell />
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoadingState label="Editor yuklanmoqda…" />}>
      <EditorContent />
    </Suspense>
  )
}
