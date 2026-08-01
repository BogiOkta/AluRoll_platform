export type ApplicationId = 'window' | 'door' | 'large'

export type MountingId = 'front' | 'built-in' | 'new-build'

export type ProfileId = 'everyday' | 'strong' | 'insulated'

export type OperationId = 'strap' | 'crank' | 'motor' | 'motor-remote' | 'smart'

export type ExtraId = 'insect-screen' | 'solar' | 'obstacle-stop' | 'timer'

export interface Configuration {
  application?: ApplicationId
  width?: number // mm
  height?: number // mm
  mounting?: MountingId
  profile?: ProfileId
  color?: string // hex
  operation?: OperationId
  extras: ExtraId[]
}

export interface Position {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  config: Configuration
}

export interface Project {
  id: string
  name: string
  client: string
  reference: string
  createdAt: number
  updatedAt: number
  positions: Position[]
}
