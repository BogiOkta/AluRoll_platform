'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CircleAlert, CircleCheck, Plus } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { PositionCard } from '@/components/position-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { isConfigComplete } from '@/lib/config-schema'

export default function ReviewPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { getProject, addPosition } = useApp()
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
        <p className="text-sm font-medium">Project not found</p>
        <Link
          href="/dashboard"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to projects
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
        <h1 className="text-2xl font-semibold tracking-tight">Review project</h1>
        <p className="text-sm text-muted-foreground">
          Check every position before confirming. You can still make quick edits here.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Positions */}
        <div className="flex flex-col gap-3">
          {project.positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
              <p className="text-sm font-medium">No positions to review</p>
              <Button className="mt-4 h-10" size="lg" onClick={handleAdd}>
                <Plus className="size-4" />
                Add position
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
              <h2 className="font-semibold">Project summary</h2>
              <p className="text-xs text-muted-foreground">{project.reference}</p>
            </div>

            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Client</dt>
                <dd className="font-medium">{project.client}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Positions</dt>
                <dd className="font-medium">{stats.total}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Ready</dt>
                <dd className="font-medium">{stats.ready}</dd>
              </div>
            </dl>

            <div className="rounded-lg border border-border bg-muted/40 p-3">
              {allReady ? (
                <div className="flex items-start gap-2 text-sm">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
                  <p className="text-muted-foreground">
                    All positions are technically valid and ready to confirm.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-sm">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
                  <p className="text-muted-foreground">
                    {stats.incomplete} {stats.incomplete === 1 ? 'position needs' : 'positions need'}{' '}
                    a few more choices before you can confirm.
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
              Confirm project
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-10 w-full"
              onClick={handleAdd}
            >
              <Plus className="size-4" />
              Add position
            </Button>
          </div>
        </aside>
      </div>

      <Modal
        open={confirmed}
        onClose={() => setConfirmed(false)}
        title="Project confirmed"
        description={`${project.name} has been confirmed with ${stats.total} ${
          stats.total === 1 ? 'position' : 'positions'
        }.`}
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
            <CircleCheck className="size-7" />
          </span>
          <p className="text-sm text-muted-foreground">
            Your configuration is complete. You can revisit or duplicate it any time from the
            dashboard.
          </p>
          <div className="mt-2 flex w-full flex-col gap-2">
            <Button
              size="lg"
              className="h-11 w-full"
              onClick={() => router.push('/dashboard')}
            >
              Back to projects
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="h-10 w-full"
              onClick={() => setConfirmed(false)}
            >
              Keep editing
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
              Ready to confirm
            </Badge>
          ) : (
            <Badge variant="warning">
              <CircleAlert className="size-3" />
              {stats.incomplete} incomplete
            </Badge>
          )}
        </div>
        <Button size="lg" className="h-10" disabled={!allReady} onClick={() => setConfirmed(true)}>
          Confirm project
        </Button>
      </div>
    </div>
  )
}
