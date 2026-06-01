export type EditorShortcut = {
  keys: string
  label: string
  category: "canvas" | "edit" | "layers"
}

export const EDITOR_SHORTCUTS: EditorShortcut[] = [
  { keys: "Scroll", label: "Zoom at cursor", category: "canvas" },
  { keys: "Space + drag", label: "Pan canvas", category: "canvas" },
  { keys: "Right-drag", label: "Pan canvas", category: "canvas" },
  { keys: "V", label: "Select tool", category: "canvas" },
  { keys: "H", label: "Hand tool", category: "canvas" },
  { keys: "⌘/Ctrl + Z", label: "Undo", category: "edit" },
  { keys: "⌘/Ctrl + Shift + Z", label: "Redo", category: "edit" },
  { keys: "⌘/Ctrl + D", label: "Duplicate selection", category: "edit" },
  { keys: "⌘/Ctrl + S", label: "Save", category: "edit" },
  { keys: "Delete / Backspace", label: "Delete selection", category: "layers" },
  { keys: "Esc", label: "Clear selection", category: "layers" },
]

export const SHORTCUT_CATEGORY_LABEL: Record<EditorShortcut["category"], string> = {
  canvas: "Kanvas",
  edit: "Tahrir",
  layers: "Qatlamlar",
}
