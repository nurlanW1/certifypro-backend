"use client"

import {
  Badge,
  Frame,
  Minus,
  Sparkles,
  Square,
} from "lucide-react"

import { ToolCardButton, ToolSection } from "./tool-panel-primitives"

type Props = {
  onAddLine: () => void
  onAddDivider: () => void
  onAddBadge: () => void
  onAddFrame: () => void
  onAddIconPlaceholder: () => void
}

export function ElementsToolPanel({
  onAddLine,
  onAddDivider,
  onAddBadge,
  onAddFrame,
  onAddIconPlaceholder,
}: Props) {
  return (
    <div className="space-y-4">
      <ToolSection title="Chiziqlar">
        <div className="grid gap-2">
          <ToolCardButton
            title="Chiziq"
            description="Gorizontal yoki vertikal chiziq"
            icon={<Minus className="size-4" />}
            onClick={onAddLine}
          />
          <ToolCardButton
            title="Ajratgich"
            description="To‘liq kenglikdagi divider"
            icon={<Minus className="size-4 rotate-90" />}
            onClick={onAddDivider}
          />
        </div>
      </ToolSection>

      <ToolSection title="Ramkalar va belgilar">
        <div className="grid gap-2">
          <ToolCardButton
            title="Bejik ramkasi"
            description="Yumaloq burchakli label"
            icon={<Badge className="size-4" />}
            onClick={onAddBadge}
          />
          <ToolCardButton
            title="Foto ramka"
            description="Konturli to‘rtburchak"
            icon={<Frame className="size-4" />}
            onClick={onAddFrame}
          />
          <ToolCardButton
            title="Icon joyi"
            description="Placeholder — keyin almashtiring"
            icon={<Sparkles className="size-4" />}
            onClick={onAddIconPlaceholder}
          />
          <ToolCardButton
            title="Dekor blok"
            description="Yengil fonli blok"
            icon={<Square className="size-4" />}
            onClick={onAddBadge}
          />
        </div>
      </ToolSection>
    </div>
  )
}
