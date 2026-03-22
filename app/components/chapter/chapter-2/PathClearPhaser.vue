<template>
  <MinigameShell
    title="Despejar senderos"
    description="Arrastra cada obstáculo fuera del camino para abrir los senderos."
    :completed="cleared"
    :total="6"
    :is-success="isComplete"
    :show-result="showResult"
    :time-limit="90"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="pathclear-game">
      <!-- SVG backgrounds (underneath Phaser canvas) -->
      <SceneSky variant="nice" />
      <SceneStreet variant="dirty" />

      <!-- Phaser canvas -->
      <PhaserCanvas
        v-if="gameStarted"
        ref="phaserRef"
        :scene-class="PathClearScene"
        :bridge="bridge"
      />

      <!-- Feedback toast (Vue overlay, above Phaser) -->
      <Transition name="fade">
        <div
          v-if="feedback"
          class="pathclear-feedback"
          :class="feedback.ok ? 'fb--ok' : 'fb--no'"
        >
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Progress bar -->
      <div class="pathclear-progress">
        <span class="pathclear-progress__text">
          Senderos despejados: {{ cleared }}/6
        </span>
      </div>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { PathClearScene } from '~/phaser/scenes/chapter-2/PathClearScene'
import PhaserCanvas from '~/components/phaser/PhaserCanvas.vue'
import type { MinigameBridge } from '~/phaser/types'

defineEmits<{ complete: [] }>()

const cleared = ref(0)
const isComplete = computed(() => cleared.value >= 6)
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
    cleared.value++
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
  cleared.value = 0
  showResult.value = false
  gameStarted.value = true
}

function onTimeout() {
  showResult.value = true
}

function resetGame() {
  cleared.value = 0
  showResult.value = false
  gameStarted.value = false
  // Re-mount Phaser canvas
  nextTick(() => {
    gameStarted.value = true
  })
}
</script>

<style scoped>
.pathclear-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  touch-action: none;
}

/* Feedback toast */
.pathclear-feedback {
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



/* Progress bar */
.pathclear-progress {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 3px solid rgba(0, 0, 0, 0.08);
  text-align: center;
  z-index: 10;
  position: relative;
}

.pathclear-progress__text {
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
