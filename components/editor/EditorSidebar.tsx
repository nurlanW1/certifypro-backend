'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { Type, Image, Square } from 'lucide-react'

export function EditorSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-l border-border bg-white">
      <Tabs.Root defaultValue="elements" className="flex h-full flex-col">
        <Tabs.List className="flex border-b border-border">
          <Tabs.Trigger
            value="elements"
            className="flex-1 px-3 py-2.5 text-xs font-medium text-text-muted data-[state=active]:border-b-2 data-[state=active]:border-brand-600 data-[state=active]:text-brand-800"
          >
            Elementlar
          </Tabs.Trigger>
          <Tabs.Trigger
            value="layers"
            className="flex-1 px-3 py-2.5 text-xs font-medium text-text-muted data-[state=active]:border-b-2 data-[state=active]:border-brand-600 data-[state=active]:text-brand-800"
          >
            Qatlamlar
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="elements" className="flex-1 space-y-2 p-4">
          {[
            { icon: Type, label: 'Matn' },
            { icon: Image, label: 'Rasm' },
            { icon: Square, label: 'Shakl' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm text-text-primary hover:bg-brand-50"
            >
              <Icon className="h-4 w-4 text-brand-600" />
              {label}
            </button>
          ))}
        </Tabs.Content>
        <Tabs.Content value="layers" className="p-4 text-sm text-text-muted">
          Qatlamlar ro&apos;yxati
        </Tabs.Content>
      </Tabs.Root>
    </aside>
  )
}
