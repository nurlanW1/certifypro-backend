import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { CanvasData } from '@/types/design'

export async function PUT(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as { id: string; canvasData: CanvasData }
  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const design = await prisma.design.update({
    where: { id: body.id, userId: user.id },
    data: {
      canvasData: body.canvasData as unknown as Prisma.InputJsonValue,
    },
  })

  return NextResponse.json(design)
}
