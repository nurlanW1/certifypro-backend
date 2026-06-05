export type FontCategory = 'sans-serif' | 'serif' | 'mono' | 'display'

export interface AvailableFont {
  name: string
  category: FontCategory
  google?: boolean
}

export const AVAILABLE_FONTS: AvailableFont[] = [
  { name: 'Geist', category: 'sans-serif' },
  { name: 'Inter', category: 'sans-serif', google: true },
  { name: 'Roboto', category: 'sans-serif', google: true },
  { name: 'Open Sans', category: 'sans-serif', google: true },
  { name: 'Montserrat', category: 'sans-serif', google: true },
  { name: 'Raleway', category: 'sans-serif', google: true },
  { name: 'Poppins', category: 'sans-serif', google: true },
  { name: 'Nunito', category: 'sans-serif', google: true },
  { name: 'Bricolage Grotesque', category: 'display', google: true },
  { name: 'Playfair Display', category: 'serif', google: true },
  { name: 'Merriweather', category: 'serif', google: true },
  { name: 'Lora', category: 'serif', google: true },
  { name: 'Cormorant Garamond', category: 'serif', google: true },
  { name: 'JetBrains Mono', category: 'mono', google: true },
  { name: 'Fira Code', category: 'mono', google: true },
  { name: 'Noto Sans', category: 'sans-serif', google: true },
  { name: 'PT Sans', category: 'sans-serif', google: true },
  { name: 'PT Serif', category: 'serif', google: true },
]

const loadedFonts = new Set<string>()

/** Load a Google Font dynamically and wait until usable. */
export async function loadGoogleFont(fontName: string): Promise<void> {
  if (loadedFonts.has(fontName)) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)

  await document.fonts.load(`16px "${fontName}"`)
  loadedFonts.add(fontName)
}
