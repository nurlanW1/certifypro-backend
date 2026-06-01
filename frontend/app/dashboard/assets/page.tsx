"use client"

import { useCallback, useMemo, useState } from "react"
import { Trash2 } from "lucide-react"

import { AssetUploadField } from "@/components/uploads/asset-upload-field"
import { ProductConceptStrip } from "@/components/marketing/product-concept-strip"
import { SectionHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ASSET_TYPES } from "@/lib/constants/product"
import { listAssetLibrary, removeFromAssetLibrary, type LibraryAsset } from "@/lib/uploads/asset-library"
import type { UploadKind } from "@/lib/uploads/types"
import { cn } from "@/lib/utils"

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

const kindUz: Record<UploadKind, string> = {
  logo: "Logo",
  secondary_logo: "Qo‘shimcha logo",
  signature: "Imzo",
  stamp: "Muhr",
  participant_photo: "Ishtirokchi rasmi",
  sponsor_logo: "Homiy logotipi",
  partner_logo: "Hamkor logotipi",
  background: "Fon",
  excel: "Excel",
  generic_image: "Rasm",
}

const FILTER_KINDS: (UploadKind | "all")[] = [
  "all",
  "logo",
  "secondary_logo",
  "signature",
  "stamp",
  "participant_photo",
  "sponsor_logo",
  "partner_logo",
  "background",
]

export default function AssetsPage() {
  const [filter, setFilter] = useState<UploadKind | "all">("all")
  const [refreshKey, setRefreshKey] = useState(0)

  const assets = useMemo(() => {
    void refreshKey
    return listAssetLibrary(filter === "all" ? undefined : filter)
  }, [filter, refreshKey])

  const bump = useCallback(() => setRefreshKey((k) => k + 1), [])

  return (
    <div className="min-h-full bg-muted/20">
      <ProductConceptStrip context="Tadbir aktivlari — logo, imzo, muhr, sponsor" />
      <div className="gildia-container py-10">
        <SectionHeader
          eyebrow="Asset kutubxonasi"
          title="Tadbir grafik aktivlari"
          description="PNG, JPG, SVG, WEBP. Barcha materiallarda qayta ishlatish uchun saqlang."
          align="left"
        />

        <div className="mb-8 max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Yangi aktiv yuklash</p>
          <AssetUploadField
            kind="generic_image"
            value=""
            onChange={(serialized) => {
              if (serialized) bump()
            }}
            hint="Yuklangan fayllar brauzerda saqlanadi"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {FILTER_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                filter === k
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              )}
            >
              {k === "all" ? "Barchasi" : kindUz[k]}
            </button>
          ))}
        </div>

        <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Yuklash turlari</p>
        <div className="mb-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ASSET_TYPES.map((t) => (
            <div key={t} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
              <span className="font-medium text-foreground">{typeUz[t] || t}</span>
              <span className="mt-0.5 block text-[10px] text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>

        {assets.length === 0 ? (
          <EmptyState
            title="Hali aktivlar yo‘q"
            description="Yuqoridagi maydondan fayl yuklang yoki Event Builder formalaridan logo, imzo va muhr qo‘shing."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {assets.map((a) => (
              <AssetCard key={a.id} asset={a} onRemove={bump} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AssetCard({ asset, onRemove }: { asset: LibraryAsset; onRemove: () => void }) {
  const isImage = asset.mimeType.startsWith("image/") && asset.dataUrl

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex aspect-square items-center justify-center bg-muted/40 p-4">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.dataUrl} alt={asset.name} className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-4xl text-[#94a3b8]">📄</span>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium">{asset.name}</p>
        <Badge text={kindUz[asset.kind] || asset.kind} variant="default" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 w-full gap-1 text-destructive hover:text-destructive"
          onClick={() => {
            removeFromAssetLibrary(asset.id)
            onRemove()
          }}
        >
          <Trash2 className="size-3.5" />
          O‘chirish
        </Button>
      </div>
    </div>
  )
}
