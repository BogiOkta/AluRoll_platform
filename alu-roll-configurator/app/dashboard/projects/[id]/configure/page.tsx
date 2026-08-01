'use client'

import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Configurator } from '@/components/configurator'

function ConfigureInner() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const positionId = searchParams.get('position')

  if (!positionId) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center text-sm text-muted-foreground">
        No position selected.
      </div>
    )
  }

  return <Configurator projectId={params.id} positionId={positionId} />
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={null}>
      <ConfigureInner />
    </Suspense>
  )
}
