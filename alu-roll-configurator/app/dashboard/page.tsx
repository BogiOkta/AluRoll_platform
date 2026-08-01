'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, LayoutGrid, Plus, Search, Table2 } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { CreateProjectModal } from '@/components/create-project-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatRelative } from '@/lib/format'
import { isConfigComplete } from '@/lib/config-schema'
import type { Project } from '@/lib/types'

function projectStats(project: Project) {
  const total = project.positions.length
  const complete = project.positions.filter((p) => isConfigComplete(p.config)).length
  const pct = total === 0 ? 0 : Math.round((complete / total) * 100)
  return { total, complete, pct }
}

export default function DashboardPage() {
  const { projects } = useApp()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q),
    )
  }, [projects, query])

  const recent = useMemo(
    () => [...projects].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3),
    [projects],
  )

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage your roller shutter configurations.
        </p>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <section className="mt-7">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Recent
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((project) => {
              const stats = projectStats(project)
              return (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{project.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {project.client}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {stats.total} {stats.total === 1 ? 'position' : 'positions'}
                    </span>
                    <span>{formatRelative(project.updatedAt)}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
            aria-label="Search projects"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                view === 'grid'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('table')}
              className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                view === 'table'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Table view"
              aria-pressed={view === 'table'}
            >
              <Table2 className="size-4" />
            </button>
          </div>
          <Button size="lg" className="h-10" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            New project
          </Button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="text-sm font-medium">No projects found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search, or create a new project.
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const stats = projectStats(project)
            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{project.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <Badge variant="neutral" className="font-mono">
                    {project.reference}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {stats.complete} of {stats.total} ready
                    </span>
                    <span>{stats.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${stats.pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
                  <span>
                    {stats.total} {stats.total === 1 ? 'position' : 'positions'}
                  </span>
                  <span>Updated {formatRelative(project.updatedAt)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Reference</th>
                <th className="px-4 py-3 font-medium">Positions</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Progress</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const stats = projectStats(project)
                return (
                  <tr
                    key={project.id}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="flex flex-col"
                      >
                        <span className="font-medium">{project.name}</span>
                        <span className="text-xs text-muted-foreground">{project.client}</span>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                      {project.reference}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{stats.total}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${stats.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{stats.pct}%</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                      {formatRelative(project.updatedAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
