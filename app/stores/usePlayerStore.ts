import { defineStore } from 'pinia'

const SAVE_KEY = 'guardianes-save-v1'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    score: 0,
    seeds: 3,
    waterDrops: 0,
    greenLeaves: 0,
    badges: [] as string[],
    badgeTitles: {} as Record<string, string>,
    completedMissions: [] as string[],
    completedChapters: [] as string[],
  }),

  getters: {
    hasBadge: (state) => (badgeId: string) => state.badges.includes(badgeId),
    isMissionComplete: (state) => (missionId: string) => state.completedMissions.includes(missionId),
    isChapterComplete: (state) => (chapterId: string) => state.completedChapters.includes(chapterId),
    totalBadges: (state) => state.badges.length,
  },

  actions: {
    addScore(points: number) {
      this.score += points
    },

    addSeeds(count: number) {
      this.seeds += count
    },

    addWaterDrops(count: number) {
      this.waterDrops += count
    },

    awardBadge(badgeId: string, title: string) {
      if (!this.badges.includes(badgeId)) {
        this.badges.push(badgeId)
        this.badgeTitles[badgeId] = title
      }
    },

    completeMission(missionId: string) {
      if (!this.completedMissions.includes(missionId)) {
        this.completedMissions.push(missionId)
      }
    },

    completeChapter(chapterId: string) {
      if (!this.completedChapters.includes(chapterId)) {
        this.completedChapters.push(chapterId)
      }
    },

    saveProgress() {
      const data = {
        score: this.score,
        seeds: this.seeds,
        waterDrops: this.waterDrops,
        greenLeaves: this.greenLeaves,
        badges: this.badges,
        badgeTitles: this.badgeTitles,
        completedMissions: this.completedMissions,
        completedChapters: this.completedChapters,
        timestamp: Date.now(),
      }
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    },

    loadProgress() {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        this.score = data.score ?? 0
        this.seeds = data.seeds ?? 3
        this.waterDrops = data.waterDrops ?? 0
        this.greenLeaves = data.greenLeaves ?? 0
        this.badges = data.badges ?? []
        this.badgeTitles = data.badgeTitles ?? {}
        this.completedMissions = data.completedMissions ?? []
        this.completedChapters = data.completedChapters ?? []
        return true
      }
      return false
    },

    resetProgress() {
      this.score = 0
      this.seeds = 3
      this.waterDrops = 0
      this.greenLeaves = 0
      this.badges = []
      this.badgeTitles = {}
      this.completedMissions = []
      this.completedChapters = []
      localStorage.removeItem(SAVE_KEY)
    },
  },
})
