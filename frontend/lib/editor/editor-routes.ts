export type EditorRouteContext = {
  from: string | null
  templateId: string | null
  eventId: string | null
  category: string | null
  eventProductId?: string | null
}

/** Back navigation from Media Editor */
export function getEditorBackHref(params: EditorRouteContext): string {
  if (params.from === "event-create" && params.eventId) {
    const q = params.category ? `?material=${encodeURIComponent(params.category)}` : ""
    return `/dashboard/events/${params.eventId}/builder${q}`
  }
  if (params.from === "catalog") {
    return "/templates"
  }
  return "/templates"
}

export function buildEditorHref(
  ctx: EditorRouteContext & { export?: boolean; fresh?: boolean }
): string {
  const params = new URLSearchParams()
  if (ctx.from) params.set("from", ctx.from)
  if (ctx.templateId) params.set("template", ctx.templateId)
  if (ctx.eventId) params.set("eventId", ctx.eventId)
  if (ctx.category) params.set("category", ctx.category)
  if (ctx.eventProductId) params.set("eventProductId", ctx.eventProductId)
  if (ctx.fresh) params.set("fresh", "1")
  if (ctx.export) params.set("export", "1")
  const q = params.toString()
  return q ? `/editor?${q}` : "/editor"
}
