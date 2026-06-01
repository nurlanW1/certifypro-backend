"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { AssetUploadField } from "@/components/uploads/asset-upload-field"
import { Button, LinkButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createEventId,
  emptyEventSetup,
  EVENT_TYPE_OPTIONS,
  FONT_OPTIONS,
  LANGUAGE_OPTIONS,
  PARTICIPANT_ESTIMATE_OPTIONS,
  type EventSetup,
  type StoredUpload,
} from "@/lib/event-create/event-setup"
import {
  serializedToStoredUpload,
  storedUploadFromAsset,
  storedUploadToSerialized,
} from "@/lib/uploads/setup-bridge"
import { parseFormAsset } from "@/lib/uploads/serialize"
import { createBuilderDraftFromSetup } from "@/lib/event-create/storage"
import { saveEventProgress } from "@/lib/persistence/event-progress"
import { cn } from "@/lib/utils"
import { PageFrame, SectionCard } from "@/lib/layout/page-frame"
import { checkBillingAccess } from "@/lib/billing/access"
import { createEvent } from "@/lib/api/events"
import { getErrorMessage } from "@/lib/api/errors"

function parseParticipantEstimate(value: string): number | undefined {
  const n = parseInt(value.replace(/\D/g, ""), 10)
  return Number.isFinite(n) ? n : undefined
}

