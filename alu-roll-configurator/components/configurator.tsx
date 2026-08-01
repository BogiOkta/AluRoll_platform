'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Bug,
  Building2,
  Check,
  CircleAlert,
  Clock,
  DoorOpen,
  Maximize2,
  PanelTop,
  Radio,
  RotateCw,
  ShieldCheck,
  Smartphone,
  SquareStack,
  Sun,
  Zap,
} from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { ShutterPreview } from '@/components/shutter-preview'
import { OptionCard } from '@/components/wizard/option-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  APPLICATIONS,
  COLORS,
  DIMENSION_LIMITS,
  EXTRAS,
  MOUNTINGS,
  OPERATIONS,
  PROFILES,
  STEPS,
  areaM2,
  availableExtras,
  availableOperations,
  availableProfiles,
  applicationLabel,
  colorLabel,
  configProgress,
  extraLabel,
  isConfigComplete,
  isStepComplete,
  mountingLabel,
  operationLabel,
  profileLabel,
  type StepId,
} from '@/lib/config-schema'
import { formatDimensions } from '@/lib/format'
import type {
  ApplicationId,
  Configuration,
  ExtraId,
  MountingId,
  OperationId,
  ProfileId,
} from '@/lib/types'
import { cn } from '@/lib/utils'

const APP_ICONS: Record<ApplicationId, React.ReactNode> = {
  window: <AppWindow className="size-4.5" />,
  door: <DoorOpen className="size-4.5" />,
  large: <Maximize2 className="size-4.5" />,
}
const MOUNT_ICONS: Record<MountingId, React.ReactNode> = {
  front: <SquareStack className="size-4.5" />,
  'built-in': <PanelTop className="size-4.5" />,
  'new-build': <Building2 className="size-4.5" />,
}
const OP_ICONS: Record<OperationId, React.ReactNode> = {
  strap: <ArrowRight className="size-4.5" />,
  crank: <RotateCw className="size-4.5" />,
  motor: <Zap className="size-4.5" />,
  'motor-remote': <Radio className="size-4.5" />,
  smart: <Smartphone className="size-4.5" />,
}
const EXTRA_ICONS: Record<ExtraId, React.ReactNode> = {
  'insect-screen': <Bug className="size-4.5" />,
  solar: <Sun className="size-4.5" />,
  'obstacle-stop': <ShieldCheck className="size-4.5" />,
  timer: <Clock className="size-4.5" />,
}

/** Remove any selections that are no longer valid for the given config. */
function sanitize(config: Configuration): Configuration {
  const next = { ...config, extras: [...config.extras] }
  if (next.profile && !availableProfiles(next).some((p) => p.id === next.profile)) {
    next.profile = undefined
  }
  if (next.operation && !availableOperations(next).some((o) => o.id === next.operation)) {
    next.operation = undefined
  }
  const validExtras = availableExtras(next).map((e) => e.id)
  next.extras = next.extras.filter((e) => validExtras.includes(e))
  return next
}

