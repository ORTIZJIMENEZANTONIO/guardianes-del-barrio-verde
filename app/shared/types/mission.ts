export type MissionType = 'drag-drop' | 'tap-detect' | 'pipe-fit' | 'placement' | 'observation' | 'scenario-choice' | 'memorama'

export type MissionPhase = 'locked' | 'available' | 'intro' | 'playing' | 'success' | 'failure' | 'complete'

export interface MissionReward {
  points: number
  seeds?: number
  badge?: string
  badgeTitle?: string
  visualUnlock?: string
}

export interface MissionObjective {
  id: string
  description: string
  target: number
  current: number
}

export interface MissionConfig {
  id: string
  chapterId: string
  title: string
  description: string
  type: MissionType
  objectives: MissionObjective[]
  timeLimit?: number
  reward: MissionReward
  introDialogueId: string
  successDialogueId: string
  failureDialogueId: string
}
