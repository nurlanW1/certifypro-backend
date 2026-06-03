"use client"

import { Suspense, use } from "react"

import { EventBuilder } from "@/components/event-create/event-builder"

function BuilderContent({ eventId }: { eventId: string }) {
  return <EventBuilder eventId={eventId} />
}

export default function EventBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <Suspense fallback={<div className="px-4 py-20 text-center text-muted-foreground">Yuklanmoqda...</div>}>
      <BuilderContent eventId={id} />
    </Suspense>
  )
}