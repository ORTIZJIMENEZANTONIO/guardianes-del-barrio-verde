/**
 * Tracks mission progress and exposes reactive values for visual scene transformation.
 * Enables progressive "dirty→clean", "hot→cool", "gray→green" transitions during gameplay.
 *
 * Usage: bind returned CSS vars to overlay elements or use progress directly.
 */

import { ref, computed, watch } from 'vue'

export type ProgressMilestone = 25 | 50 | 75 | 100

export function useSceneProgress(onMilestone?: (pct: ProgressMilestone) => void) {
  const completed = ref(0)
  const total = ref(1)

  const progress = computed(() => total.value > 0 ? completed.value / total.value : 0)
  const progressPct = computed(() => Math.round(progress.value * 100))

  // Reactive CSS-ready values (0 to 1)
  const dirtyOpacity = computed(() => Math.max(0, 1 - progress.value * 1.3))
  const cleanOpacity = computed(() => Math.min(1, progress.value * 1.2))
  const temperature = computed(() => Math.max(0, 1 - progress.value))

  // Track which milestones have fired
  const firedMilestones = ref(new Set<number>())

  watch(progressPct, (pct) => {
    const milestones: ProgressMilestone[] = [25, 50, 75, 100]
    for (const m of milestones) {
      if (pct >= m && !firedMilestones.value.has(m)) {
        firedMilestones.value.add(m)
        onMilestone?.(m)
      }
    }
  })

  function setProgress(done: number, of: number) {
    completed.value = done
    total.value = of
  }

  function increment() {
    completed.value++
  }

  function reset(newTotal?: number) {
    completed.value = 0
    if (newTotal !== undefined) total.value = newTotal
    firedMilestones.value.clear()
  }

  return {
    completed,
    total,
    progress,
    progressPct,
    dirtyOpacity,
    cleanOpacity,
    temperature,
    setProgress,
    increment,
    reset,
  }
}
