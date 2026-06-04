export function slugifyOrgName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 48)
  return base || 'agency'
}

export async function uniqueOrgSlug(
  name: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = slugifyOrgName(name)
  let n = 0
  while (await exists(slug)) {
    n += 1
    slug = `${slugifyOrgName(name)}-${n}`
  }
  return slug
}
