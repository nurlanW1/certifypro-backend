import Link from 'next/link'

const FOOTER_LINKS = {
  Mahsulot: [
    { href: '/templates', label: 'Shablonlar' },
    { href: '/upgrade', label: 'Narxlar' },
    { href: '/help', label: 'Yordam' },
  ],
  Kompaniya: [
    { href: '/help', label: 'Haqida' },
    { href: '/agency', label: 'Agentlik' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
  Qonuniy: [
    { href: '/help', label: 'Shartlar' },
    { href: '/help', label: 'Maxfiylik' },
    { href: '/help', label: 'Cookie' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-divide bg-canvas">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="group mb-5 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-text-primary transition-colors group-hover:bg-accent">
                <span className="text-sm font-bold text-canvas">G</span>
              </div>
              <span className="text-sm font-semibold text-text-primary">ildia</span>
            </Link>
            <p className="max-w-44 text-sm leading-relaxed text-text-tertiary">
              Tadbir media dizaynini avtomatlashtiradigan platforma.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="label-caps mb-4">{section}</p>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={`${section}-${label}`}>
                    <Link
                      href={href}
                      className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-divide pt-8">
          <p className="text-xs text-text-disabled">
            © {new Date().getFullYear()} Gildia. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-ok" />
            <span className="text-xs text-text-disabled">Tizim ishlayapti</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
