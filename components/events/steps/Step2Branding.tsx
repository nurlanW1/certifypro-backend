'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/store/eventStore'
import { LANGUAGE_OPTIONS, PRESET_COLORS } from '@/components/events/wizard/constants'
import { Button } from '@/components/ui/Button'

const MAX_LOGO_BYTES = 2 * 1024 * 1024
const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml']

export function Step2Branding() {
  const { formData, updateFormData } = useEventStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [showCustomColor, setShowCustomColor] = useState(false)

  const primaryColor = formData.primaryColor ?? '#534AB7'
  const language = formData.language ?? 'uz'

  const handleLogoFile = useCallback(
    (file: File) => {
      setLogoError(null)
      if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
        setLogoError('Faqat PNG, SVG yoki JPG formatlari qabul qilinadi')
        return
      }
      if (file.size > MAX_LOGO_BYTES) {
        setLogoError('Fayl hajmi 2MB dan oshmasligi kerak')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateFormData({ logoUrl: reader.result })
        }
      }
      reader.readAsDataURL(file)
    },
    [updateFormData]
  )

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleLogoFile(file)
  }

  const selectPreset = (value: string) => {
    updateFormData({ primaryColor: value, accentColor: '#26215C' })
    setShowCustomColor(false)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-8">
        <div>
          <span className="gildia-label">Logo</span>
          {formData.logoUrl ? (
            <div className="mt-2 flex items-center gap-4 rounded-xl border border-border bg-surface-secondary p-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-border bg-surface">
                <Image
                  src={formData.logoUrl}
                  alt="Yuklangan logo"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">Logo yuklandi</p>
                <p className="text-xs text-text-muted">PNG, SVG yoki JPG • max 2MB</p>
              </div>
              <button
                type="button"
                onClick={() => updateFormData({ logoUrl: undefined })}
                className="rounded-lg p-2 text-danger hover:bg-danger-light"
                aria-label="Logoni o‘chirish"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-secondary px-6 py-12 text-center transition-all duration-150 hover:border-brand-400 hover:bg-brand-50"
            >
              <Upload className="mb-3 h-10 w-10 text-brand-600" />
              <p className="text-sm font-medium text-text-primary">
                Logoni shu yerga tashlang yoki bosing
              </p>
              <p className="mt-1 text-xs text-text-muted">PNG, SVG, JPG • maksimum 2MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleLogoFile(file)
            }}
          />
          {logoError && <p className="mt-2 text-xs text-danger">{logoError}</p>}
        </div>

        <div>
          <span className="gildia-label">Asosiy rang</span>
          <div className="mt-3 flex flex-wrap gap-3">
            {PRESET_COLORS.map((preset) => {
              const selected = primaryColor === preset.value && !showCustomColor
              return (
                <button
                  key={preset.value}
                  type="button"
                  title={preset.name}
                  onClick={() => selectPreset(preset.value)}
                  className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150',
                    preset.swatchClass,
                    selected && 'ring-2 ring-brand-600 ring-offset-2'
                  )}
                >
                  {selected && <Check className="h-4 w-4 text-text-inverse" />}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowCustomColor((v) => !v)}
            >
              Maxsus rang
            </Button>
            {showCustomColor && (
              <input
                type="color"
                className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-surface p-1"
                value={primaryColor}
                onChange={(e) => updateFormData({ primaryColor: e.target.value })}
                aria-label="Maxsus rang tanlash"
              />
            )}
          </div>
        </div>

        <div>
          <span className="gildia-label">Til</span>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {LANGUAGE_OPTIONS.map((lang) => {
              const selected = language === lang.value
              return (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => updateFormData({ language: lang.value })}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 transition-all duration-150',
                    selected
                      ? 'border-2 border-brand-600 bg-brand-50 shadow-sm'
                      : 'border border-border bg-surface hover:border-brand-200'
                  )}
                >
                  <span className="text-2xl" aria-hidden>
                    {lang.flag}
                  </span>
                  <span className="text-sm font-medium text-text-primary">{lang.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="gildia-label mb-3">Ko‘rinish preview</p>
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-md">
          <div
            className="px-4 py-5 text-text-inverse"
            style={{ backgroundColor: primaryColor }}
          >
            {formData.logoUrl ? (
              <div className="relative mb-3 h-10 w-10 overflow-hidden rounded bg-white/20">
                <Image
                  src={formData.logoUrl}
                  alt=""
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
            ) : (
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-white/20 text-xs font-medium">
                Logo
              </div>
            )}
            <p className="text-sm font-semibold leading-snug">
              {formData.name?.trim() || 'Tadbir nomi'}
            </p>
            <p className="mt-1 text-xs opacity-90">
              {formData.organization?.trim() || 'Tashkilot nomi'}
            </p>
          </div>
          <div className="space-y-2 px-4 py-4">
            <div className="h-2 rounded-full bg-brand-100" />
            <div className="h-2 w-3/4 rounded-full bg-surface-tertiary" />
            <p className="pt-2 text-xs text-text-muted">
              Til: {LANGUAGE_OPTIONS.find((l) => l.value === language)?.label}
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
