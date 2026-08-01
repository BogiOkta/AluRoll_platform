'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ClipboardCheck, Plus } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { PositionCard } from '@/components/position-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { isConfigComplete } from '@/lib/config-schema'

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { getProject, addPosition } = useApp()
  const project = getProject(params.id)

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

  const total = project.positions.length
  const complete = project.positions.filter((p) => isConfigComplete(p.config)).length
  const pct = total === 0 ? 0 : Math.round((complete / total) * 100)

  function handleAdd() {
    const pos = addPosition(project!.id)
    router.push(`/dashboard/projects/${project!.id}/configure?position=${pos.id}`)
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Projects
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <Badge variant="neutral" className="font-mono">
              {project.reference}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span>
              Client: <span className="font-medium text-foreground">{project.client}</span>
            </span>
            <span>
              {total} {total === 1 ? 'position' : 'positions'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="lg" className="h-10" onClick={handleAdd}>
            <Plus className="size-4" />
            Add position
          </Button>
          <Button
            size="lg"
            className="h-10"
            disabled={total === 0}
            onClick={() => router.push(`/dashboard/projects/${project.id}/review`)}
          >
            <ClipboardCheck className="size-4" />
            Review project
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Project progress</span>
          <span className="text-muted-foreground">
            {complete} of {total} positions ready
          </span>
        </div>
        <Progress value={pct} />
      </div>

      {/* Positions */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Positions</h2>
      </div>

      {total === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="text-sm font-medium">No positions yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add your first position to start configuring a roller shutter for this project.
          </p>
          <Button className="mt-5 h-10" size="lg" onClick={handleAdd}>
            <Plus className="size-4" />
            Add position
          </Button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {project.positions.map((position) => (
            <PositionCard key={position.id} projectId={project.id} position={position} />
          ))}
        </div>
      )}
    </div>
  )
}
