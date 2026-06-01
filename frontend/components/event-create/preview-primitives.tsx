import { cn } from "@/lib/utils"
import type { EventPreviewData } from "@/lib/event-create/preview-data"

export function PreviewLogo({
  data,
  className,
  size = "md",
}: {
  data: EventPreviewData
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const sizeClass = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-16 text-xl" : "size-11 text-sm"
  if (data.logoDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.logoDataUrl}
        alt="Logo"
        className={cn("rounded-lg object-contain bg-white/90 p-0.5", sizeClass, className)}
      />
    )
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg font-bold text-white shadow-inner",
        sizeClass,
        className
      )}
      style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` }}
    >
      G
    </div>
  )
}

export function PreviewQr({
  data,
  size = "md",
  theme = "dark",
}: {
  data: EventPreviewData
  size?: "sm" | "md"
  theme?: "light" | "dark"
}) {
  const gridSize = size === "sm" ? 3 : 4
  const cell = size === "sm" ? "size-1.5" : "size-2"
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "grid gap-0.5 rounded border bg-white p-1",
          theme === "dark" ? "border-white/20" : "border-border"
        )}
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div key={i} className={cn(cell, i % 2 === 0 ? "bg-foreground" : "bg-transparent")} />
        ))}
      </div>
      <p
        className={cn(
          "max-w-[72px] truncate text-[7px]",
          theme === "dark" ? "text-white/50" : "text-muted-foreground"
        )}
      >
        {data.qrCode.replace(/^https?:\/\//, "")}
      </p>
    </div>
  )
}

export function PreviewSignature({
  label,
  imageUrl,
  className,
}: {
  label: string
  imageUrl?: string
  className?: string
}) {
  return (
    <div className={cn("text-center", className)}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={label} className="mx-auto h-7 max-w-[80px] object-contain" />
      ) : (
        <div className="mx-auto h-7 w-20 rounded bg-white/10" />
      )}
      <p className="mt-1 text-[7px] uppercase tracking-wide text-white/45">{label || "Imzo"}</p>
    </div>
  )
}

export function PreviewStamp({
  visible,
  imageUrl,
}: {
  visible: boolean
  imageUrl?: string
}) {
  if (!visible && !imageUrl) return <div className="size-10" />
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="Muhr" className="size-10 object-contain" />
    )
  }
  return (
    <div className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-amber-400/60 bg-amber-500/20 text-[8px] font-bold uppercase text-amber-200">
      Muhr
    </div>
  )
}

export function PreviewPhoto({ data, className }: { data: EventPreviewData; className?: string }) {
  const initial = data.fullName.charAt(0).toUpperCase() || "?"
  if (data.photoDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.photoDataUrl}
        alt={data.fullName}
        className={cn("shrink-0 rounded-full object-cover ring-2 ring-primary/40", className)}
      />
    )
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-100 font-bold text-slate-500",
        data.hasPhoto ? "ring-2 ring-primary/40" : "",
        className
      )}
    >
      {initial}
    </div>
  )
}

export function PreviewDate({ data, className, light }: { data: EventPreviewData; className?: string; light?: boolean }) {
  return (
    <p className={cn("text-[10px]", light ? "text-white/60" : "text-muted-foreground", className)}>
      {data.date || "Sana"}
    </p>
  )
}
