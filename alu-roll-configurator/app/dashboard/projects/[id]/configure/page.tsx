'use client'

import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Configurator } from '@/components/configurator'
import { useSettings } from '@/components/settings-provider'

function ConfigureInner() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const positionId = searchParams.get('position')
  const { t } = useSettings()

  if (!positionId) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center text-sm text-muted-foreground">
        {t('configure.noPosition')}
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
