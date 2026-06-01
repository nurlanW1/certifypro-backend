import { EditorLayout } from '@/components/editor/EditorLayout'

export default function EditorPage({
  params,
}: {
  params: { designId: string }
}) {
  return <EditorLayout designId={params.designId} />
}
