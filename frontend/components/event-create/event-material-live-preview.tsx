"use client"

import { useMemo } from "react"
import { ExternalLink } from "lucide-react"

import {
  PreviewDate,
  PreviewLogo,
  PreviewPhoto,
  PreviewQr,
  PreviewSignature,
  PreviewStamp,
} from "@/components/event-create/preview-primitives"
import type { EventSetup } from "@/lib/event-create/event-setup"
import { aspectForMaterial, mapToPreviewData } from "@/lib/event-create/preview-data"
import type { CategoryFormData } from "@/lib/event-create/types"
import { cn } from "@/lib/utils"

type Props = {
  materialId: string
  materialName: string
  mockupVariant: string
  formData: CategoryFormData
  setup: EventSetup | null
  onOpenEditor: () => void
  className?: string
}

export function EventMaterialLivePreview({
  materialId,
  materialName,
  mockupVariant,
  formData,
  setup,
  onOpenEditor,
  className,
}: Props) {
  const preview = useMemo(
    () => mapToPreviewData(materialId, formData, setup),
    [materialId, formData, setup]
  )

  const aspect = aspectForMaterial(materialId)

  return (
    <button
      type="button"
      onClick={onOpenEditor}
      className={cn(
        "group w-full text-left transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_20px_56px_rgba(10,22,40,0.14)] ring-1 ring-border transition-shadow group-hover:shadow-[0_24px_64px_rgba(37,99,235,0.18)] group-hover:ring-primary/40">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-red-400/80" />
            <span className="size-2 rounded-full bg-amber-400/80" />
            <span className="size-2 rounded-full bg-emerald-400/80" />
          </div>
          <span className="flex items-center gap-1 text-[9px] font-medium text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
        <div className={cn("relative w-full", aspect)}>{renderBody(materialId, mockupVariant, preview)}</div>
      </div>
      <p className="mt-3 flex items-center justify-center gap-1 text-center text-xs font-semibold text-primary group-hover:underline">
        <ExternalLink className="size-3.5" />
        Mockup ustiga bosing — editorda ochish
      </p>
      <p className="mt-0.5 text-center text-[10px] text-muted-foreground">{materialName}</p>
    </button>
  )
}

function renderBody(materialId: string, variant: string, d: ReturnType<typeof mapToPreviewData>) {
  switch (materialId) {
    case "certificate":
      return <CertificatePreview data={d} />
    case "badge":
      return <BadgePreview data={d} />
    case "invitation":
      return <InvitationPreview data={d} />
    case "flyer":
      return <FlyerPreview data={d} />
    case "poster":
      return <PosterPreview data={d} />
    case "program-book":
      return <ProgramBookPreview data={d} />
    case "rollup":
      return <RollupPreview data={d} />
    case "press-wall":
      return <PressWallPreview data={d} />
    case "stage-backdrop":
      return <BackdropPreview data={d} />
    case "social-post":
      return <SocialPreview data={d} />
    default:
      return <DefaultVariantPreview variant={variant} data={d} />
  }
}

function CertificatePreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div
      className="flex h-full flex-col p-5 text-white"
      style={{
        background: `linear-gradient(145deg, ${d.primaryColor} 0%, ${d.secondaryColor} 55%, ${d.accentColor} 100%)`,
      }}
    >
      <div className="flex items-start justify-between">
        <PreviewLogo data={d} size="sm" />
        <PreviewQr data={d} size="sm" />
      </div>
      <p className="mt-4 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-blue-100/80">
        {d.subtitle}
      </p>
      <div className="my-3 mx-auto h-px w-12 bg-white/30" />
      <p className="text-center text-lg font-bold leading-tight">{d.fullName}</p>
      <p className="mt-3 line-clamp-3 text-center text-[10px] leading-relaxed text-blue-100/90">{d.bodyText}</p>
      <p className="mt-3 text-center text-xs font-medium">{d.eventName}</p>
      <PreviewDate data={d} className="mt-2 text-center text-white/55" light />
      <div className="mt-auto flex items-end justify-between border-t border-white/20 pt-4">
        <PreviewSignature label={d.signature1} imageUrl={d.signature1DataUrl} />
        <PreviewStamp visible={d.hasStamp} imageUrl={d.stampDataUrl} />
        <PreviewSignature label={d.signature2} imageUrl={d.signature2DataUrl} />
      </div>
    </div>
  )
}

function BadgePreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div className="flex h-full gap-3 bg-white p-4">
      <PreviewPhoto data={d} className="size-16 text-lg" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <p className="truncate text-sm font-bold text-foreground">{d.fullName}</p>
        <p className="truncate text-xs text-muted-foreground">{d.position}</p>
        <p className="truncate text-[10px] font-medium text-primary">{d.organization}</p>
        <span className="mt-1 inline-flex w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
          {d.participantType}
        </span>
      </div>
      <PreviewQr data={d} size="sm" theme="light" />
    </div>
  )
}

function InvitationPreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div className="flex h-full flex-col justify-between bg-gradient-to-b from-slate-50 to-white p-5">
      <div>
        <PreviewLogo data={d} size="sm" />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-primary">Taklifnoma</p>
        <p className="mt-3 text-base font-bold text-foreground">{d.fullName}</p>
        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-muted-foreground">{d.bodyText}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{d.eventName}</p>
        <PreviewDate data={d} className="mt-1" />
        <p className="mt-1 text-[10px] text-muted-foreground">{d.venue}</p>
        <div className="mt-3 flex justify-end">
          <PreviewQr data={d} size="sm" theme="light" />
        </div>
      </div>
    </div>
  )
}

function FlyerPreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div
      className="flex h-full flex-col p-5 text-white"
      style={{ background: `linear-gradient(160deg, ${d.secondaryColor}, ${d.primaryColor})` }}
    >
      <PreviewLogo data={d} size="sm" />
      <p className="mt-6 text-xl font-black leading-tight">{d.headline}</p>
      <p className="mt-2 text-sm opacity-90">{d.subtitle}</p>
      <p className="mt-4 line-clamp-4 flex-1 text-xs leading-relaxed opacity-80">{d.bodyText}</p>
      <p className="text-xs font-semibold">{d.eventName}</p>
      <p className="mt-1 text-[10px] opacity-70">
        {d.date} · {d.venue}
      </p>
      <p className="mt-3 rounded-lg bg-white/15 px-3 py-1.5 text-center text-[10px] font-bold">{d.cta}</p>
    </div>
  )
}

function PosterPreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center p-6 text-center text-white"
      style={{ background: `linear-gradient(180deg, ${d.primaryColor} 0%, ${d.secondaryColor} 100%)` }}
    >
      <PreviewLogo data={d} />
      <p className="mt-5 text-2xl font-black leading-none">{d.headline}</p>
      <p className="mt-3 text-sm font-medium opacity-90">{d.eventName}</p>
      <PreviewDate data={d} className="mt-2 text-white/60" light />
      <p className="mt-2 text-[10px] opacity-70">{d.venue}</p>
      <p className="mt-4 line-clamp-2 text-[10px] opacity-60">{d.bodyText}</p>
    </div>
  )
}

function ProgramBookPreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  const rows = d.programSessions.length > 0 ? d.programSessions.slice(0, 4) : [
    { startTime: "09:00", sessionTitle: "Ochilish", speaker: "Spiker" },
    { startTime: "10:30", sessionTitle: "Asosiy sessiya", speaker: "Spiker" },
    { startTime: "14:00", sessionTitle: "Panel", speaker: "Moderator" },
  ]

  return (
    <div className="flex h-full flex-col bg-white">
      <div
        className="px-4 py-3 text-white"
        style={{ background: `linear-gradient(90deg, ${d.primaryColor}, ${d.secondaryColor})` }}
      >
        <PreviewLogo data={d} size="sm" />
        <p className="mt-2 text-sm font-bold">{d.eventName}</p>
        <PreviewDate data={d} className="text-white/70" light />
      </div>
      <div className="flex-1 space-y-0 overflow-hidden p-3">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 border-b border-border py-2 text-[9px]">
            <span className="shrink-0 font-mono font-bold text-primary">
              {row.startTime || `09:${i}0`}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                {row.sessionTitle || row.topic || `Sessiya ${i + 1}`}
              </p>
              <p className="truncate text-muted-foreground">{row.speaker || row.moderator || ""}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RollupPreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center px-4 text-center text-white"
      style={{ background: `linear-gradient(180deg, ${d.secondaryColor}, ${d.primaryColor})` }}
    >
      <PreviewLogo data={d} size="lg" />
      <p className="mt-4 text-sm font-black leading-tight">{d.headline}</p>
      <p className="mt-2 text-[10px] opacity-80">{d.eventName}</p>
      <p className="mt-6 text-[9px] uppercase tracking-wider opacity-50">{d.organization}</p>
    </div>
  )
}

function PressWallPreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div className="flex h-full flex-col bg-slate-100">
      <div
        className="flex flex-1 flex-col items-center justify-center p-4 text-white"
        style={{ background: `linear-gradient(135deg, ${d.primaryColor}, ${d.secondaryColor})` }}
      >
        <PreviewLogo data={d} />
        <p className="mt-3 text-sm font-bold">{d.headline}</p>
        <p className="text-[10px] opacity-80">{d.eventName}</p>
      </div>
      <div className="grid grid-cols-4 gap-1 bg-white p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded bg-muted" />
        ))}
      </div>
    </div>
  )
}

function BackdropPreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center p-4 text-center text-white"
      style={{ background: `linear-gradient(180deg, ${d.secondaryColor} 0%, ${d.primaryColor} 70%)` }}
    >
      <PreviewLogo data={d} size="lg" />
      <p className="mt-4 text-base font-black leading-tight">{d.headline}</p>
      <p className="mt-2 text-xs opacity-85">{d.subtitle}</p>
      <p className="mt-6 text-[10px] uppercase tracking-widest opacity-50">{d.eventName}</p>
    </div>
  )
}

function SocialPreview({ data: d }: { data: ReturnType<typeof mapToPreviewData> }) {
  return (
    <div
      className="flex h-full flex-col justify-end p-4 text-white"
      style={{ background: `linear-gradient(135deg, ${d.accentColor}, ${d.secondaryColor}, ${d.primaryColor})` }}
    >
      <PreviewLogo data={d} size="sm" />
      <p className="mt-3 text-sm font-bold leading-tight">{d.headline}</p>
      <p className="mt-1 text-xs opacity-90">{d.eventName}</p>
      <p className="mt-2 text-[10px] font-medium">{d.hashtag}</p>
      <p className="mt-3 rounded-md bg-white/20 px-2 py-1 text-center text-[10px] font-bold">{d.cta}</p>
    </div>
  )
}

function DefaultVariantPreview({
  variant,
  data: d,
}: {
  variant: string
  data: ReturnType<typeof mapToPreviewData>
}) {
  if (variant === "certificate" || variant === "diploma" || variant === "thanks") {
    return <CertificatePreview data={d} />
  }
  if (variant === "badge" || variant === "name-tag") return <BadgePreview data={d} />
  if (variant === "invitation") return <InvitationPreview data={d} />
  if (variant === "program" || variant === "ppt") return <ProgramBookPreview data={d} />
  if (variant === "rollup" || variant === "backdrop" || variant === "press-wall" || variant === "sponsor") {
    return <RollupPreview data={d} />
  }
  if (variant === "social" || variant === "story" || variant === "telegram") {
    return <SocialPreview data={d} />
  }
  if (variant === "qr") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-6">
        <PreviewQr data={d} />
        <p className="text-xs font-semibold text-foreground">{d.eventName}</p>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-white p-5">
      <PreviewLogo data={d} size="sm" />
      <p className="font-bold text-foreground">{d.headline}</p>
      <p className="text-xs text-muted-foreground">{d.fullName}</p>
      <PreviewDate data={d} />
    </div>
  )
}
