import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import type { CanvasData } from '@/types/design'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as {
    designId: string
    canvasData: CanvasData
  }

  return NextResponse.json({
    success: true,
    designId: body.designId,
    message: 'Export queued',
  })
}
