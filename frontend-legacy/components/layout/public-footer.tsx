import Link from "next/link"

import { LinkButton } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const productLinks = [
  { href: "/templates", label: "Shablonlar" },
  { href: "/editor", label: "Editor" },
  { href: "/event-packages", label: "Tadbir paketlari" },
  { href: "/dashboard/bulk-generate", label: "Bulk generate" },
]

const companyLinks = [
  { href: "/about", label: "Biz haqimizda" },
  { href: "/contact", label: "Aloqa" },
  { href: "/faq", label: "FAQ" },
  { href: "/pricing", label: "Tariflar" },
  { href: "/privacy", label: "Maxfiylik" },
]

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <div className="gildia-container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a1628] to-primary text-sm font-bold text-primary-foreground">
                G
              </span>
              <span className="text-lg font-bold text-foreground">
                Gildia<span className="text-primary">.uz</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Konferensiya va rasmiy tadbirlar uchun professional dizayn platformasi. Sertifikat,
              bejik, taklifnoma va boshqa materiallarni bir joyda yarating.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <LinkButton href="/register" size="sm">
                Bepul boshlash
              </LinkButton>
              <LinkButton href="/templates" variant="outline" size="sm">
                Shablonlar
              </LinkButton>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mahsulot
            </p>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kompaniya
            </p>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">Click • Payme • Uzum • Paynet</p>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">© 2026 Gildia. Barcha huquqlar himoyalangan.</p>
          <p className="text-xs text-muted-foreground/80">
            Sertifikat • Badge • Taklifnoma • Bulk • QR
          </p>
        </div>
      </div>
    </footer>
  )
}

/** @deprecated use PublicFooter */
export const Footer = PublicFooter
