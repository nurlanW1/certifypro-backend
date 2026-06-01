import { EVENT_CATALOG } from "@/lib/event-create/catalog"
import type { DesignRegistryEntry } from "@/lib/persistence/types"
import { persistGet, persistSet } from "@/lib/persistence/client-store"

const REGISTRY_KEY = "gildia_design_registry"

function readRegistry(): DesignRegistryEntry[] {
  try {
    const raw = persistGet(REGISTRY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DesignRegistryEntry[]
  } catch {
    return []
  }
}

function writeRegistry(entries: DesignRegistryEntry[]) {
  persistSet(REGISTRY_KEY, JSON.stringify(entries))
}

export function registerDesignEntry(entry: Omit<DesignRegistryEntry, "updatedAt"> & { updatedAt?: string }) {
  const list = readRegistry()
  const updatedAt = entry.updatedAt ?? new Date().toISOString()
  const next: DesignRegistryEntry = { ...entry, updatedAt }
  const idx = list.findIndex((e) => e.scope === entry.scope)
  if (idx >= 0) list[idx] = next
  else list.unshift(next)
  writeRegistry(list.slice(0, 200))
}

export function removeDesignEntry(scope: string) {
  writeRegistry(readRegistry().filter((e) => e.scope !== scope))
}

export function listDesignRegistry(): DesignRegistryEntry[] {
  return readRegistry().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function getDesignEntry(scope: string): DesignRegistryEntry | null {
  return readRegistry().find((e) => e.scope === scope) ?? null
}

/** catalog-{id} or catalog-{id}-copy-{ts} → product id */
export function parseCatalogProductId(scope: string): string | null {
  if (!scope.startsWith("catalog-")) return null
  const rest = scope.slice(8)
  const copyIdx = rest.indexOf("-copy-")
  return copyIdx > 0 ? rest.slice(0, copyIdx) : rest
}

export function parseEventScope(scope: string): { eventId: string; category: string } | null {
  if (!scope.startsWith("event-")) return null
  let rest = scope.slice(6)
  const copyIdx = rest.indexOf("-copy-")
  if (copyIdx > 0) rest = rest.slice(0, copyIdx)
  for (const item of EVENT_CATALOG) {
    const suffix = `-${item.id}`
    if (rest.endsWith(suffix)) {
      return { eventId: rest.slice(0, -suffix.length), category: item.id }
    }
  }
  return null
}
