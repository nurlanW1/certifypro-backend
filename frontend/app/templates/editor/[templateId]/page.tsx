import { notFound } from 'next/navigation'
import { EventCanvasEditor } from '@/components/editor/EventCanvasEditor'
import { findStarterTemplate } from '@/lib/templates/starterTemplates'

export const metadata = {
  title: 'Editor | Gildia',
  description: 'Edit a Gildia starter template',
}

export default function StarterEditorPage({ params }: { params: { templateId: string } }) {
  const template = findStarterTemplate(params.templateId)
  if (!template) notFound()

  return <EventCanvasEditor template={template} />
}