export function EventSetupForm() {
  const router = useRouter()
  const [setup, setSetup] = useState<EventSetup>(emptyEventSetup)
  const [errors, setErrors] = useState<Partial<Record<keyof EventSetup, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  const patch = useCallback((partial: Partial<EventSetup>) => {
    setSetup((s) => ({ ...s, ...partial }))
    setErrors((e) => {
      const next = { ...e }
      for (const key of Object.keys(partial) as (keyof EventSetup)[]) {
        delete next[key]
      }
      return next
    })
  }, [])

  const patchColors = (partial: Partial<EventSetup["brandColors"]>) => {
    patch({ brandColors: { ...setup.brandColors, ...partial } })
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof EventSetup, string>> = {}
    if (!setup.eventName.trim()) next.eventName = "Tadbir nomi majburiy"
    if (!setup.eventType) next.eventType = "Tadbir turini tanlang"
    if (!setup.organizationName.trim()) next.organizationName = "Tashkilot nomi majburiy"
    if (!setup.eventDate) next.eventDate = "Sanani kiriting"
    if (!setup.eventLocation.trim()) next.eventLocation = "Joylashuvni kiriting"
    if (!setup.participantEstimate) next.participantEstimate = "Taxminiy ishtirokchini tanlang"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const eventGate = await checkBillingAccess("canCreateEvent")
      if (!eventGate.allowed) {
        toast.error(eventGate.message)
        return
      }

      const builderGate = await checkBillingAccess("canUseEventBuilder")
      if (!builderGate.allowed) {
        toast.error(builderGate.message)
        return
      }

      let eventId = createEventId()
      try {
        const created = await createEvent({
          name: setup.eventName.trim(),
          type: setup.eventType,
          organizationName: setup.organizationName.trim(),
          date: setup.eventDate,
          location: setup.eventLocation.trim(),
          description: setup.eventDescription?.trim() || undefined,
          language: setup.language,
          participantEstimate: parseParticipantEstimate(setup.participantEstimate),
          status: "draft",
        })
        eventId = created.id
      } catch (apiErr) {
        toast.error(getErrorMessage(apiErr, "Tadbir yaratib bo‘lmadi"))
        return
      }

      const builder = createBuilderDraftFromSetup(setup)
      saveEventProgress({ eventId, setup, draft: builder })
      router.push(`/dashboard/events/${eventId}/builder`)
    } finally {
      setSubmitting(false)
    }
  }

  const eventTypeLabel =
    EVENT_TYPE_OPTIONS.find((o) => o.value === setup.eventType)?.label ?? "—"
  const participantLabel =
    PARTICIPANT_ESTIMATE_OPTIONS.find((o) => o.value === setup.participantEstimate)?.label ?? "—"
  const languageLabel =
    LANGUAGE_OPTIONS.find((o) => o.value === setup.language)?.label ?? "—"

  return (
    <PageFrame className="pb-16">
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Tadbir yaratish
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Yangi tadbir
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ma’lumotlarni to‘ldiring — keyin Event Builder’da barcha materiallarni bir joyda
            tayyorlaysiz.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="space-y-6">
            <SectionCard title="1. Asosiy ma’lumotlar" description="Tadbir nomi va tashkilot">
        <Field label="Tadbir nomi *" error={errors.eventName}>
          <Input
            value={setup.eventName}
            placeholder="Tashkent International AI Forum 2026"
            onChange={(e) => patch({ eventName: e.target.value })}
          />
        </Field>

        <Field label="Tadbir turi *" error={errors.eventType}>
          <div className="grid gap-2 sm:grid-cols-2">
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => patch({ eventType: opt.value })}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm transition",
                  setup.eventType === opt.value
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className="font-semibold text-foreground">{opt.label}</span>
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tashkilot nomi *" error={errors.organizationName}>
            <Input
              value={setup.organizationName}
              placeholder="Tashkilot yoki universitet"
              onChange={(e) => patch({ organizationName: e.target.value })}
            />
          </Field>

          <Field label="Tadbir sanasi *" error={errors.eventDate}>
            <Input
              type="date"
              value={setup.eventDate}
              onChange={(e) => patch({ eventDate: e.target.value })}
            />
          </Field>

          <Field label="Joylashuv *" error={errors.eventLocation}>
            <Input
              value={setup.eventLocation}
              placeholder="Toshkent, Istiqlol saroyi"
              onChange={(e) => patch({ eventLocation: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Tadbir tavsifi">
          <Textarea
            rows={4}
            value={setup.eventDescription}
            placeholder="Tadbir haqida qisqa matn — dastur, maqsad, auditoriya..."
            onChange={(e) => patch({ eventDescription: e.target.value })}
          />
        </Field>
            </SectionCard>

            <SectionCard title="2. Brending" description="Logo, ranglar va shrift">

        <Field label="Asosiy logo *">
          <AssetUploadField
            kind="logo"
            value={storedUploadToSerialized(setup.mainLogo, "logo")}
            onChange={(serialized) => patch({ mainLogo: serializedToStoredUpload(serialized) })}
            hint="PNG, JPG, WEBP yoki SVG · maks. 5 MB"
          />
        </Field>

        <Field label="Qo‘shimcha logotiplar" hint="Homiylar, hamkorlar logotiplari">
          <AssetUploadField
            kind="secondary_logo"
            value=""
            onChange={(serialized) => {
              const asset = parseFormAsset(serialized)
              if (!asset) return
              patch({
                secondaryLogos: [...setup.secondaryLogos, storedUploadFromAsset(asset)],
              })
            }}
            hint="Har safar bitta logo qo‘shing"
          />
          {setup.secondaryLogos.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {setup.secondaryLogos.map((file, index) => (
                <li key={`${file.name}-${index}`}>
                  <SecondaryLogoRow
                    file={file}
                    onRemove={() =>
                      patch({
                        secondaryLogos: setup.secondaryLogos.filter((_, i) => i !== index),
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <ColorField
            label="Asosiy rang"
            value={setup.brandColors.primary}
            onChange={(v) => patchColors({ primary: v })}
          />
          <ColorField
            label="Ikkinchi rang"
            value={setup.brandColors.secondary}
            onChange={(v) => patchColors({ secondary: v })}
          />
          <ColorField
            label="Urg‘u rangi"
            value={setup.brandColors.accent}
            onChange={(v) => patchColors({ accent: v })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Shrift">
            <Select
              value={setup.fontPreference || undefined}
              onValueChange={(val) =>
                patch({ fontPreference: (val ?? "") as EventSetup["fontPreference"] })
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
          </Field>

          <Field label="Til">
            <Select
              value={setup.language || undefined}
              onValueChange={(val) => patch({ language: (val ?? "") as EventSetup["language"] })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Til" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
            </SectionCard>

            <SectionCard title="3. Ishtirokchilar" description="Taxminiy qatnashchilar soni">
        <Field label="Taxminiy ishtirokchilar *" error={errors.participantEstimate}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PARTICIPANT_ESTIMATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => patch({ participantEstimate: opt.value })}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                  setup.participantEstimate === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/30"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>
            </SectionCard>
          </div>

          <aside className="lg:sticky lg:top-20">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">Xulosa</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <SummaryRow label="Tadbir" value={setup.eventName || "—"} />
                <SummaryRow label="Tur" value={eventTypeLabel} />
                <SummaryRow label="Tashkilot" value={setup.organizationName || "—"} />
                <SummaryRow label="Sana" value={setup.eventDate || "—"} />
                <SummaryRow label="Joy" value={setup.eventLocation || "—"} />
                <SummaryRow label="Ishtirokchi" value={participantLabel} />
                <SummaryRow label="Til" value={languageLabel} />
              </dl>
              <div className="mt-6 flex flex-col gap-2">
                <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Tekshirilmoqda…
                    </>
                  ) : (
                    <>
                      Event Builder’ga o‘tish
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
                <LinkButton href="/dashboard/events" variant="outline" className="w-full justify-center">
                  Bekor qilish
                </LinkButton>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </PageFrame>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[58%] truncate text-right font-medium text-foreground">{value}</dd>
    </div>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      {children}
      {hint ? <p className="text-[10px] text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          className="h-10 w-14 shrink-0 cursor-pointer p-1"
          onChange={(e) => onChange(e.target.value)}
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs" />
      </div>
    </div>
  )
}

function SecondaryLogoRow({ file, onRemove }: { file: StoredUpload; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-2">
      {file.dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file.dataUrl} alt="" className="size-10 rounded-lg object-contain bg-white" />
      ) : null}
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
        aria-label="O‘chirish"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}
