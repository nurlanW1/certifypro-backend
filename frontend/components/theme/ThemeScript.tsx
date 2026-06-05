import Script from 'next/script'
import { THEME_STORAGE_KEY } from '@/lib/theme'

const themeScript = `
  (function () {
    try {
      var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var dark = stored === 'dark' || (stored !== 'light' && prefersDark);
      document.documentElement.classList.toggle('dark', dark);
    } catch (e) {}
  })();
`

export function ThemeScript() {
  return (
    <Script id="gildia-theme" strategy="beforeInteractive">
      {themeScript}
    </Script>
  )
}
