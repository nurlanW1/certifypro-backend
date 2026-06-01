"use client"

import { useId } from "react"

type Props = {
  accept?: string
  onFiles: (files: FileList) => void
  /** When set, pairs with ToolCardButton / label via htmlFor */
  id?: string
}

export function HiddenFileInput({
  accept = "image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg",
  onFiles,
  id: idProp,
}: Props) {
  const autoId = useId()
  const id = idProp ?? autoId.replace(/:/g, "")

  return (
    <input
      id={id}
      type="file"
      accept={accept}
      className="sr-only"
      onChange={(e) => {
        const files = e.target.files
        if (files?.length) onFiles(files)
        e.target.value = ""
      }}
      onClick={(e) => e.stopPropagation()}
    />
  )
}

export function fileInputId(prefix: string, key: string) {
  return `editor-file-${prefix}-${key}`
}
