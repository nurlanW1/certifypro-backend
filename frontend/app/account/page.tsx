import { ProductConceptStrip } from "@/components/marketing/product-concept-strip"
import { Card } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/button"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ProductConceptStrip context="Hisob va Premium holati" />
      <div className="gildia-container py-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Hisob</h1>
        <p className="mt-2 text-muted-foreground">Profil, tashkilot va Premium obuna</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card title="Profil">
            <p className="text-sm text-muted-foreground">
              Ism, email va tashkilot ma’lumotlari tadbir materiallarida ishlatiladi. Profil
              sozlamalari tez orada ulanadi.
            </p>
          </Card>
          <Card title="Premium obuna">
            <p className="text-sm text-muted-foreground">
              Bulk generation, watermark yo‘q, ZIP export va QR generator imkoniyatlari.
            </p>
            <LinkButton href="/account/plan" className="mt-4" size="sm">
              Rejamni ko‘rish
            </LinkButton>
            <LinkButton href="/pricing" className="mt-2" size="sm" variant="outline">
              Barcha tariflar
            </LinkButton>
          </Card>
        </div>
      </div>
    </div>
  )
}
