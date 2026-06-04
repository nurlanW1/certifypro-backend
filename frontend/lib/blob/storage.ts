import { prisma } from '@/lib/prisma'

export function isBlobStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
}

/** SVG ni Vercel Blob ga yuklab, Template.previewUrl ni yangilash. */
export async function cacheTemplatePreviewToBlob(
  templateId: string,
  svgContent: string
): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (!token) return null

  try {
    const { put } = await import('@vercel/blob')
    const pathname = `template-previews/${templateId}.svg`
    const blob = await put(pathname, svgContent, {
      access: 'public',
      contentType: 'image/svg+xml',
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    })

    await prisma.template.update({
      where: { id: templateId },
      data: { previewUrl: blob.url },
    })

    return blob.url
  } catch (err) {
    console.error('[blob] cache preview failed:', templateId, err)
    return null
  }
}
