import { NextResponse } from 'next/server'
import { cacheTemplatePreviewToBlob, isBlobStorageConfigured } from '@/lib/blob/storage'
import { allowDevMocks } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { findMockTemplate } from '@/lib/filter-templates'
import { buildBrandedTemplateSvg } from '@/lib/templates/branded-svg'

/** Shablon SVG preview — Blob CDN yoki inline SVG. */
export async function GET(
  _req: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const row = await prisma.template.findUnique({
      where: { id: params.templateId },
      select: { svgContent: true, name: true, nameUz: true, previewUrl: true, category: true },
    })

    if (
      row?.previewUrl?.startsWith('https://') &&
      row.previewUrl.includes('blob.vercel-storage.com')
    ) {
      return NextResponse.redirect(row.previewUrl, 302)
    }

    let svg = row?.svgContent
    if (!svg && allowDevMocks()) {
      const mock = findMockTemplate(params.templateId)
      if (mock) {
        svg = buildBrandedTemplateSvg({
          title: mock.nameUz ?? mock.name,
          category: mock.category,
        })
      }
    }

    if (!svg?.trim()) {
      return new NextResponse('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"/>', {
        status: 404,
        headers: { 'Content-Type': 'image/svg+xml' },
      })
    }

    if (isBlobStorageConfigured() && row && !row.previewUrl?.includes('blob.vercel-storage.com')) {
      void cacheTemplatePreviewToBlob(params.templateId, svg)
    }

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    })
  } catch (error) {
    console.error('Template preview error:', error)
    return new NextResponse('Error', { status: 500 })
  }
}
