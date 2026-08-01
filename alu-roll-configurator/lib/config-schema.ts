import type { TranslateFn } from '@/lib/i18n'
import type {
  ApplicationId,
  Configuration,
  ExtraId,
  MountingId,
  OperationId,
  ProfileId,
} from './types'

export type StepId =
  | 'application'
  | 'dimensions'
  | 'mounting'
  | 'profile'
  | 'color'
  | 'operation'
  | 'extras'

export interface OptionBase<T extends string> {
  id: T
}

export const STEPS: { id: StepId }[] = [
  { id: 'application' },
  { id: 'dimensions' },
  { id: 'mounting' },
  { id: 'profile' },
  { id: 'color' },
  { id: 'operation' },
  { id: 'extras' },
]

export const APPLICATIONS: (OptionBase<ApplicationId> & {
  defaults: { width: number; height: number }
})[] = [
  { id: 'window', defaults: { width: 1200, height: 1400 } },
  { id: 'door', defaults: { width: 1000, height: 2100 } },
  { id: 'large', defaults: { width: 2800, height: 2400 } },
]

export const MOUNTINGS: OptionBase<MountingId>[] = [
  { id: 'front' },
  { id: 'built-in' },
  { id: 'new-build' },
]

export const PROFILES: (OptionBase<ProfileId> & {
  maxWidth: number
  maxHeight: number
})[] = [
  { id: 'everyday', maxWidth: 2000, maxHeight: 2200 },
  { id: 'insulated', maxWidth: 3000, maxHeight: 2800 },
  { id: 'strong', maxWidth: 4000, maxHeight: 3200 },
]

export const COLORS: { id: string; hex: string }[] = [
  { id: 'traffic-white', hex: '#f4f4f1' },
  { id: 'cream', hex: '#e9e2d0' },
  { id: 'silver', hex: '#c3c7ca' },
  { id: 'light-grey', hex: '#9aa0a4' },
  { id: 'anthracite', hex: '#3f4548' },
  { id: 'graphite', hex: '#26292b' },
  { id: 'sepia', hex: '#6b5a49' },
  { id: 'oxide', hex: '#7c3a35' },
]

export const OPERATIONS: (OptionBase<OperationId> & {
  maxAreaM2: number
  maxWidth: number
})[] = [
  { id: 'strap', maxAreaM2: 2.6, maxWidth: 1600 },
  { id: 'crank', maxAreaM2: 4.5, maxWidth: 2400 },
  { id: 'motor', maxAreaM2: 100, maxWidth: 6000 },
  { id: 'motor-remote', maxAreaM2: 100, maxWidth: 6000 },
  { id: 'smart', maxAreaM2: 100, maxWidth: 6000 },
]

export const EXTRAS: OptionBase<ExtraId>[] = [
  { id: 'insect-screen' },
  { id: 'solar' },
  { id: 'obstacle-stop' },
  { id: 'timer' },
]

export const DIMENSION_LIMITS = {
  width: { min: 400, max: 4000 },
  height: { min: 400, max: 3200 },
}

export function areaM2(config: Configuration): number {
  if (!config.width || !config.height) return 0
  return (config.width / 1000) * (config.height / 1000)
}

/** Profiles that can physically handle the chosen dimensions. */
export function availableProfiles(config: Configuration) {
  const w = config.width ?? 0
  const h = config.height ?? 0
  return PROFILES.filter((p) => w <= p.maxWidth && h <= p.maxHeight)
}

/** Operations valid for the chosen dimensions. */
export function availableOperations(config: Configuration) {
  const area = areaM2(config)
  const w = config.width ?? 0
  return OPERATIONS.filter((o) => area <= o.maxAreaM2 && w <= o.maxWidth)
}

/** Solar option only makes sense with a motor. */
export function availableExtras(config: Configuration) {
  const motorised =
    config.operation === 'motor' ||
    config.operation === 'motor-remote' ||
    config.operation === 'smart'
  return EXTRAS.filter((e) => (e.id === 'solar' ? motorised : true))
}

export function isStepComplete(config: Configuration, step: StepId): boolean {
  switch (step) {
    case 'application':
      return Boolean(config.application)
    case 'dimensions':
      return Boolean(
        config.width &&
          config.height &&
          config.width >= DIMENSION_LIMITS.width.min &&
          config.width <= DIMENSION_LIMITS.width.max &&
          config.height >= DIMENSION_LIMITS.height.min &&
          config.height <= DIMENSION_LIMITS.height.max,
      )
    case 'mounting':
      return Boolean(config.mounting)
    case 'profile':
      return Boolean(config.profile)
    case 'color':
      return Boolean(config.color)
    case 'operation':
      return Boolean(config.operation)
    case 'extras':
      return true // optional
    default:
      return false
  }
}

/** Steps required before a configuration is considered valid. */
export const REQUIRED_STEPS: StepId[] = [
  'application',
  'dimensions',
  'mounting',
  'profile',
  'color',
  'operation',
]

export function isConfigComplete(config: Configuration): boolean {
  return REQUIRED_STEPS.every((s) => isStepComplete(config, s))
}

export function configProgress(config: Configuration): number {
  const done = REQUIRED_STEPS.filter((s) => isStepComplete(config, s)).length
  return Math.round((done / REQUIRED_STEPS.length) * 100)
}

export function emptyConfig(): Configuration {
  return { extras: [] }
}

// ---- Localized display helpers ----------------------------------------

export function applicationLabel(id: ApplicationId | undefined, t: TranslateFn) {
  if (!id) return t('common.emDash')
  return t(`options.applications.${id}.label`)
}

export function mountingLabel(id: MountingId | undefined, t: TranslateFn) {
  if (!id) return t('common.emDash')
  return t(`options.mountings.${id}.label`)
}

export function profileLabel(id: ProfileId | undefined, t: TranslateFn) {
  if (!id) return t('common.emDash')
  return t(`options.profiles.${id}.label`)
}

export function operationLabel(id: OperationId | undefined, t: TranslateFn) {
  if (!id) return t('common.emDash')
  return t(`options.operations.${id}.label`)
}

export function colorLabel(hex: string | undefined, t: TranslateFn) {
  if (!hex) return t('common.emDash')
  const color = COLORS.find((c) => c.hex === hex)
  return color ? t(`options.colors.${color.id}`) : t('common.emDash')
}

export function extraLabel(id: ExtraId, t: TranslateFn) {
  return t(`options.extras.${id}.label`)
}

export function stepTitle(id: StepId, t: TranslateFn) {
  return t(`steps.${id}.title`)
}

export function stepQuestion(id: StepId, t: TranslateFn) {
  return t(`steps.${id}.question`)
}

export function stepHelp(id: StepId, t: TranslateFn) {
  return t(`steps.${id}.help`)
}
