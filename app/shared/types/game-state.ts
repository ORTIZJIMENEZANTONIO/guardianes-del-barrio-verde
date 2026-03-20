export type GamePhase = 'menu' | 'playing' | 'cinematic' | 'paused' | 'summary'

export interface PlayerProgress {
  score: number
  seeds: number
  waterDrops: number
  greenLeaves: number
  badges: string[]
  completedMissions: string[]
  completedChapters: string[]
  currentChapter: string | null
  currentScene: number
}

export interface ZoneState {
  transformationLevel: number
  unlockedElements: string[]
  trashCleaned: number
  heatPointsDetected: number
  treesPlanted: number
  leaksFixed: number
  decorItemsPlaced: number
}

export interface GameSettings {
  musicVolume: number
  sfxVolume: number
  textSpeed: 'slow' | 'normal' | 'fast'
}

export interface SaveData {
  version: number
  player: PlayerProgress
  zones: Record<string, ZoneState>
  settings: GameSettings
  timestamp: number
}
