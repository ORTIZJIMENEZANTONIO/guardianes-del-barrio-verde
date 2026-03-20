import { defineStore } from 'pinia'
import type { GamePhase } from '~/shared/types/game-state'

export const useGameStore = defineStore('game', {
  state: () => ({
    gamePhase: 'menu' as GamePhase,
    currentChapterId: null as string | null,
    currentSceneIndex: 0,
    currentMissionId: null as string | null,
    isFirstPlay: true,
  }),

  actions: {
    startGame() {
      this.gamePhase = 'playing'
      this.currentChapterId = 'chapter-1'
      this.currentSceneIndex = 0
      this.isFirstPlay = false
    },

    continueGame() {
      this.gamePhase = 'playing'
    },

    setScene(index: number) {
      this.currentSceneIndex = index
    },

    nextScene() {
      this.currentSceneIndex++
    },

    startMission(missionId: string) {
      this.currentMissionId = missionId
    },

    endMission() {
      this.currentMissionId = null
    },

    setPhase(phase: GamePhase) {
      this.gamePhase = phase
    },

    goToMenu() {
      this.gamePhase = 'menu'
    },
  },
})
