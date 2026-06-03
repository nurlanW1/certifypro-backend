"use client"

import { ImageIcon, Stamp, PenLine, Building2 } from "lucide-react"

import { UploadArea } from "@/components/ui/upload-area"
import { fileInputId, HiddenFileInput } from "@/components/editor/tools/hidden-file-input"
import { ToolCardButton, ToolSection } from "./tool-panel-primitives"

type ImageUploadKind = "logo" | "signature" | "stamp" | "image"

type Props = {
  onUpload: (files: FileList, kind: ImageUploadKind) => void
}

const LOGO_ID = fileInputId("uploads", "logo")
const SIGNATURE_ID = fileInputId("uploads", "signature")
const STAMP_ID = fileInputId("uploads", "stamp")
const IMAGE_ID = fileInputId("uploads", "image")

export function UploadsToolPanel({ onUpload }: Props) {
  return (
    <div className="space-y-4">
      <ToolSection title="Yuklash">
        <UploadArea
          title="Faylni shu yerga tashlang"
          description="Logo, rasm, imzo yoki muhr"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
          className="min-h-[100px]"
          onFiles={(files) => onUpload(files, "image")}
        />
      </ToolSection>

      <ToolSection title="Tez yuklash">
        <HiddenFileInput id={LOGO_ID} onFiles={(files) => onUpload(files, "logo")} />
        <HiddenFileInput id={SIGNATURE_ID} onFiles={(files) => onUpload(files, "signature")} />
        <HiddenFileInput id={STAMP_ID} onFiles={(files) => onUpload(files, "stamp")} />
        <HiddenFileInput id={IMAGE_ID} onFiles={(files) => onUpload(files, "image")} />

        <div className="grid gap-2">
          <ToolCardButton
            title="Logo yuklash"
            description="Tashkilot logotipi"
            icon={<Building2 className="size-4" />}
            fileInputId={LOGO_ID}
          />
          <ToolCardButton
            title="Imzo yuklash"
            description="PNG shaffof fon tavsiya etiladi"
            icon={<PenLine className="size-4" />}
            fileInputId={SIGNATURE_ID}
          />
          <ToolCardButton
            title="Muhr yuklash"
            description="Rasmiy muhr / shtamp"
            icon={<Stamp className="size-4" />}
            fileInputId={STAMP_ID}
          />
          <ToolCardButton
            title="Rasm yuklash"
            description="Umumiy foto yoki grafika"
            icon={<ImageIcon className="size-4" />}
            fileInputId={IMAGE_ID}
          />
        </div>
      </ToolSection>
    </div>
  )
}
