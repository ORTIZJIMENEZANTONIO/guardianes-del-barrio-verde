import { defineStore } from 'pinia'

const SAVE_KEY = 'guardianes-save-v1'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    playerName: '',
    playerAge: 10,
    score: 0,
    seeds: 3,
    waterDrops: 0,
    greenLeaves: 0,
    badges: [] as string[],
    badgeTitles: {} as Record<string, string>,
    completedMissions: [] as string[],
    completedChapters: [] as string[],
    avatarSkin: 0,       // 0-2 index
    avatarHair: 0,       // 0-3 index
    avatarAccessory: -1,  // -1 = none, 0-2 index
  }),

  getters: {
    hasBadge: (state) => (badgeId: string) => state.badges.includes(badgeId),
    isMissionComplete: (state) => (missionId: string) => state.completedMissions.includes(missionId),
    isChapterComplete: (state) => (chapterId: string) => state.completedChapters.includes(chapterId),
    totalBadges: (state) => state.badges.length,
    isRegistered: (state) => state.playerName.length > 0,
    /** Timer multiplier: younger kids get more time, older kids less */
    timerMultiplier: (state) => {
      if (state.playerAge <= 8) return 1.3
      if (state.playerAge <= 9) return 1.15
      if (state.playerAge <= 10) return 1.0
      if (state.playerAge <= 11) return 0.85
      return 0.75 // 12+
    },
    /** Older kids see fewer dialogue lines */
    isCompactDialogue: (state) => state.playerAge >= 11,
  },

  actions: {
    setProfile(name: string, age: number) {
      this.playerName = name
      this.playerAge = age
    },

    addScore(points: number) {
      this.score += points
    },

    setAvatar(skin: number, hair: number, accessory: number) {
      this.avatarSkin = skin
      this.avatarHair = hair
      this.avatarAccessory = accessory
    },

    spendSeeds(amount: number) {
      if (this.seeds >= amount) {
        this.seeds -= amount
        return true
      }
      return false
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
        playerName: this.playerName,
        playerAge: this.playerAge,
        score: this.score,
        seeds: this.seeds,
        waterDrops: this.waterDrops,
        greenLeaves: this.greenLeaves,
        badges: this.badges,
        badgeTitles: this.badgeTitles,
        completedMissions: this.completedMissions,
        completedChapters: this.completedChapters,
        avatarSkin: this.avatarSkin,
        avatarHair: this.avatarHair,
        avatarAccessory: this.avatarAccessory,
        timestamp: Date.now(),
      }
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    },

    loadProgress() {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        this.playerName = data.playerName ?? ''
        this.playerAge = data.playerAge ?? 10
        this.score = data.score ?? 0
        this.seeds = data.seeds ?? 3
        this.waterDrops = data.waterDrops ?? 0
        this.greenLeaves = data.greenLeaves ?? 0
        this.badges = data.badges ?? []
        this.badgeTitles = data.badgeTitles ?? {}
        this.completedMissions = data.completedMissions ?? []
        this.completedChapters = data.completedChapters ?? []
        this.avatarSkin = data.avatarSkin ?? 0
        this.avatarHair = data.avatarHair ?? 0
        this.avatarAccessory = data.avatarAccessory ?? -1
        return true
      }
      return false
    },

    resetProgress() {
      this.playerName = ''
      this.playerAge = 10
      this.score = 0
      this.seeds = 3
      this.waterDrops = 0
      this.greenLeaves = 0
      this.badges = []
      this.badgeTitles = {}
      this.completedMissions = []
      this.completedChapters = []
      this.avatarSkin = 0
      this.avatarHair = 0
      this.avatarAccessory = -1
      localStorage.removeItem(SAVE_KEY)
    },
  },
})
