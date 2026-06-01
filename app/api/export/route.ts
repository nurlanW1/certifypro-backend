import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { designId?: string; format?: 'pdf' | 'png' }
    const designId = body.designId ?? 'unknown'
    const format = body.format ?? 'pdf'

    return NextResponse.json({
      ok: true,
      message: `Eksport navbatga qo‘yildi (${format})`,
      designId,
      downloadUrl: null,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