export function Configurator({
  projectId,
  positionId,
}: {
  projectId: string
  positionId: string
}) {
  const router = useRouter()
  const { getProject, updatePosition } = useApp()
  const project = getProject(projectId)
  const position = project?.positions.find((p) => p.id === positionId)

  const [config, setConfig] = useState<Configuration>(
    () => position?.config ?? { extras: [] },
  )
  const [name, setName] = useState(() => position?.name ?? 'New position')
  const [stepIndex, setStepIndex] = useState(0)
  const [openPercent, setOpenPercent] = useState(60)

  const configRef = useRef(config)
  useEffect(() => {
    configRef.current = config
  }, [config])

  const step = STEPS[stepIndex]

  const apply = useCallback(
    (partial: Partial<Configuration>) => {
      const merged = sanitize({ ...configRef.current, ...partial })
      configRef.current = merged
      setConfig(merged)
      updatePosition(projectId, positionId, { config: merged })
    },
    [projectId, positionId, updatePosition],
  )

  const commitName = useCallback(
    (value: string) => {
      setName(value)
      updatePosition(projectId, positionId, { name: value || 'Untitled position' })
    },
    [projectId, positionId, updatePosition],
  )

  const stepComplete = isStepComplete(config, step.id)
  const progress = configProgress(config)
  const isLast = stepIndex === STEPS.length - 1

  function goNext() {
    if (isLast) {
      router.push(`/dashboard/projects/${projectId}`)
      return
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  }
  function goBack() {
    if (stepIndex === 0) {
      router.push(`/dashboard/projects/${projectId}`)
      return
    }
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  if (!project || !position) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center text-sm text-muted-foreground">
        Position not found.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-6">
      {/* Step rail */}
      <StepRail config={config} current={step.id} onJump={(i) => setStepIndex(i)} index={stepIndex} />

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_320px]">
        {/* LEFT — question + controls */}
        <section className="flex flex-col">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
          <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-balance">
            {step.question}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.help}</p>

          <div className="mt-5">
            <StepControls config={config} step={step.id} apply={apply} />
          </div>
        </section>

        {/* CENTER — live preview */}
        <section className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="aspect-[4/3] bg-secondary">
              <ShutterPreview config={config} openPercent={openPercent} />
            </div>
            <div className="flex items-center gap-3 border-t border-border px-4 py-3">
              <span className="text-xs font-medium text-muted-foreground">Open</span>
              <input
                type="range"
                min={0}
                max={100}
                value={openPercent}
                onChange={(e) => setOpenPercent(Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                aria-label="Preview open and close position"
              />
              <span className="text-xs font-medium text-muted-foreground">Closed</span>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Drag to see the shutter open and close.
          </p>
        </section>

        {/* RIGHT — summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pos-name" className="text-xs font-medium text-muted-foreground">
                Position name
              </label>
              <Input
                id="pos-name"
                value={name}
                onChange={(e) => commitName(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="border-t border-border" />

            <SummaryList config={config} activeStep={step.id} onJump={(i) => setStepIndex(i)} />

            <div className="border-t border-border" />

            <div className="flex items-center gap-2">
              {isConfigComplete(config) ? (
                <Badge variant="success">
                  <Check className="size-3" />
                  Valid configuration
                </Badge>
              ) : (
                <Badge variant="warning">
                  <CircleAlert className="size-3" />
                  {6 - REQUIRED_DONE(config)} choices left
                </Badge>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky nav bar */}
      <div className="sticky bottom-0 z-30 mt-6 border-t border-border bg-background/85 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Button variant="ghost" size="lg" className="h-11" onClick={goBack}>
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="h-11"
              onClick={() => router.push(`/dashboard/projects/${projectId}`)}
            >
              Save draft
            </Button>
            <Button
              size="lg"
              className="h-11"
              disabled={!stepComplete && step.id !== 'extras'}
              onClick={goNext}
            >
              {isLast ? 'Finish' : 'Next'}
              {!isLast && <ArrowRight className="size-4" />}
              {isLast && <Check className="size-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function REQUIRED_DONE(config: Configuration) {
  return configProgress(config) === 0
    ? 0
    : Math.round((configProgress(config) / 100) * 6)
}

// ---- Step rail ---------------------------------------------------------

function StepRail({
  config,
  current,
  index,
  onJump,
}: {
  config: Configuration
  current: StepId
  index: number
  onJump: (i: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done = isStepComplete(config, s.id) && s.id !== current
        const active = s.id === current
        const reachable = i <= index || isStepComplete(config, STEPS[Math.max(0, i - 1)].id)
        return (
          <button
            key={s.id}
            type="button"
            disabled={!reachable}
            onClick={() => reachable && onJump(i)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : done
                  ? 'bg-primary/10 text-primary hover:bg-primary/15'
                  : 'text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent',
            )}
          >
            <span
              className={cn(
                'flex size-4.5 items-center justify-center rounded-full text-[10px]',
                active
                  ? 'bg-primary-foreground/20'
                  : done
                    ? 'bg-primary/15'
                    : 'bg-muted',
              )}
            >
              {done ? <Check className="size-3" /> : i + 1}
            </span>
            {s.title}
          </button>
        )
      })}
    </div>
  )
}

// ---- Summary list ------------------------------------------------------

function SummaryList({
  config,
  activeStep,
  onJump,
}: {
  config: Configuration
  activeStep: StepId
  onJump: (i: number) => void
}) {
  const rows: { step: StepId; label: string; value: string }[] = [
    { step: 'application', label: 'Application', value: applicationLabel(config.application) },
    { step: 'dimensions', label: 'Size', value: formatDimensions(config.width, config.height) },
    { step: 'mounting', label: 'Fitting', value: mountingLabel(config.mounting) },
    { step: 'profile', label: 'Type', value: profileLabel(config.profile) },
    { step: 'color', label: 'Colour', value: colorLabel(config.color) },
    { step: 'operation', label: 'Operation', value: operationLabel(config.operation) },
    {
      step: 'extras',
      label: 'Extras',
      value: config.extras.length ? config.extras.map(extraLabel).join(', ') : 'None',
    },
  ]

  return (
    <dl className="flex flex-col">
      {rows.map((row) => {
        const idx = STEPS.findIndex((s) => s.id === row.step)
        const set = row.value !== '—'
        return (
          <button
            key={row.step}
            type="button"
            onClick={() => onJump(idx)}
            className={cn(
              'flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted/60',
              activeStep === row.step && 'bg-muted/60',
            )}
          >
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd
              className={cn(
                'truncate text-xs font-medium',
                set ? 'text-foreground' : 'text-muted-foreground/60',
              )}
            >
              {row.value}
            </dd>
          </button>
        )
      })}
    </dl>
  )
}

// ---- Step controls -----------------------------------------------------

