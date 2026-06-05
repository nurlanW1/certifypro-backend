import picaFactory from 'pica'

const pica = picaFactory()

/** Resize image while preserving quality (Pica Lanczos). */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> {
  const img = await createImageBitmap(file)

  const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const srcCanvas = document.createElement('canvas')
  srcCanvas.width = img.width
  srcCanvas.height = img.height
  srcCanvas.getContext('2d')!.drawImage(img, 0, 0)

  const dstCanvas = document.createElement('canvas')
  dstCanvas.width = width
  dstCanvas.height = height

  await pica.resize(srcCanvas, dstCanvas, { quality: 3 })
  return pica.toBlob(dstCanvas, 'image/png', 1)
}

/** Optional remove.bg integration (requires NEXT_PUBLIC_REMOVE_BG_KEY). */
export async function removeBackground(imageFile: File): Promise<Blob> {
  const apiKey = process.env.NEXT_PUBLIC_REMOVE_BG_KEY
  if (!apiKey) throw new Error('Remove.bg API key not configured')

  const formData = new FormData()
  formData.append('image_file', imageFile)
  formData.append('size', 'auto')

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: formData,
  })

  if (!response.ok) throw new Error('Background removal failed')
  return response.blob()
}
