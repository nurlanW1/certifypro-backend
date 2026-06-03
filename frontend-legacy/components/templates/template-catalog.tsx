"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { SearchInput } from "@/components/ui/input"
import { TabsUnderline } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { CatalogSidebar, type CatalogFilters } from "@/components/templates/catalog-sidebar"
import { CatalogProductCard } from "@/components/templates/catalog-product-card"
import { CatalogGridSkeleton } from "@/components/templates/catalog-skeleton"
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from "@/lib/templates/product-catalog"
import {
  getCatalogGridClass,
  groupProductsBySize,
  sortProductsBySizeGroup,
} from "@/lib/templates/catalog-layout"

const ALL_TAB = "all"

const DEFAULT_FILTERS: CatalogFilters = {
  free: false,
  premium: false,
  print: false,
  online: false,
  landscape: false,
  portrait: false,
}

function matchesSidebarFilters(product: (typeof CATALOG_PRODUCTS)[0], filters: CatalogFilters) {
  const anyActive = Object.values(filters).some(Boolean)
  if (!anyActive) return true

  if (filters.free && !product.isPremium) return true
  if (filters.premium && product.isPremium) return true
  if (filters.print && product.isPrint) return true
  if (filters.online && product.isOnline) return true
  if (filters.landscape && product.format.toLowerCase().includes("landscape")) return true
  if (filters.portrait && product.format.toLowerCase().includes("portrait")) return true

  return false
}

type Props = {
  apiNote?: string
}

export function TemplateCatalog({ apiNote }: Props) {
  const searchParams = useSearchParams()
  const initialCat = searchParams.get("cat") || ALL_TAB

  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState(initialCat)
  const resolvedTab = searchParams.get("cat") || activeTab
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const tabs = useMemo(
    () => [
      { id: ALL_TAB, label: "Barchasi" },
      ...CATALOG_CATEGORIES.map((c) => ({ id: c.slug, label: c.name })),
    ],
    []
  )

  const filtered = useMemo(() => {
    const list = CATALOG_PRODUCTS.filter((p) => {
      if (resolvedTab !== ALL_TAB && p.categorySlug !== resolvedTab) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        const cat = CATALOG_CATEGORIES.find((c) => c.slug === p.categorySlug)?.name ?? ""
        if (!`${p.title} ${p.description} ${cat}`.toLowerCase().includes(q)) return false
      }
      return matchesSidebarFilters(p, filters)
    })
    return sortProductsBySizeGroup(list)
  }, [resolvedTab, query, filters])

  const sizeSections = useMemo(() => {
    if (resolvedTab !== ALL_TAB) return null
    return groupProductsBySize(filtered)
  }, [resolvedTab, filtered])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <CatalogSidebar filters={filters} onChange={setFilters} resultCount={filtered.length} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-card">
          <div className="gildia-container py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Mahsulot katalogi
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Dizayn mahsulotlari katalogi
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                {CATALOG_PRODUCTS.length} ta mahsulot — sertifikatdan video grafikagacha. Tanlang, sozlang,
                editorda yarating.
              </p>
              {apiNote ? <p className="mt-2 text-[10px] text-muted-foreground">{apiNote}</p> : null}
            </div>
            <div className="w-full max-w-md">
              <SearchInput
                placeholder="Masalan: sertifikat, bejik, roll-up..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-5 -mb-px overflow-x-auto">
            <TabsUnderline tabs={tabs} active={resolvedTab} onChange={setActiveTab} />
          </div>
          </div>
        </header>

        <div className="gildia-container flex-1 overflow-y-auto py-6 md:py-8">
          {loading ? (
            <CatalogGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Shablon topilmadi"
              description="Qidiruv yoki filtrlarni o‘zgartiring. Barcha kategoriyalarni ko‘rish uchun «Barchasi» ni tanlang."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("")
                    setActiveTab(ALL_TAB)
                    setFilters(DEFAULT_FILTERS)
                  }}
                >
                  Filtrlarni tiklash
                </Button>
              }
            />
          ) : sizeSections ? (
            <div className="space-y-10">
              {sizeSections.map(({ group, products }) => (
                <section key={group.id}>
                  <div className="mb-4 border-b border-border pb-3">
                    <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>
                    {group.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                    ) : null}
                  </div>
                  <div className={getCatalogGridClass(group.id)}>
                    {products.map((product) => {
                      const cat = CATALOG_CATEGORIES.find((c) => c.slug === product.categorySlug)
                      return (
                        <CatalogProductCard
                          key={product.id}
                          product={product}
                          categoryName={cat?.name ?? product.categorySlug}
                        />
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className={getCatalogGridClass("medium")}>
              {filtered.map((product) => {
                const cat = CATALOG_CATEGORIES.find((c) => c.slug === product.categorySlug)
                return (
                  <CatalogProductCard
                    key={product.id}
                    product={product}
                    categoryName={cat?.name ?? product.categorySlug}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
