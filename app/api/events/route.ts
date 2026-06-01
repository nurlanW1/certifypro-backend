import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { EventFormData, MaterialCategory } from '@/types/event'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      formData: EventFormData
      selectedMaterials?: MaterialCategory[]
      email?: string
    }

    const { formData, selectedMaterials = [] } = body

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: body.email || `${userId}@clerk.local`,
        },
      })
    }

    const event = await prisma.event.create({
      data: {
        userId: user.id,
        name: formData.name,
        type: formData.type,
        date: formData.date ? new Date(formData.date) : null,
        location: formData.location || null,
        organization: formData.organization || null,
        language: formData.language || 'uz',
        primaryColor: formData.primaryColor || '#534AB7',
        accentColor: formData.accentColor || '#26215C',
        logoUrl: formData.logoUrl ?? null,
      },
    })

    return NextResponse.json({ event, selectedMaterials }, { status: 201 })
  } catch (error) {
    console.error('Event create error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return NextResponse.json({ events: user?.events ?? [] })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
