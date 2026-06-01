"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ARTBOARD_FORMAT_GROUPS,
  FORMAT_BY_ID,
  physicalSizeLabel,
  resolveArtboardFormat,
  type ArtboardFormatId,
} from "@/lib/editor/product-artboards"

import {
  ColorField,
  InspectorDivider,
  InspectorField,
  InspectorSection,
  inspectorInput,
} from "./inspector-primitives"

export type DocumentSettings = {
  productName: string
  templateLabel: string
  artboardFormatId: string
  artboardWidth: number
  artboardHeight: number
  artboardLabel: string
  artboardShortLabel: string
  artboardPhysicalLabel: string
  artboardBackground: string
}

type Props = {
  settings: DocumentSettings
  onProductNameChange: (name: string) => void
  onArtboardFormatChange: (formatId: ArtboardFormatId) => void
  onArtboardBackgroundChange: (color: string) => void
}

export function DocumentSettingsPanel({
  settings,
  onProductNameChange,
  onArtboardFormatChange,
  onArtboardBackgroundChange,
}: Props) {
  const isCustom = settings.artboardFormatId === "custom"

  return (
    <div className="space-y-4">
      <InspectorSection title="Hujjat">
        <InspectorField label="Dizayn nomi">
          <Input
            value={settings.productName}
            onChange={(e) => onProductNameChange(e.target.value)}
            className={inspectorInput}
          />
        </InspectorField>
        <InspectorField label="Mahsulot / shablon">
          <Input
            value={settings.templateLabel}
            readOnly
            className={`${inspectorInput} bg-[#f8f9fb] text-[#64748b]`}
          />
        </InspectorField>
      </InspectorSection>

      <InspectorDivider />

      <InspectorSection title="Artboard formati">
        <InspectorField label="Format">
          <Select
            value={isCustom ? "custom" : settings.artboardFormatId}
            onValueChange={(id) => {
              if (!id || id === "custom") return
              onArtboardFormatChange(id as ArtboardFormatId)
            }}
          >
            <SelectTrigger className={inspectorInput}>
              <SelectValue placeholder="Format tanlang" />
            </SelectTrigger>
            <SelectContent className="max-h-[min(360px,60vh)]">
              {ARTBOARD_FORMAT_GROUPS.map((group) => (
                <SelectGroup key={group.category}>
                  <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </SelectLabel>
                  {group.ids.map((id) => {
                    const def = FORMAT_BY_ID[id]
                    if (!def) return null
                    return (
                      <SelectItem key={id} value={id}>
                        <span className="flex flex-col gap-0.5 py-0.5">
                          <span className="font-medium">{def.label}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {physicalSizeLabel(def)} · editor {resolveArtboardFormat(id).width}×
                            {resolveArtboardFormat(id).height}
                          </span>
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              ))}
              {isCustom ? (
                <SelectItem value="custom" disabled>
                  Maxsus ({settings.artboardWidth}×{settings.artboardHeight} px)
                </SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        </InspectorField>

        <div className="rounded-lg border border-[#e8ebf0] bg-[#fafbfc] px-3 py-2.5">
          <p className="text-xs font-semibold text-[#0f172a]">{settings.artboardShortLabel}</p>
          <p className="mt-0.5 text-[11px] text-[#64748b]">{settings.artboardPhysicalLabel}</p>
          <p className="mt-1 text-[10px] leading-relaxed text-[#94a3b8]">{settings.artboardLabel}</p>
        </div>

        <ColorField
          label="Fon rangi"
          value={settings.artboardBackground}
          onChange={onArtboardBackgroundChange}
        />
      </InspectorSection>
    </div>
  )
}
