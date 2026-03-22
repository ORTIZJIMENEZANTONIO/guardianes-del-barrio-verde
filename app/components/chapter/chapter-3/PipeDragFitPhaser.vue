<template>
  <MinigameShell
    title="Reparar y redirigir"
    description="Arrastra las piezas de tubería al lugar correcto."
    :completed="completed"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    :time-limit="90"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="phaser-wrapper">
      <SceneSky variant="nice" />
      <SceneStreet variant="normal" />
      <PhaserCanvas v-if="gameStarted" :scene-class="PipeDragFitScene" :bridge="bridge" />
      <Transition name="fade">
        <div v-if="feedback" class="game-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { PipeDragFitScene } from '~/phaser/scenes/chapter-3/PipeDragFitScene'
import PhaserCanvas from '~/components/phaser/PhaserCanvas.vue'
import type { MinigameBridge } from '~/phaser/types'

defineEmits<{ complete: [] }>()

const completed = ref(0)
const isComplete = computed(() => completed.value >= 4)
const showResult = ref(false)
const gameStarted = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

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
  nextTick(() => { gameStarted.value = true })
}
</script>

<style scoped>
.phaser-wrapper {
  width: 100%; height: 100%; display: flex; flex-direction: column;
  position: relative; touch-action: none;
}
.game-feedback {
  position: absolute; top: 45%; left: 40%; transform: translate(-50%, -50%);
  padding: 12px 24px; border-radius: var(--radius-md); font-weight: 800;
  font-size: 14px; z-index: 50; animation: scaleIn 0.3s ease;
  text-align: center; max-width: 280px; box-shadow: var(--shadow-lg);
}
.fb--ok { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; }
.fb--no { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
