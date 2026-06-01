"use client"

import { AssetUploadField } from "@/components/uploads/asset-upload-field"
import { ASSET_TYPES } from "@/lib/constants/product"

const typeUz: Record<string, string> = {
  "Event logo": "Tadbir logotipi",
  "Organization logo": "Tashkilot logotipi",
  "Sponsor logo": "Sponsor logotipi",
  "Partner logo": "Hamkor logotipi",
  "Speaker photo": "Spiker rasmi",
  Signature: "Imzo",
  Stamp: "Muhr",
  Background: "Fon",
  "Icon/SVG": "Icon/SVG",
}

export function UploadPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {!compact ? (
        <p className="text-xs font-semibold uppercase text-muted-foreground">Aktiv yuklash</p>
      ) : null}
      <AssetUploadField
        kind="generic_image"
        value=""
        onChange={() => {}}
        hint="PNG, JPG, WEBP, SVG · maks. 5 MB"
      />
      <ul className="space-y-1">
        {ASSET_TYPES.slice(0, compact ? 4 : 9).map((t) => (
          <li key={t} className="text-[10px] text-muted-foreground">
            • {typeUz[t] || t}
          </li>
        ))}
      </ul>
    </div>
  )
}
