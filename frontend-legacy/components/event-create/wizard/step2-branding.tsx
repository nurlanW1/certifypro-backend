'use client'

import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'

import { AssetUploadField } from '@/components/uploads/asset-upload-field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WizardField } from '@/components/event-create/wizard/wizard-field'
import {
  FONT_OPTIONS,
  LANGUAGE_OPTIONS,
  type EventLanguage,
  type EventSetup,
} from '@/lib/event-create/event-setup'
import {
  serializedToStoredUpload,
  storedUploadToSerialized,
} from '@/lib/uploads/setup-bridge'
import { useEventWizardStore } from '@/store/event-wizard-store'
import { cn } from '@/lib/utils'

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

const LANGUAGE_FLAGS: Record<string, string> = {
  uz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
  'uz-en': '🇺🇿🇬🇧',
}

export function Step2Branding() {
  const { setup, updateSetup, patchColors } = useEventWizardStore()
  const [customColorOpen, setCustomColorOpen] = useState(false)
  const primary = setup.brandColors.primary

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <WizardField label="Logo">
          <AssetUploadField
            kind="logo"
            value={storedUploadToSerialized(setup.mainLogo, 'logo')}
            onChange={(serialized) =>
              updateSetup({ mainLogo: serializedToStoredUpload(serialized) })
            }
            hint="PNG, JPG, WEBP yoki SVG · maks. 5 MB"
          />
          {setup.mainLogo?.dataUrl ? (
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1 text-xs text-destructive"
              onClick={() => updateSetup({ mainLogo: null })}
            >
              <Trash2 className="size-3.5" />
              Logoni o&apos;chirish
            </button>
          ) : null}
        </WizardField>

        <div>
          <span className="text-xs font-semibold text-muted-foreground">Asosiy rang</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.name}
                onClick={() =>
                  patchColors({ primary: c.value, secondary: c.value, accent: '#3b82f6' })
                }
                className={cn(
                  'relative size-10 rounded-full border-2 transition-all duration-150',
                  primary === c.value
                    ? 'scale-110 border-primary'
                    : 'border-white shadow-sm'
                )}
                style={{ backgroundColor: c.value }}
              >
                {primary === c.value ? (
                  <Check className="absolute inset-0 m-auto size-4 text-white drop-shadow" />
                ) : null}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomColorOpen((v) => !v)}
              className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground transition-all duration-150 hover:bg-muted"
            >
              Maxsus rang
            </button>
          </div>
          {customColorOpen ? (
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <ColorInput
                label="Asosiy"
                value={setup.brandColors.primary}
                onChange={(v) => patchColors({ primary: v })}
              />
              <ColorInput
                label="Ikkinchi"
                value={setup.brandColors.secondary}
                onChange={(v) => patchColors({ secondary: v })}
              />
              <ColorInput
                label="Urg'u"
                value={setup.brandColors.accent}
                onChange={(v) => patchColors({ accent: v })}
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <WizardField label="Shrift">
            <Select
              value={setup.fontPreference || undefined}
              onValueChange={(val) =>
                updateSetup({ fontPreference: (val ?? '') as EventSetup['fontPreference'] })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Shrift" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </WizardField>
        </div>

        <WizardField label="Til">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LANGUAGE_OPTIONS.map((lang) => {
              const selected = setup.language === lang.value
              return (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => updateSetup({ language: lang.value as EventLanguage })}
                  className={cn(
                    'rounded-xl border p-3 text-center transition-all duration-150',
                    selected
                      ? 'border-2 border-primary bg-primary/10 ring-1 ring-primary/30'
                      : 'border-border bg-card hover:border-primary/40'
                  )}
                >
                  <span className="text-2xl">{LANGUAGE_FLAGS[lang.value] ?? '🌐'}</span>
                  <p className="mt-1 text-xs font-medium text-foreground">{lang.label}</p>
                </button>
              )
            })}
          </div>
        </WizardField>
      </div>

      <div className="lg:col-span-2">
        <span className="text-xs font-semibold text-muted-foreground">Ko&apos;rinish</span>
        <div
          className="mt-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-150"
          style={{ borderColor: primary }}
        >
          <div className="p-4" style={{ backgroundColor: primary }}>
            <div className="flex items-center gap-3">
              {setup.mainLogo?.dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={setup.mainLogo.dataUrl}
                  alt=""
                  className="size-10 rounded-lg bg-white/20 object-contain p-1"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
                  G
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">
                  {setup.eventName.trim() || 'Tadbir nomi'}
                </p>
                <p className="text-xs text-white/80">
                  {setup.organizationName.trim() || 'Tashkilot'}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-1 p-4 text-xs text-muted-foreground">
            <p>Sana: {setup.eventDate || '—'}</p>
            <p>Joy: {setup.eventLocation || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-semibold text-muted-foreground">{label}</span>
      <Input
        type="color"
        value={value}
        className="h-10 w-full cursor-pointer p-1"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
