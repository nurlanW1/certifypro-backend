'use client'

import { useState, useRef, useEffect } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

const PRESETS = [
  '#F2F2F2', '#A8A8A8', '#666666', '#0F0F0F',
  '#7B68EE', '#EF4444', '#22C55E', '#F59E0B',
  '#3B82F6', '#EC4899', '#14B8A6', '#F97316',
]

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const normalized = color.startsWith('#') ? color : '#7B68EE'

  return (
    <div ref={ref} className="relative">
      {label && <p className="label-caps mb-2">{label}</p>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="h-8 w-8 shrink-0 rounded border border-divide transition-colors hover:border-text-disabled"
          style={{ background: normalized }}
          aria-label="Rang tanlash"
        />
        <HexColorInput
          color={normalized}
          onChange={onChange}
          prefixed
          className="input flex-1 py-1.5 font-mono text-xs"
        />
      </div>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 rounded border border-divide bg-ink p-3 shadow-lg">
          <HexColorPicker color={normalized} onChange={onChange} />
          <div className="mt-3 grid grid-cols-6 gap-1 border-t border-divide pt-3">
            {PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                className="h-5 w-5 rounded border-2 transition-transform hover:scale-110"
                style={{
                  background: c,
                  borderColor: normalized === c ? '#F2F2F2' : 'transparent',
                }}
                aria-label={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