function StepControls({
  config,
  step,
  apply,
}: {
  config: Configuration
  step: StepId
  apply: (partial: Partial<Configuration>) => void
}) {
  switch (step) {
    case 'application':
      return (
        <div className="grid gap-2.5">
          {APPLICATIONS.map((a) => (
            <OptionCard
              key={a.id}
              label={a.label}
              description={a.description}
              icon={APP_ICONS[a.id]}
              selected={config.application === a.id}
              onSelect={() =>
                apply({
                  application: a.id,
                  width: config.width ?? a.defaults.width,
                  height: config.height ?? a.defaults.height,
                })
              }
            />
          ))}
        </div>
      )

    case 'dimensions':
      return <DimensionControls config={config} apply={apply} />

    case 'mounting':
      return (
        <div className="grid gap-2.5">
          {MOUNTINGS.map((m) => (
            <OptionCard
              key={m.id}
              label={m.label}
              description={m.description}
              icon={MOUNT_ICONS[m.id]}
              selected={config.mounting === m.id}
              onSelect={() => apply({ mounting: m.id })}
            />
          ))}
        </div>
      )

    case 'profile': {
      const available = availableProfiles(config)
      return (
        <div className="grid gap-2.5">
          {available.map((p) => (
            <OptionCard
              key={p.id}
              label={p.label}
              description={p.description}
              selected={config.profile === p.id}
              onSelect={() => apply({ profile: p.id as ProfileId })}
            />
          ))}
          {available.length < PROFILES.length && (
            <p className="px-1 text-xs text-muted-foreground">
              Some types are hidden because they are not suitable for this size.
            </p>
          )}
        </div>
      )
    }

    case 'color':
      return (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {COLORS.map((c) => {
            const selected = config.color === c.hex
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => apply({ color: c.hex })}
                aria-pressed={selected}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-3 transition-all',
                  selected
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/40',
                )}
              >
                <span
                  className="size-12 rounded-lg border border-black/10 shadow-inner"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <span className="text-center text-xs font-medium leading-tight">{c.label}</span>
              </button>
            )
          })}
        </div>
      )

    case 'operation': {
      const available = availableOperations(config)
      return (
        <div className="grid gap-2.5">
          {available.map((o) => (
            <OptionCard
              key={o.id}
              label={o.label}
              description={o.description}
              icon={OP_ICONS[o.id]}
              selected={config.operation === o.id}
              onSelect={() => apply({ operation: o.id as OperationId })}
            />
          ))}
          {available.length < OPERATIONS.length && (
            <p className="px-1 text-xs text-muted-foreground">
              Manual options are hidden for larger shutters, where a motor is recommended.
            </p>
          )}
        </div>
      )
    }

    case 'extras': {
      const available = availableExtras(config)
      return (
        <div className="grid gap-2.5">
          {available.map((e) => {
            const selected = config.extras.includes(e.id)
            return (
              <OptionCard
                key={e.id}
                label={e.label}
                description={e.description}
                icon={EXTRA_ICONS[e.id]}
                selected={selected}
                onSelect={() =>
                  apply({
                    extras: selected
                      ? config.extras.filter((x) => x !== e.id)
                      : [...config.extras, e.id],
                  })
                }
              />
            )
          })}
          {available.length < EXTRAS.length && (
            <p className="px-1 text-xs text-muted-foreground">
              Solar power is available once a motorised operation is selected.
            </p>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

// ---- Dimension controls ------------------------------------------------

function DimensionControls({
  config,
  apply,
}: {
  config: Configuration
  apply: (partial: Partial<Configuration>) => void
}) {
  const area = areaM2(config)
  const presets = [
    { label: 'Small window', width: 800, height: 1000 },
    { label: 'Standard window', width: 1200, height: 1400 },
    { label: 'Patio door', width: 1600, height: 2100 },
    { label: 'Wide opening', width: 2800, height: 2400 },
  ]

  function field(key: 'width' | 'height', label: string) {
    const value = config[key]
    const limits = DIMENSION_LIMITS[key]
    const invalid = value !== undefined && (value < limits.min || value > limits.max)
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`dim-${key}`} className="text-sm font-medium">
          {label}
        </label>
        <div className="relative">
          <Input
            id={`dim-${key}`}
            type="number"
            inputMode="numeric"
            value={value ?? ''}
            min={limits.min}
            max={limits.max}
            aria-invalid={invalid}
            onChange={(e) =>
              apply({ [key]: e.target.value === '' ? undefined : Number(e.target.value) })
            }
            placeholder={`${limits.min}–${limits.max}`}
            className="pr-10"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
            mm
          </span>
        </div>
        {invalid && (
          <p className="text-xs text-destructive">
            Enter a value between {limits.min} and {limits.max} mm.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {field('width', 'Width')}
        {field('height', 'Height')}
      </div>

      {area > 0 && (
        <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          Opening area: <span className="font-medium text-foreground">{area.toFixed(2)} m²</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">Common sizes</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => apply({ width: p.width, height: p.height })}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-muted/60"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
