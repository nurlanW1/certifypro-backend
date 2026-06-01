import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  LandingContainer,
  LandingEyebrow,
  LandingHeading,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"
import { ProductPreviewPlaceholder } from "@/components/templates/product-preview-placeholder"
import { Badge } from "@/components/ui/badge"
import { LinkButton } from "@/components/ui/button"
import { CATALOG_PRODUCTS, PRODUCT_CATALOG_CATEGORIES } from "@/lib/templates/catalog-data"
const FEATURED_IDS = [
  "certificate",
  "diploma",
  "badge",
  "invitation",
  "flyer",
  "rollup-banner",
  "social-media-post",
  "powerpoint",
]

const featured = FEATURED_IDS.map((id) => CATALOG_PRODUCTS.find((p) => p.id === id)).filter(Boolean)

export function HomeCatalogPreview() {
  return (
    <LandingSection className="bg-background" id="catalog">
      <LandingContainer>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <LandingEyebrow>Mahsulot katalogi</LandingEyebrow>
            <LandingHeading
              align="left"
              title="49 turdagi professional material"
              description="Hujjatlar, identifikatsiya, chop etish, taqdimot va brend — barchasi bitta katalogda."
            />
          </div>
          <LinkButton href="/templates" variant="outline" className="shrink-0 gap-2 self-start md:self-auto">
            Barcha mahsulotlar
            <ArrowRight className="size-4" />
          </LinkButton>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {PRODUCT_CATALOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/templates?cat=${cat.slug}`}
              className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) =>
            product ? (
              <Link
                key={product.id}
                href={`/editor?from=catalog&template=${encodeURIComponent(product.id)}&fresh=1`}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-premium-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/30 p-4">
                  <ProductPreviewPlaceholder
                    productName={product.title}
                    tone={product.previewTone}
                    format={product.format}
                    className="h-full w-full rounded-lg"
                    aspectClass="aspect-auto h-full min-h-[120px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="border-t border-border/80 p-4">
                  <p className="font-semibold text-foreground group-hover:text-primary">{product.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {product.format}
                  </p>
                </div>
                <span className="absolute right-3 top-3">
                  <Badge
                    text={product.isPremium ? "Premium" : "Free"}
                    variant={product.isPremium ? "premium" : "free"}
                  />
                </span>
              </Link>
            ) : null
          )}
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
