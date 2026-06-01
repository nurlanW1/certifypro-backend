import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { MaterialCategory } from '@/types/event'
import type { EventType } from '@/types/event'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') as MaterialCategory | null
  const eventType = searchParams.get('eventType') as EventType | null
  const search = searchParams.get('search')

  const templates = await prisma.template.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(eventType ? { eventType } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { nameUz: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(templates)
}
