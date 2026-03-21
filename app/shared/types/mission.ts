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

/** 1 = fácil, 2 = medio, 3 = difícil */
export type MissionDifficulty = 1 | 2 | 3

export interface MissionConfig {
  id: string
  chapterId: string
  title: string
  description: string
  type: MissionType
  difficulty: MissionDifficulty
  objectives: MissionObjective[]
  timeLimit?: number
  reward: MissionReward
  introDialogueId: string
  successDialogueId: string
  failureDialogueId: string
}
