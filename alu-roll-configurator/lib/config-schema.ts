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

export interface Option<T extends string> {
  id: T
  label: string
  description: string
}

export const STEPS: { id: StepId; title: string; question: string; help: string }[] = [
  {
    id: 'application',
    title: 'Application',
    question: 'Where will this shutter go?',
    help: 'This helps us suggest the right sizes and options for your opening.',
  },
  {
    id: 'dimensions',
    title: 'Size',
    question: 'How large is the opening?',
    help: 'Measure the width and height of the opening. We handle the technical tolerances for you.',
  },
  {
    id: 'mounting',
    title: 'Fitting',
    question: 'How should it be fitted?',
    help: 'Choose the option that matches the building situation.',
  },
  {
    id: 'profile',
    title: 'Type',
    question: 'What matters most for this shutter?',
    help: 'We only show types that are suitable for your chosen size.',
  },
  {
    id: 'color',
    title: 'Colour',
    question: 'Pick a colour',
    help: 'Choose from our most popular durable finishes.',
  },
  {
    id: 'operation',
    title: 'Operation',
    question: 'How would you like to open and close it?',
    help: 'Only options that work with your size are shown.',
  },
  {
    id: 'extras',
    title: 'Extras',
    question: 'Add anything else?',
    help: 'Optional additions. You can skip this step.',
  },
]

export const APPLICATIONS: (Option<ApplicationId> & {
  defaults: { width: number; height: number }
})[] = [
  {
    id: 'window',
    label: 'Window',
    description: 'A standard window opening.',
    defaults: { width: 1200, height: 1400 },
  },
  {
    id: 'door',
    label: 'Door or patio',
    description: 'A door or full-height glazed opening.',
    defaults: { width: 1000, height: 2100 },
  },
  {
    id: 'large',
    label: 'Large opening',
    description: 'A wide sliding door or shopfront.',
    defaults: { width: 2800, height: 2400 },
  },
]

export const MOUNTINGS: Option<MountingId>[] = [
  {
    id: 'front',
    label: 'On the wall',
    description: 'Fitted in front of the opening. Ideal for existing buildings.',
  },
  {
    id: 'built-in',
    label: 'Concealed',
    description: 'The box sits hidden behind the façade for a clean look.',
  },
  {
    id: 'new-build',
    label: 'Integrated',
    description: 'Built into the wall during construction or renovation.',
  },
]

export const PROFILES: (Option<ProfileId> & {
  maxWidth: number
  maxHeight: number
})[] = [
  {
    id: 'everyday',
    label: 'Everyday',
    description: 'Light and quiet. Perfect for most windows.',
    maxWidth: 2000,
    maxHeight: 2200,
  },
  {
    id: 'insulated',
    label: 'Best insulation',
    description: 'Extra foam core for warmth, quiet and comfort.',
    maxWidth: 3000,
    maxHeight: 2800,
  },
  {
    id: 'strong',
    label: 'Extra strong',
    description: 'Reinforced slats for large or exposed openings.',
    maxWidth: 4000,
    maxHeight: 3200,
  },
]

export const COLORS: { id: string; label: string; hex: string }[] = [
  { id: 'traffic-white', label: 'Traffic white', hex: '#f4f4f1' },
  { id: 'cream', label: 'Cream', hex: '#e9e2d0' },
  { id: 'silver', label: 'Silver grey', hex: '#c3c7ca' },
  { id: 'light-grey', label: 'Light grey', hex: '#9aa0a4' },
  { id: 'anthracite', label: 'Anthracite', hex: '#3f4548' },
  { id: 'graphite', label: 'Graphite black', hex: '#26292b' },
  { id: 'sepia', label: 'Sepia brown', hex: '#6b5a49' },
  { id: 'oxide', label: 'Oxide red', hex: '#7c3a35' },
]

export const OPERATIONS: (Option<OperationId> & {
  maxAreaM2: number
  maxWidth: number
})[] = [
  {
    id: 'strap',
    label: 'Belt',
    description: 'Manual belt inside the room. Simple and reliable.',
    maxAreaM2: 2.6,
    maxWidth: 1600,
  },
  {
    id: 'crank',
    label: 'Crank handle',
    description: 'Manual crank. Effortless for medium sizes.',
    maxAreaM2: 4.5,
    maxWidth: 2400,
  },
  {
    id: 'motor',
    label: 'Motorised',
    description: 'A quiet built-in motor with a wall switch.',
    maxAreaM2: 100,
    maxWidth: 6000,
  },
  {
    id: 'motor-remote',
    label: 'Motor + remote',
    description: 'Open and close from anywhere in the room.',
    maxAreaM2: 100,
    maxWidth: 6000,
  },
  {
    id: 'smart',
    label: 'Smart home',
    description: 'App control, schedules and voice assistants.',
    maxAreaM2: 100,
    maxWidth: 6000,
  },
]

export const EXTRAS: Option<ExtraId>[] = [
  {
    id: 'insect-screen',
    label: 'Insect screen',
    description: 'Integrated mesh to keep insects out.',
  },
  {
    id: 'solar',
    label: 'Solar powered',
    description: 'No wiring needed — charges from daylight.',
  },
  {
    id: 'obstacle-stop',
    label: 'Obstacle detection',
    description: 'Stops automatically if something is in the way.',
  },
  {
    id: 'timer',
    label: 'Automatic timer',
    description: 'Opens and closes on a daily schedule.',
  },
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

// ---- Display helpers ---------------------------------------------------

export function applicationLabel(id?: ApplicationId) {
  return APPLICATIONS.find((a) => a.id === id)?.label ?? '—'
}
export function mountingLabel(id?: MountingId) {
  return MOUNTINGS.find((m) => m.id === id)?.label ?? '—'
}
export function profileLabel(id?: ProfileId) {
  return PROFILES.find((p) => p.id === id)?.label ?? '—'
}
export function operationLabel(id?: OperationId) {
  return OPERATIONS.find((o) => o.id === id)?.label ?? '—'
}
export function colorLabel(hex?: string) {
  return COLORS.find((c) => c.hex === hex)?.label ?? '—'
}
export function extraLabel(id: ExtraId) {
  return EXTRAS.find((e) => e.id === id)?.label ?? id
}
