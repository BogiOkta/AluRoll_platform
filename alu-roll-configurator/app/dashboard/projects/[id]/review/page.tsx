'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CircleAlert, CircleCheck, Plus } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { PositionCard } from '@/components/position-card'
import { useSettings } from '@/components/settings-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { isConfigComplete } from '@/lib/config-schema'
import { positionWord } from '@/lib/format'

export default function ReviewPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { getProject, addPosition } = useApp()
  const { t, language } = useSettings()
  const project = getProject(params.id)
  const [confirmed, setConfirmed] = useState(false)

  const stats = useMemo(() => {
    if (!project) return { total: 0, ready: 0, incomplete: 0 }
    const total = project.positions.length
    const ready = project.positions.filter((p) => isConfigComplete(p.config)).length
    return { total, ready, incomplete: total - ready }
  }, [project])

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center">
        <p className="text-sm font-medium">{t('project.notFound')}</p>
        <Link
          href="/dashboard"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t('project.backToProjects')}
        </Link>
      </div>
    )
  }

  const allReady = stats.total > 0 && stats.incomplete === 0

  function handleAdd() {
    const pos = addPosition(project!.id)
    router.push(`/dashboard/projects/${project!.id}/configure?position=${pos.id}`)
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <Link
        href={`/dashboard/projects/${project.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {project.name}
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t('review.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('review.subtitle')}</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Positions */}
        <div className="flex flex-col gap-3">
          {project.positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
              <p className="text-sm font-medium">{t('review.emptyTitle')}</p>
              <Button className="mt-4 h-10" size="lg" onClick={handleAdd}>
                <Plus className="size-4" />
                {t('review.addPosition')}
              </Button>
            </div>
          ) : (
            project.positions.map((position) => (
              <PositionCard key={position.id} projectId={project.id} position={position} />
            ))
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div>
              <h2 className="font-semibold">{t('review.summary')}</h2>
              <p className="text-xs text-muted-foreground">{project.reference}</p>
            </div>

            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t('review.client')}</dt>
                <dd className="font-medium">{project.client}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t('review.positions')}</dt>
                <dd className="font-medium">{stats.total}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t('review.ready')}</dt>
                <dd className="font-medium">{stats.ready}</dd>
              </div>
            </dl>

            <div className="rounded-lg border border-border bg-muted/40 p-3">
              {allReady ? (
                <div className="flex items-start gap-2 text-sm">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
                  <p className="text-muted-foreground">{t('review.allValid')}</p>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-sm">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
                  <p className="text-muted-foreground">
                    {stats.incomplete === 1
                      ? t('review.incompleteOne', { count: stats.incomplete })
                      : t('review.incompleteMany', { count: stats.incomplete })}
                  </p>
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="h-11 w-full"
              disabled={!allReady}
              onClick={() => setConfirmed(true)}
            >
              {t('review.confirm')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-10 w-full"
              onClick={handleAdd}
            >
              <Plus className="size-4" />
              {t('review.addPosition')}
            </Button>
          </div>
        </aside>
      </div>

      <Modal
        open={confirmed}
        onClose={() => setConfirmed(false)}
        title={t('review.confirmedTitle')}
        description={t('review.confirmedDescription', {
          name: project.name,
          count: stats.total,
          positions: positionWord(stats.total, t, language),
        })}
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
            <CircleCheck className="size-7" />
          </span>
          <p className="text-sm text-muted-foreground">{t('review.confirmedBody')}</p>
          <div className="mt-2 flex w-full flex-col gap-2">
            <Button
              size="lg"
              className="h-11 w-full"
              onClick={() => router.push('/dashboard')}
            >
              {t('project.backToProjects')}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="h-10 w-full"
              onClick={() => setConfirmed(false)}
            >
              {t('review.keepEditing')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bottom summary bar */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex items-center gap-2 text-sm">
          {allReady ? (
            <Badge variant="success">
              <CircleCheck className="size-3" />
              {t('review.readyToConfirm')}
            </Badge>
          ) : (
            <Badge variant="warning">
              <CircleAlert className="size-3" />
              {t('review.incompleteBadge', { count: stats.incomplete })}
            </Badge>
          )}
        </div>
        <Button size="lg" className="h-10" disabled={!allReady} onClick={() => setConfirmed(true)}>
          {t('review.confirm')}
        </Button>
      </div>
    </div>
  )
}
