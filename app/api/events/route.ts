import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { EventFormData } from '@/types/event'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json([])
  }

  const events = await prisma.event.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as EventFormData

  let user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: `${userId}@clerk.local`,
      },
    })
  }

  const event = await prisma.event.create({
    data: {
      userId: user.id,
      name: body.name,
      type: body.type,
      date: body.date ? new Date(body.date) : null,
      location: body.location || null,
      organization: body.organization || null,
      language: body.language,
      logoUrl: body.logoUrl ?? null,
      primaryColor: body.primaryColor,
      accentColor: body.accentColor,
    },
  })

  return NextResponse.json(event, { status: 201 })
}
