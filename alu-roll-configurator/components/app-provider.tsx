'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useSettings } from '@/components/settings-provider'
import type { Configuration, Position, Project } from '@/lib/types'
import { emptyConfig } from '@/lib/config-schema'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function now() {
  return Date.now()
}

const DAY = 86_400_000

function seedProjects(): Project[] {
  const t = now()
  return [
    {
      id: 'p-riverside',
      name: 'Riverside Residence',
      client: 'Meridian Build Group',
      reference: 'RIV-2041',
      createdAt: t - 8 * DAY,
      updatedAt: t - 2 * DAY,
      positions: [
        {
          id: uid(),
          name: 'Living room — front',
          createdAt: t - 8 * DAY,
          updatedAt: t - 2 * DAY,
          config: {
            application: 'large',
            width: 2800,
            height: 2400,
            mounting: 'built-in',
            profile: 'insulated',
            color: '#3f4548',
            operation: 'smart',
            extras: ['obstacle-stop', 'timer'],
          },
        },
        {
          id: uid(),
          name: 'Kitchen window',
          createdAt: t - 7 * DAY,
          updatedAt: t - 3 * DAY,
          config: {
            application: 'window',
            width: 1200,
            height: 1400,
            mounting: 'front',
            profile: 'everyday',
            color: '#f4f4f1',
            operation: 'motor-remote',
            extras: [],
          },
        },
        {
          id: uid(),
          name: 'Bedroom 1',
          createdAt: t - 6 * DAY,
          updatedAt: t - 6 * DAY,
          config: {
            application: 'window',
            width: 1000,
            height: 1300,
            mounting: 'front',
            profile: 'everyday',
            color: '#f4f4f1',
            extras: [],
          },
        },
      ],
    },
    {
      id: 'p-harbour',
      name: 'Harbour Office Fit-out',
      client: 'Northwind Interiors',
      reference: 'HRB-1188',
      createdAt: t - 20 * DAY,
      updatedAt: t - 12 * DAY,
      positions: [
        {
          id: uid(),
          name: 'Reception glazing',
          createdAt: t - 20 * DAY,
          updatedAt: t - 12 * DAY,
          config: {
            application: 'large',
            width: 3200,
            height: 2600,
            mounting: 'new-build',
            profile: 'strong',
            color: '#26292b',
            operation: 'motor',
            extras: ['obstacle-stop'],
          },
        },
      ],
    },
    {
      id: 'p-maple',
      name: 'Maple Street Retrofit',
      client: 'Private client',
      reference: 'MPL-3007',
      createdAt: t - 40 * DAY,
      updatedAt: t - 30 * DAY,
      positions: [],
    },
  ]
}

interface AppContextValue {
  user: { name: string; email: string; company: string } | null
  login: (email: string) => void
  logout: () => void

  projects: Project[]
  getProject: (id: string) => Project | undefined

  createProject: (data: { name: string; client: string; reference: string }) => Project
  deleteProject: (id: string) => void

  addPosition: (projectId: string, name?: string) => Position
  updatePosition: (
    projectId: string,
    positionId: string,
    updates: { name?: string; config?: Configuration },
  ) => void
  duplicatePosition: (projectId: string, positionId: string) => Position | undefined
  deletePosition: (projectId: string, positionId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { t } = useSettings()
  const [user, setUser] = useState<AppContextValue['user']>({
    name: 'Alex Meridian',
    email: 'alex@meridianbuild.com',
    company: 'Meridian Build Group',
  })
  const [projects, setProjects] = useState<Project[]>(seedProjects)

  const login = useCallback((email: string) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ')
    setUser({
      name: name.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Account',
      email,
      company: 'Meridian Build Group',
    })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  )

  const createProject = useCallback(
    (data: { name: string; client: string; reference: string }) => {
      const project: Project = {
        id: uid(),
        name: data.name,
        client: data.client || t('createProject.defaultClient'),
        reference: data.reference || `AR-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: now(),
        updatedAt: now(),
        positions: [],
      }
      setProjects((prev) => [project, ...prev])
      return project
    },
    [t],
  )

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const touchProject = (p: Project): Project => ({ ...p, updatedAt: now() })

  const addPosition = useCallback(
    (projectId: string, name?: string) => {
      const position: Position = {
        id: uid(),
        name: name ?? t('project.newPositionName'),
        createdAt: now(),
        updatedAt: now(),
        config: emptyConfig(),
      }
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? touchProject({ ...p, positions: [...p.positions, position] })
            : p,
        ),
      )
      return position
    },
    [t],
  )

  const updatePosition = useCallback(
    (
      projectId: string,
      positionId: string,
      updates: { name?: string; config?: Configuration },
    ) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? touchProject({
                ...p,
                positions: p.positions.map((pos) =>
                  pos.id === positionId
                    ? {
                        ...pos,
                        name: updates.name ?? pos.name,
                        config: updates.config ?? pos.config,
                        updatedAt: now(),
                      }
                    : pos,
                ),
              })
            : p,
        ),
      )
    },
    [],
  )

  const duplicatePosition = useCallback(
    (projectId: string, positionId: string) => {
      let created: Position | undefined
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p
          const source = p.positions.find((pos) => pos.id === positionId)
          if (!source) return p
          created = {
            ...source,
            id: uid(),
            name: t('project.copySuffix', { name: source.name }),
            createdAt: now(),
            updatedAt: now(),
            config: { ...source.config, extras: [...source.config.extras] },
          }
          const index = p.positions.findIndex((pos) => pos.id === positionId)
          const next = [...p.positions]
          next.splice(index + 1, 0, created)
          return touchProject({ ...p, positions: next })
        }),
      )
      return created
    },
    [t],
  )

  const deletePosition = useCallback((projectId: string, positionId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? touchProject({
              ...p,
              positions: p.positions.filter((pos) => pos.id !== positionId),
            })
          : p,
      ),
    )
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      login,
      logout,
      projects,
      getProject,
      createProject,
      deleteProject,
      addPosition,
      updatePosition,
      duplicatePosition,
      deletePosition,
    }),
    [
      user,
      login,
      logout,
      projects,
      getProject,
      createProject,
      deleteProject,
      addPosition,
      updatePosition,
      duplicatePosition,
      deletePosition,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
