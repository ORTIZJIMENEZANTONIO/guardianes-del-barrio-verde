<template>
  <div class="detect-game">
    <SceneSky :variant="skyVariant" />
    <SceneStreet :variant="streetVariant" />

    <div class="game-hint">
      {{ hint }} · {{ successLabel }}: {{ found }}/{{ total }}
    </div>

    <div class="detect-scene">
      <div
        v-for="spot in spots"
        :key="spot.id"
        class="detect-spot game-zone"
        :class="{
          'detect-spot--tapped': spot.tapped,
          'detect-spot--success game-zone--filled': spot.tapped && spot.isTarget,
          'detect-spot--ok': spot.tapped && !spot.isTarget,
        }"
        :style="{ left: spot.x + '%', top: spot.y + '%', width: spot.w + 'px', height: spot.h + 'px' }"
        @click="tapSpot(spot)"
      >
        <span class="detect-spot__icon game-zone__icon">{{ spot.emoji }}</span>
        <span class="detect-spot__label game-zone__label">{{ spot.label }}</span>
        <div v-if="spot.tapped" class="detect-spot__badge">
          {{ spot.isTarget ? targetBadge : okBadge }}
        </div>
      </div>
    </div>

    <!-- Streak badge -->
    <div class="detect-streak">
      <StreakBadge :streak="streakState.streak.value" :label="streakState.streakLabel.value" />
    </div>

    <!-- Progress panel -->
    <div class="detect-meter">
      <div class="meter-label">{{ meterLabel }}</div>
      <div class="meter-dots">
        <span v-for="i in total" :key="i" class="meter-dot" :class="{ 'meter-dot--found': i <= found }">
          {{ i <= found ? foundEmoji : '⬜' }}
        </span>
      </div>
    </div>

    <!-- Scene progress overlay (dirty→clean) -->
    <div class="scene-dirty-overlay" :style="{ opacity: sceneState.dirtyOpacity.value }" />

    <!-- Celebration flash -->
    <Transition name="fade">
      <div v-if="celebrations.showFlash.value" class="celebration-flash" />
    </Transition>

    <!-- Feedback -->
    <Transition name="fade">
      <div v-if="fb.feedback.value" class="game-feedback" :class="fb.feedback.value.ok ? 'game-feedback--ok' : 'game-feedback--no'">
        {{ fb.feedback.value.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'
import { useGameFeedback } from '~/composables/useGameFeedback'
import { useStreakSystem } from '~/composables/useStreakSystem'
import { useSceneProgress } from '~/composables/useSceneProgress'
import { useMiniCelebrations } from '~/composables/useMiniCelebrations'

export interface TapSpot {
  id: string
  label: string
  emoji: string
  isTarget: boolean
  x: number
  y: number
  w: number
  h: number
  message: string
}

const props = withDefaults(defineProps<{
  spotData: TapSpot[]
  total: number
  hint?: string
  successLabel?: string
  meterLabel?: string
  targetBadge?: string
  okBadge?: string
  foundEmoji?: string
  skyVariant?: string
  streetVariant?: string
  successColor?: string
}>(), {
  hint: '👆 Toca cada zona para revisar',
  successLabel: 'Encontrados',
  meterLabel: 'Progreso',
  targetBadge: '⚠️ Encontrado',
  okBadge: '✅ OK',
  foundEmoji: '✅',
  skyVariant: 'hot',
  streetVariant: 'dirty',
  successColor: '#3b82f6',
})

const emit = defineEmits<{
  complete: []
  update: [found: number, total: number]
}>()

const { celebrateSuccess, confettiBurst } = useGameAnimations()
const fb = { feedback: ref<{ message: string; ok: boolean } | null>(null) } as ReturnType<typeof useGameFeedback>

// Override fb with actual composable
const feedbackComposable = useGameFeedback()
fb.feedback = feedbackComposable.feedback

// Streak system
const celebrations = useMiniCelebrations(() => document.querySelector('.detect-game') as HTMLElement)
const streakState = useStreakSystem((milestone) => {
  celebrations.onStreakMilestone(milestone.streak)
})

// Scene progress
const sceneState = useSceneProgress((pct) => {
  celebrations.onProgressMilestone(pct)
})

const spots = ref<(TapSpot & { tapped: boolean })[]>([])
const found = ref(0)
const lastResult = ref<'ok' | 'error' | null>(null)
const isComplete = computed(() => found.value >= props.total)

function start() {
  spots.value = props.spotData.map(s => ({ ...s, tapped: false }))
  found.value = 0
  lastResult.value = null
  feedbackComposable.clear()
  streakState.reset()
  sceneState.reset(props.total)
}

function tapSpot(spot: TapSpot & { tapped: boolean }) {
  if (spot.tapped) return
  spot.tapped = true

  if (spot.isTarget) {
    found.value++
    streakState.hit()
    sceneState.increment()
    lastResult.value = 'ok'
    feedbackComposable.showOk(spot.message)
    nextTick(() => {
      const el = document.querySelector('.detect-spot--success:last-of-type')
      if (el) celebrateSuccess(el)
    })
  } else {
    streakState.miss()
    lastResult.value = 'error'
    feedbackComposable.showNo(spot.message)
  }

  // Clear lastResult after animation
  setTimeout(() => { lastResult.value = null }, 600)

  emit('update', found.value, props.total)

  if (isComplete.value) {
    const gameEl = document.querySelector('.detect-game')
    if (gameEl) confettiBurst(gameEl, 16)
    setTimeout(() => { emit('complete') }, 1000)
  }
}

function reset() { start() }

defineExpose({ start, reset, found, isComplete })
</script>

<style scoped>
.detect-game {
  width: 100%;
  height: 100%;
  display: flex;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.detect-scene {
  flex: 1;
  position: relative;
  z-index: 5;
}

.detect-spot {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(255,255,255,0.6);
  border: 2px dashed rgba(0,0,0,0.25);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  will-change: transform;
}

.detect-spot:active { transform: scale(0.95); }
.detect-spot--tapped { cursor: default; }

.detect-spot--success {
  background: rgba(59, 130, 246, 0.3);
  border-color: v-bind(successColor);
  border-style: solid;
}

.detect-spot--ok {
  background: rgba(82, 183, 136, 0.3);
  border-color: var(--color-green-light);
  border-style: solid;
}

.detect-spot__icon { font-size: 24px; }
.detect-spot__label { font-size: 10px; font-weight: 800; color: var(--color-text); }
.detect-spot__badge {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  animation: scaleIn 0.3s ease;
}

/* Meter panel */
.detect-meter {
  width: 60px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: rgba(255,255,255,0.9);
  gap: 6px;
  z-index: 5;
  position: relative;
}

.meter-label { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; }

.meter-dots {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.meter-dot { font-size: 18px; transition: all 0.3s ease; }
.meter-dot--found { animation: scaleIn 0.3s ease; }

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.detect-streak {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 20;
}

.scene-dirty-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(180, 120, 60, 0.15), rgba(120, 80, 40, 0.1));
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.6s ease;
}

.celebration-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.2), transparent 70%);
  pointer-events: none;
  z-index: 30;
  animation: flashPulse 0.4s ease-out forwards;
}

@keyframes flashPulse {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
