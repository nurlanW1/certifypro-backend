"use client"

import { Heading1, Heading2, Pilcrow, Text } from "lucide-react"

import { ToolCardButton, ToolHint, ToolSection } from "./tool-panel-primitives"

type Props = {
  onAddHeading: () => void
  onAddSubheading: () => void
  onAddParagraph: () => void
  onAddCaption: () => void
}

export function TextToolPanel({
  onAddHeading,
  onAddSubheading,
  onAddParagraph,
  onAddCaption,
}: Props) {
  return (
    <div className="space-y-4">
      <ToolSection title="Matn qo‘shish">
        <div className="grid gap-2">
          <ToolCardButton
            title="Sarlavha"
            description="Katta sarlavha — 32px, bold"
            icon={<Heading1 className="size-4" />}
            onClick={onAddHeading}
          />
          <ToolCardButton
            title="Quyi sarlavha"
            description="O‘rta sarlavha — 22px, semibold"
            icon={<Heading2 className="size-4" />}
            onClick={onAddSubheading}
          />
          <ToolCardButton
            title="Paragraf"
            description="Asosiy matn — 14px"
            icon={<Pilcrow className="size-4" />}
            onClick={onAddParagraph}
          />
          <ToolCardButton
            title="Kichik yozuv"
            description="Izoh / caption — 11px"
            icon={<Text className="size-4" />}
            onClick={onAddCaption}
          />
        </div>
      </ToolSection>
      <ToolHint>
        O‘zgaruvchilar: {"{{event_name}}"}, {"{{full_name}}"}, {"{{date}}"}, {"{{organization}}"}
      </ToolHint>
    </div>
  )
}
