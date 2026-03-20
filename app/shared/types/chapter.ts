export type SceneType = 'cinematic' | 'dialogue' | 'exploration' | 'mission' | 'transformation' | 'summary' | 'hook'

export type ChapterPhase = 'locked' | 'intro' | 'active' | 'complete'

export interface Scene {
  id: string
  type: SceneType
  dialoguePoolId?: string
  missionId?: string
  background?: string
}

export interface ChapterConfig {
  id: string
  title: string
  subtitle: string
  description: string
  color: string
  icon: string
  scenes: Scene[]
  missionIds: string[]
  completionReward: {
    points: number
    badge: string
    badgeTitle: string
    unlock: string
  }
}
