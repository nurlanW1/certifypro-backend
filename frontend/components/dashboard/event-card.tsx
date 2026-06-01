"use client"

import { Calendar, Copy, Trash2, Users } from "lucide-react"

import { Button, LinkButton } from "@/components/ui/button"
import { BadgeChip } from "@/components/ui/badge"
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress"
import type { DashboardEvent } from "@/lib/dashboard/dashboard-storage"
import { cn } from "@/lib/utils"

type Props = {
  event: DashboardEvent
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function EventCard({ event, onDuplicate, onDelete }: Props) {
  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow",
        "hover:border-primary/25 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <BadgeChip variant="outline" className="mb-2 text-[10px]">
            {event.eventTypeLabel}
          </BadgeChip>
          <h3 className="truncate text-base font-semibold text-foreground">{event.name}</h3>
        </div>
        <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-sm"
            title="Nusxa"
            onClick={() => onDuplicate(event.id)}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            title="O‘chirish"
            onClick={() => onDelete(event.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Calendar className="size-3.5 shrink-0 text-primary" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="size-3.5 shrink-0 text-primary" />
          <span>{event.participantEstimate}</span>
        </div>
      </dl>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{event.productCount}</span> ta material
        tanlangan
      </p>

      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Jarayon</span>
          <span className="font-semibold tabular-nums text-foreground">{event.progressPercent}%</span>
        </div>
        <Progress value={event.progressPercent}>
          <ProgressTrack className="h-2 w-full">
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <LinkButton href={`/dashboard/events/${event.id}/builder`} size="sm" className="flex-1 sm:flex-none">
          Davom etish
        </LinkButton>
        <LinkButton href={`/dashboard/events/${event.id}`} variant="outline" size="sm">
          Workspace
        </LinkButton>
      </div>
    </article>
  )
}
