'use client'

import { useRef, useState } from 'react'
import { Check, ImagePlus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/store/eventStore'

const PRESET_COLORS = [
  { name: 'Binafsha', value: '#534AB7' },
  { name: "Ko'k", value: '#2563EB' },
  { name: 'Yashil', value: '#059669' },
  { name: "To'q yashil", value: '#0F766E' },
  { name: 'Qizil', value: '#DC2626' },
  { name: "To'q sariq", value: '#D97706' },
  { name: 'Pushti', value: '#DB2777' },
  { name: 'Qora', value: '#1F2937' },
] as const

const LANGUAGES = [
  { value: 'uz' as const, label: "O'zbek", flag: '🇺🇿' },
  { value: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
  { value: 'en' as const, label: 'English', flag: '🇬🇧' },
]

const MAX_LOGO_BYTES = 2 * 1024 * 1024

export function Step2Branding() {
  const { formData, updateFormData } = useEventStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [customColorOpen, setCustomColorOpen] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)

  const primary = formData.primaryColor ?? '#534AB7'
  const accent = formData.accentColor ?? '#26215C'

  const handleLogoFile = (file: File | undefined) => {
    setLogoError(null)
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      setLogoError('Faqat PNG, JPG yoki SVG')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Fayl 2MB dan katta')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateFormData({ logoUrl: reader.result })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <div>
          <span className="gildia-label">Logo</span>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleLogoFile(e.dataTransfer.files[0])
            }}
            className={cn(
              'mt-1 flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-white p-6 transition-all duration-150',
              'hover:border-brand-400 hover:bg-brand-50'
            )}
          >
            {formData.logoUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.logoUrl}
                  alt="Logo preview"
                  className="max-h-24 max-w-[200px] object-contain"
                />
                <button
                  type="button"
                  className="absolute -right-2 -top-2 rounded-full bg-danger p-1.5 text-white shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateFormData({ logoUrl: undefined })
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <>
                <ImagePlus className="mb-2 h-8 w-8 text-brand-400" />
                <p className="text-sm font-medium text-text-primary">
                  Logoni shu yerga tashlang yoki bosing
                </p>
                <p className="mt-1 text-xs text-text-muted">PNG, SVG, JPG — max 2MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            className="hidden"
            onChange={(e) => handleLogoFile(e.target.files?.[0])}
          />
          {logoError ? <p className="mt-1 text-xs text-danger">{logoError}</p> : null}
        </div>

        <div>
          <span className="gildia-label">Asosiy rang</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.name}
                onClick={() =>
                  updateFormData({ primaryColor: c.value, accentColor: '#26215C' })
                }
                className={cn(
                  'relative h-10 w-10 rounded-full border-2 transition-all duration-150',
                  primary === c.value ? 'border-brand-600 scale-110' : 'border-white shadow-sm'
                )}
                style={{ backgroundColor: c.value }}
              >
                {primary === c.value ? (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                ) : null}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomColorOpen((v) => !v)}
              className="gildia-btn-secondary px-3 py-2 text-xs"
            >
              Maxsus rang
            </button>
          </div>
          {customColorOpen ? (
            <div className="mt-3 flex flex-wrap items-end gap-4">
              <div>
                <span className="gildia-label">Asosiy rang</span>
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => updateFormData({ primaryColor: e.target.value })}
                  className="mt-1 h-10 w-14 cursor-pointer rounded-lg border border-border"
                />
              </div>
              <div>
                <span className="gildia-label">Ikkinchi rang</span>
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => updateFormData({ accentColor: e.target.value })}
                  className="mt-1 h-10 w-14 cursor-pointer rounded-lg border border-border"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <span className="gildia-label">Til</span>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => {
              const selected = formData.language === lang.value
              return (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => updateFormData({ language: lang.value })}
                  className={cn(
                    'rounded-xl border p-3 text-center transition-all duration-150',
                    selected
                      ? 'border-2 border-brand-600 bg-brand-50'
                      : 'border border-border bg-white hover:border-brand-200'
                  )}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <p className="mt-1 text-xs font-medium text-text-primary">{lang.label}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <span className="gildia-label">Ko&apos;rinish</span>
        <div
          className="gildia-card mt-1 overflow-hidden transition-all duration-150"
          style={{ borderColor: primary }}
        >
          <div className="p-4" style={{ backgroundColor: primary }}>
            <div className="flex items-center gap-3">
              {formData.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.logoUrl}
                  alt=""
                  className="h-10 w-10 rounded-lg bg-white/20 object-contain p-1"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm text-white">
                  G
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">
                  {formData.name?.trim() || 'Tadbir nomi'}
                </p>
                <p className="text-xs text-white/80">
                  {formData.organization?.trim() || 'Tashkilot'}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-1 p-4 text-xs text-text-muted">
            <p>Sana: {formData.date || '—'}</p>
            <p>Joy: {formData.location || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
