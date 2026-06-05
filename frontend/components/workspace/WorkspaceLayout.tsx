'use client'

import { Suspense } from 'react'
import { WorkspaceTopBar } from './WorkspaceTopBar'
import { WorkspaceLeftPanel } from './WorkspaceLeftPanel'
import { WorkspaceCanvas } from './WorkspaceCanvas'
import { WorkspaceRightPanel } from './WorkspaceRightPanel'

interface WorkspaceLayoutProps {
  designId: string
  eventId?: string | null
}

export function WorkspaceLayout({ designId, eventId }: WorkspaceLayoutProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-canvas">
      <WorkspaceTopBar designId={designId} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex w-[240px] shrink-0 flex-col overflow-hidden border-r border-divide bg-canvas xl:w-[264px]">
          <WorkspaceLeftPanel designId={designId} eventId={eventId} />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-workspace-canvas">
          <WorkspaceCanvas />
        </div>

        <div className="w-[220px] shrink-0 overflow-y-auto border-l border-divide bg-canvas xl:w-[240px]">
          <Suspense fallback={<div className="h-full" />}>
            <WorkspaceRightPanel />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
