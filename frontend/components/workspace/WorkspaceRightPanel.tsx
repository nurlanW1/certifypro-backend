'use client'

import { EditorProperties } from '@/components/editor/EditorProperties'

export function WorkspaceRightPanel() {
  return (
    <div className="flex h-full flex-col">
      <EditorProperties embedded />
    </div>
  )
}
