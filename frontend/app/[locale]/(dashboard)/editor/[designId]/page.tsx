import { Suspense } from 'react'
import { EditorLayout } from '@/components/editor/EditorLayout'
import { Spinner } from '@/components/ui/Spinner'

export default function EditorPage({
  params,
}: {
  params: { designId: string }
}) {
  return (
    <Suspense fallback={<Spinner className="h-full min-h-[400px]" />}>
      <EditorLayout designId={params.designId} />
    </Suspense>
  )
}
