"use client"

import { Building2, PenLine, Stamp, Type } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BRAND_KIT_COLORS, BRAND_KIT_FONTS } from "@/lib/editor/editor-tools"
import { cn } from "@/lib/utils"

import { fileInputId, HiddenFileInput } from "@/components/editor/tools/hidden-file-input"
import { ToolCardButton, ToolHint, ToolSection } from "./tool-panel-primitives"

type Props = {
  onUploadLogo: (files: FileList) => void
  onUploadSignature: (files: FileList) => void
  onUploadStamp: (files: FileList) => void
  onApplyBrandColor: (color: string) => void
  onApplyBrandFont: (fontFamily: string) => void
}

const LOGO_ID = fileInputId("brand", "logo")
const SIG_ID = fileInputId("brand", "signature")
const STAMP_ID = fileInputId("brand", "stamp")

export function BrandToolPanel({
  onUploadLogo,
  onUploadSignature,
  onUploadStamp,
  onApplyBrandColor,
  onApplyBrandFont,
}: Props) {
  return (
    <div className="space-y-4">
      <ToolSection title="Logotiplar">
        <HiddenFileInput id={LOGO_ID} onFiles={onUploadLogo} />
        <ToolCardButton
          title="Logo qo‘shish"
          description="Asosiy tashkilot logotipi"
          icon={<Building2 className="size-4" />}
          fileInputId={LOGO_ID}
        />
      </ToolSection>

      <ToolSection title="Ranglar">
        <div className="grid grid-cols-3 gap-2">
          {BRAND_KIT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.label}
              onClick={() => onApplyBrandColor(c.value)}
              className="group flex flex-col items-center gap-1 rounded-lg border border-[#e8ebf0] p-2 transition hover:border-[#c7d2fe]"
            >
              <span
                className="size-8 w-full rounded-md ring-1 ring-[#e2e5ea]"
                style={{ backgroundColor: c.value }}
              />
              <span className="text-[9px] font-medium text-[#64748b] group-hover:text-[#334155]">
                {c.label}
              </span>
            </button>
          ))}
        </div>
        <ToolHint>Rang tanlangan matn yoki shakl elementiga qo‘llanadi (element tanlangan bo‘lishi kerak).</ToolHint>
      </ToolSection>

      <ToolSection title="Shriftlar">
        <div className="grid gap-1.5">
          {BRAND_KIT_FONTS.map((f) => (
            <Button
              key={f.value}
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "h-9 w-full justify-start border-[#e8ebf0] bg-white text-xs",
                "hover:border-[#c7d2fe] hover:bg-[#f5f7ff]"
              )}
              style={{ fontFamily: f.value }}
              onClick={() => onApplyBrandFont(f.value)}
            >
              <Type className="mr-2 size-3.5 shrink-0 opacity-60" />
              {f.label}
            </Button>
          ))}
        </div>
      </ToolSection>

      <ToolSection title="Imzo va muhr">
        <HiddenFileInput id={SIG_ID} onFiles={onUploadSignature} />
        <HiddenFileInput id={STAMP_ID} onFiles={onUploadStamp} />
        <div className="grid gap-2">
          <ToolCardButton
            title="Imzo"
            icon={<PenLine className="size-4" />}
            fileInputId={SIG_ID}
          />
          <ToolCardButton
            title="Muhr"
            icon={<Stamp className="size-4" />}
            fileInputId={STAMP_ID}
          />
        </div>
      </ToolSection>
    </div>
  )
}
