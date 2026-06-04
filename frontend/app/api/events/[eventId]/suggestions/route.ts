import { NextRequest, NextResponse } from 'next/server'
import { getEventSuggestionsWithLlm } from '@/lib/ai/llm-suggestions'
import { getOrCreateDbUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { EventType } from '@/types/event'

export async function GET(
  _req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, userId: user.id },
    })
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { suggestions, source } = await getEventSuggestionsWithLlm({
      name: event.name,
      type: event.type as EventType,
      date: event.date?.toISOString() ?? null,
      location: event.location,
      organization: event.organization,
      language: event.language,
    })

    return NextResponse.json({ suggestions, source })
  } catch (error) {
    console.error('Suggestions error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
