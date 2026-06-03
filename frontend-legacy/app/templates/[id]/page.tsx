import { notFound, redirect } from "next/navigation"

import { buildEditorHref } from "@/lib/editor/editor-routes"
import { getProductById } from "@/lib/templates/product-catalog"

type Props = {
  params: Promise<{ id: string }>
}

/** Legacy configure URL — open editor directly (data fields live in editor Ma'lumot panel) */
export default async function TemplateProductPage({ params }: Props) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()

  redirect(
    buildEditorHref({
      from: "catalog",
      templateId: id,
      eventId: null,
      category: null,
      fresh: true,
    })
  )
}
