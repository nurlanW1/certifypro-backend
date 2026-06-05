'use client'

import { Trash2 } from 'lucide-react'
import { fabric } from 'fabric'
import { ColorPicker } from '@/components/editor/ColorPicker'
import { useEditorStore } from '@/store/editorStore'
import { AVAILABLE_FONTS, loadGoogleFont } from '@/lib/editor/fontLoader'
import { cn } from '@/lib/utils'

const WEIGHTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
]

function getTextObject(obj: fabric.Object | null): fabric.IText | null {
  if (!obj) return null
  if (obj instanceof fabric.IText) return obj
  return null
}

export function TextProperties() {
  const { fabricCanvas, selectedObject, setSelectedObject, pushHistory } = useEditorStore()
  const text = getTextObject(selectedObject)

  if (!text || !fabricCanvas) return null

  const update = (props: Partial<fabric.IText>) => {
    text.set(props)
    text.setCoords()
    fabricCanvas.requestRenderAll()
    pushHistory()
  }

  const fill = (text.fill as string) ?? '#26215C'
  const stroke = (text.stroke as string) ?? '#26215C'
  const strokeWidth = text.strokeWidth ?? 0
  const opacity = Math.round((text.opacity ?? 1) * 100)

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="font-family" className="gildia-label">
          Shrift
        </label>
        <select
          id="font-family"
          className="gildia-input mt-1"
          value={text.fontFamily ?? 'Inter'}
          onChange={(e) => {
            const family = e.target.value
            void loadGoogleFont(family).then(() => update({ fontFamily: family }))
          }}
        >
          {AVAILABLE_FONTS.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="font-size" className="gildia-label">
          O&apos;lcham
        </label>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            className="gildia-btn-secondary px-3 py-2"
            onClick={() => update({ fontSize: Math.max(8, (text.fontSize ?? 24) - 2) })}
          >
            −
          </button>
          <input
            id="font-size"
            type="number"
            min={8}
            max={144}
            className="gildia-input text-center"
            value={text.fontSize ?? 24}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
          />
          <button
            type="button"
            className="gildia-btn-secondary px-3 py-2"
            onClick={() => update({ fontSize: Math.min(144, (text.fontSize ?? 24) + 2) })}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <span className="gildia-label">Og&apos;irlik</span>
        <div className="mt-1 flex gap-1">
          {WEIGHTS.map((w) => (
            <button
              key={w.value}
              type="button"
              onClick={() => update({ fontWeight: w.value })}
              className={cn(
                'flex-1 rounded-lg border py-2 text-xs font-medium transition-all duration-150',
                text.fontWeight === w.value
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-border text-text-muted hover:border-brand-200'
              )}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="gildia-label">Tekislash</span>
        <div className="mt-1 flex gap-1">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => update({ textAlign: align })}
              className={cn(
                'flex-1 rounded-lg border py-2 text-xs transition-all duration-150',
                text.textAlign === align
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-border text-text-muted'
              )}
            >
              {align === 'left' ? '←' : align === 'center' ? '=' : '→'}
            </button>
          ))}
        </div>
      </div>

      <ColorPicker
        label="Matn rangi"
        color={fill.startsWith('#') ? fill : '#26215C'}
        onChange={(c) => update({ fill: c })}
      />

      <div>
        <label htmlFor="stroke-width" className="gildia-label">
          Outline ({strokeWidth}px)
        </label>
        <input
          id="stroke-width"
          type="range"
          min={0}
          max={10}
          value={strokeWidth}
          className="mt-2 w-full accent-accent"
          onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
        />
        <ColorPicker
          color={stroke.startsWith('#') ? stroke : '#26215C'}
          onChange={(c) => update({ stroke: c })}
        />
      </div>

      <div>
        <label htmlFor="text-opacity" className="gildia-label">
          Shaffoflik ({opacity}%)
        </label>
        <input
          id="text-opacity"
          type="range"
          min={0}
          max={100}
          value={opacity}
          className="mt-2 w-full accent-brand-600"
          onChange={(e) => update({ opacity: Number(e.target.value) / 100 })}
        />
      </div>

      <button
        type="button"
        onClick={() => {
          fabricCanvas.remove(text)
          fabricCanvas.discardActiveObject()
          fabricCanvas.requestRenderAll()
          setSelectedObject(null)
          pushHistory()
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger-light py-2.5 text-sm font-medium text-danger transition-all duration-150 hover:bg-danger/10"
      >
        <Trash2 className="h-4 w-4" />
        O&apos;chirish
      </button>
    </div>
  )
}
