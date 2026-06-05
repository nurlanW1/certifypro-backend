'use client'

import type { TemplateElement } from '@/lib/templates/types'

interface EditorPropertiesPanelProps {
  selectedElement: TemplateElement | null
  onUpdate: (patch: Partial<TemplateElement>) => void
}

export function EditorPropertiesPanel({ selectedElement, onUpdate }: EditorPropertiesPanelProps) {
  const textElement = selectedElement?.type === 'text' ? selectedElement : null
  const fill = selectedElement && 'fill' in selectedElement ? selectedElement.fill ?? '#ffffff' : '#ffffff'

  return (
    <aside className="hidden w-72 shrink-0 border-l border-divide bg-surface md:block">
      <div className="border-b border-divide px-4 py-3">
        <h2 className="text-sm font-semibold text-text-primary">Properties</h2>
      </div>
      <div className="space-y-5 p-4">
        {!selectedElement ? (
          <p className="text-sm text-text-muted">Select a layer to edit text, color, size, or position.</p>
        ) : (
          <>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Selected</p>
              <p className="truncate text-sm font-medium text-text-primary">{selectedElement.id}</p>
            </div>

            {textElement && (
              <>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-text-secondary">Text</span>
                  <textarea
                    value={textElement.text}
                    onChange={(event) => onUpdate({ text: event.target.value } as Partial<TemplateElement>)}
                    className="min-h-24 w-full rounded border border-divide bg-canvas px-3 py-2 text-sm text-text-primary"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-text-secondary">Font size</span>
                  <input
                    type="number"
                    min={8}
                    max={160}
                    value={textElement.fontSize}
                    onChange={(event) => onUpdate({ fontSize: Number(event.target.value) } as Partial<TemplateElement>)}
                    className="w-full rounded border border-divide bg-canvas px-3 py-2 text-sm"
                  />
                </label>
              </>
            )}

            {'fill' in selectedElement && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-text-secondary">Color</span>
                <input
                  type="color"
                  value={fill === 'transparent' ? '#ffffff' : fill}
                  onChange={(event) => onUpdate({ fill: event.target.value } as Partial<TemplateElement>)}
                  className="h-10 w-full rounded border border-divide bg-canvas"
                />
              </label>
            )}

            {'x' in selectedElement && (
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-1 block text-xs font-medium text-text-secondary">X</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(event) => onUpdate({ x: Number(event.target.value) } as Partial<TemplateElement>)}
                    className="w-full rounded border border-divide bg-canvas px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-medium text-text-secondary">Y</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(event) => onUpdate({ y: Number(event.target.value) } as Partial<TemplateElement>)}
                    className="w-full rounded border border-divide bg-canvas px-3 py-2 text-sm"
                  />
                </label>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
