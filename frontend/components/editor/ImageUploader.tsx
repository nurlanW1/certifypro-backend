'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { resizeImage } from '@/lib/editor/imageProcessor'

interface ImageUploaderProps {
  onUpload: (dataUrl: string) => void
  maxSize?: number
}

export function ImageUploader({ onUpload, maxSize = 5 * 1024 * 1024 }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setLoading(true)
      setError(null)

      try {
        if (file.type === 'image/svg+xml') {
          const text = await file.text()
          const dataUrl = `data:image/svg+xml;base64,${btoa(text)}`
          setPreview(dataUrl)
          onUpload(dataUrl)
        } else {
          const resized = await resizeImage(file, 2000, 2000)
          const reader = new FileReader()
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string
            setPreview(dataUrl)
            onUpload(dataUrl)
          }
          reader.readAsDataURL(resized)
        }
      } catch {
        setError('Fayl yuklashda xato')
      } finally {
        setLoading(false)
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
    maxSize,
    multiple: false,
    onDropRejected: () => setError('Fayl hajmi 5MB dan oshmasin'),
  })

  if (preview) {
    return (
      <div className="relative overflow-hidden rounded border border-divide">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Preview" className="max-h-40 w-full object-contain" />
        <button
          type="button"
          onClick={() => setPreview(null)}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded bg-ink/80 text-text-secondary transition-colors hover:text-text-primary"
          aria-label="Olib tashlash"
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded border-2 border-dashed p-6 text-center transition-all duration-150 ${
          isDragActive
            ? 'border-accent bg-accent-dim'
            : 'border-divide hover:border-text-disabled hover:bg-subtle'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {loading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-divide border-t-accent" />
          ) : (
            <Upload size={18} className="text-text-disabled" />
          )}
          <p className="text-xs text-text-secondary">
            {isDragActive ? 'Tashlang...' : 'Rasm tashlang yoki bosing'}
          </p>
          <p className="text-xs text-text-disabled">PNG, SVG, JPG — max 5MB</p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  )
}
