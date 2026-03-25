/**
 * Reusable streak/combo system for minigames.
 * Tracks consecutive correct actions and fires milestone callbacks.
 * Soft reset on error — no punishment, just resets streak.
 */

import { ref, computed } from 'vue'

export interface StreakMilestone {
  streak: number
  label: string
}

const MILESTONES: StreakMilestone[] = [
  { streak: 2, label: '¡Bien!' },
  { streak: 3, label: '🔥 ¡Racha!' },
  { streak: 5, label: '🔥🔥 ¡Increíble!' },
  { streak: 7, label: '🔥🔥🔥 ¡Imparable!' },
  { streak: 10, label: '⭐ ¡LEGENDARIO!' },
]

export function useStreakSystem(onMilestone?: (milestone: StreakMilestone) => void) {
  const streak = ref(0)
  const bestStreak = ref(0)
  const totalHits = ref(0)
  const totalMisses = ref(0)

  const isOnFire = computed(() => streak.value >= 3)

  const streakLabel = computed(() => {
    for (let i = MILESTONES.length - 1; i >= 0; i--) {
      if (streak.value >= MILESTONES[i].streak) return MILESTONES[i].label
    }
    return ''
  })

  const streakLevel = computed(() => {
    if (streak.value >= 7) return 3
    if (streak.value >= 5) return 2
    if (streak.value >= 3) return 1
    return 0
  })

  function hit() {
    streak.value++
    totalHits.value++
    if (streak.value > bestStreak.value) bestStreak.value = streak.value

    // Check if we just crossed a milestone
    const milestone = MILESTONES.find(m => m.streak === streak.value)
    if (milestone && onMilestone) {
      onMilestone(milestone)
    }
  }

  function miss() {
    streak.value = 0
    totalMisses.value++
  }

  function reset() {
    streak.value = 0
    bestStreak.value = 0
    totalHits.value = 0
    totalMisses.value = 0
  }

  return {
    streak,
    bestStreak,
    totalHits,
    totalMisses,
    isOnFire,
    streakLabel,
    streakLevel,
    hit,
    miss,
    reset,
  }
}
