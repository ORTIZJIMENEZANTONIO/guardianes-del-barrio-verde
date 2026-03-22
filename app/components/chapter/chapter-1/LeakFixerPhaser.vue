<template>
  <MinigameShell
    title="Reparar la fuga"
    description="Selecciona cada pieza y colócala en el lugar correcto."
    :completed="completed"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    :time-limit="45"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="leakfixer-game">
      <!-- SVG backgrounds (underneath Phaser canvas) -->
      <SceneSky variant="nice" />
      <SceneStreet variant="dirty" />

      <!-- Phaser canvas -->
      <PhaserCanvas
        v-if="gameStarted"
        ref="phaserRef"
        :scene-class="LeakFixerScene"
        :bridge="bridge"
      />

      <!-- Feedback toast (Vue overlay, above Phaser) -->
      <Transition name="fade">
        <div
          v-if="feedback"
          class="leakfixer-feedback"
          :class="feedback.ok ? 'fb--ok' : 'fb--no'"
        >
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Progress bar -->
      <div class="leakfixer-progress">
        <span class="leakfixer-progress__text">
          Piezas colocadas: {{ completed }}/5
        </span>
      </div>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { LeakFixerScene } from '~/phaser/scenes/chapter-1/LeakFixerScene'
import PhaserCanvas from '~/components/phaser/PhaserCanvas.vue'
import type { MinigameBridge } from '~/phaser/types'

defineEmits<{ complete: [] }>()

const completed = ref(0)
const isComplete = computed(() => completed.value >= 5)
const showResult = ref(false)
const gameStarted = ref(false)
const phaserRef = ref<any>(null)

// Feedback toast
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

// Bridge: Phaser → Vue
const bridge: MinigameBridge = {
  onItemCompleted: (_id: string, message: string) => {
    completed.value++
    showFB(message, true)
  },
  onAllCompleted: () => {
    setTimeout(() => { showResult.value = true }, 1000)
  },
  onFeedback: (message: string, ok: boolean) => {
    if (!ok) showFB(message, false)
  },
}

function onStart() {
  completed.value = 0
  showResult.value = false
  gameStarted.value = true
}

function onTimeout() {
  showResult.value = true
}

function resetGame() {
  completed.value = 0
  showResult.value = false
  gameStarted.value = false
  // Re-mount Phaser canvas
  nextTick(() => {
    gameStarted.value = true
  })
}
</script>

<style scoped>
.leakfixer-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  touch-action: none;
}

/* Feedback toast */
.leakfixer-feedback {
  position: absolute;
  top: 45%;
  left: 40%;
  transform: translate(-50%, -50%);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 800;
  font-size: 14px;
  z-index: 50;
  animation: scaleIn 0.3s ease;
  text-align: center;
  max-width: 280px;
  box-shadow: var(--shadow-lg);
}

.fb--ok {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.fb--no {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

/* Progress bar */
.leakfixer-progress {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 3px solid rgba(0, 0, 0, 0.08);
  text-align: center;
  z-index: 10;
  position: relative;
}

.leakfixer-progress__text {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
