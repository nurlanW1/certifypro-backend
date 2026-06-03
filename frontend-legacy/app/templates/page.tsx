import { Suspense } from "react"
import { getTemplateCatalog } from "@/lib/api/templates"
import { TemplateCatalog } from "@/components/templates/template-catalog"
import { CatalogGridSkeleton } from "@/components/templates/catalog-skeleton"

async function getApiNote() {
  try {
    const data = await getTemplateCatalog()
    return `API: ${data.categories.length} kategoriya`
  } catch {
    return "Demo katalog — backend ulanishi ixtiyoriy"
  }
}

export default async function TemplatesPage() {
  const apiNote = await getApiNote()

  return (
    <Suspense fallback={<CatalogFallback />}>
      <TemplateCatalog apiNote={apiNote} />
    </Suspense>
  )
}

function CatalogFallback() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-8">
      <CatalogGridSkeleton count={8} />
    </div>
  )
}
