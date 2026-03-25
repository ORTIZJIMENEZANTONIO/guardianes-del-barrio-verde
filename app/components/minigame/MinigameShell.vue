<template>
  <div class="minigame-shell">
    <!-- Header -->
    <div class="minigame-header">
      <div class="minigame-title">{{ title }}</div>
      <div class="minigame-stats">
        <div v-if="timeLimit" ref="timerRef" class="minigame-timer" :class="{ 'timer--warning': timeRemaining <= 10 }">
          ⏱ {{ timerDisplay }}
        </div>
        <div class="minigame-score">
          ✅ {{ completed }}/{{ total }}
        </div>
      </div>
    </div>

    <!-- Instructions overlay -->
    <Transition name="fade">
      <div v-if="showInstructions" class="minigame-instructions" @click="startGame">
        <div class="instructions-card animate-scale-in">
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
          <GameButton variant="primary" size="lg" @click="startGame">
            ¡Empezar!
          </GameButton>
        </div>
      </div>
    </Transition>

    <!-- Game area -->
    <div class="minigame-area">
      <slot />
      <!-- Mascot reacting to gameplay -->
      <GameMascot
        v-if="mascotCharacterId && !showInstructions && !showResult"
        :character-id="mascotCharacterId"
        :progress="total > 0 ? completed / total : 0"
        :last-result="lastResult"
        :streak="streak"
      />
    </div>

    <!-- Result overlay -->
    <Transition name="fade">
      <div v-if="showResult" class="minigame-result">
        <div class="result-card animate-scale-in" :class="isSuccess ? 'result--success' : 'result--failure'">
          <div class="result-emoji">{{ isSuccess ? '🎉' : '💪' }}</div>
          <h3>{{ isSuccess ? '¡Muy bien!' : '¡Casi!' }}</h3>
          <p>{{ isSuccess ? 'Completaste la misión' : 'Inténtalo de nuevo' }}</p>
          <GameButton
            :variant="isSuccess ? 'primary' : 'secondary'"
            size="lg"
            @click="onResultClick"
          >
            {{ isSuccess ? 'Continuar' : 'Reintentar' }}
          </GameButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'
import { usePlayerStore } from '~/stores/usePlayerStore'

const { popIn, slideUpBounce, heartbeat, killAll } = useGameAnimations()
const playerStore = usePlayerStore()

const timerRef = ref<HTMLElement | null>(null)
let heartbeatAnim: ReturnType<typeof heartbeat> | null = null

const props = withDefaults(defineProps<{
  title: string
  description: string
  completed: number
  total: number
  timeLimit?: number
  isSuccess: boolean
  showResult: boolean
  mascotCharacterId?: string
  lastResult?: 'ok' | 'error' | null
  streak?: number
}>(), {
  mascotCharacterId: '',
  lastResult: null,
  streak: 0,
})

const emit = defineEmits<{
  start: []
  complete: []
  retry: []
  timeout: []
}>()

const showInstructions = ref(true)
const timeRemaining = ref(props.timeLimit ?? 0)

const timerDisplay = computed(() => {
  const m = Math.floor(timeRemaining.value / 60)
  const s = timeRemaining.value % 60
  return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`
})
let timer: ReturnType<typeof setInterval> | null = null

function onResultClick() {
  if (props.isSuccess) {
    emit('complete')
  } else {
    emit('retry')
  }
}

function startGame() {
  showInstructions.value = false
  emit('start')
  startTimer()
}

function startTimer() {
  // Always stop any existing timer first
  stopTimer()
  if (props.timeLimit) {
    heartbeatAnim = null
    // Adjust time by player age: younger = more time, older = less
    const adjusted = Math.round(props.timeLimit * playerStore.timerMultiplier)
    timeRemaining.value = adjusted
    timer = setInterval(() => {
      timeRemaining.value--
      if (timeRemaining.value <= 10 && !heartbeatAnim && timerRef.value) {
        heartbeatAnim = heartbeat(timerRef.value)
      }
      if (timeRemaining.value <= 0) {
        if (timer) clearInterval(timer)
        if (timerRef.value) { killAll(timerRef.value); heartbeatAnim = null }
        emit('timeout')
      }
    }, 1000)
  }
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (timerRef.value) { killAll(timerRef.value); heartbeatAnim = null }
}

function restartTimer() {
  stopTimer()
  startTimer()
}

// Stop timer when objective is complete
watch(() => props.completed, (val) => {
  if (val >= props.total) {
    stopTimer()
  }
})

watch(() => props.showResult, (v, oldV) => {
  if (v) {
    stopTimer()
  } else if (oldV && !v && props.timeLimit) {
    // Retry: showResult went from true to false, restart timer
    restartTimer()
  }
})

onUnmounted(stopTimer)

defineExpose({ stopTimer })
</script>

<style scoped>
.minigame-shell {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.minigame-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 8;
  border-bottom: 1px solid rgba(255,255,255,0.4);
  position: relative;
}

.minigame-title {
  font-weight: 800;
  font-size: 15px;
  color: var(--color-green-dark);
}

.minigame-stats {
  display: flex;
  gap: 10px;
}

.minigame-timer {
  font-weight: 800;
  color: var(--color-text);
  font-size: 14px;
  background: rgba(59,130,246,0.1);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.timer--warning {
  color: white;
  background: var(--color-coral);
  animation: pulse 0.5s infinite;
}

.minigame-score {
  font-weight: 800;
  color: var(--color-text);
  font-size: 14px;
  background: rgba(69,201,122,0.1);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.minigame-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.minigame-instructions, .minigame-result {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 100;
  padding: 20px;
}

.instructions-card, .result-card {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: var(--radius-xl);
  padding: 36px;
  text-align: center;
  max-width: 360px;
  box-shadow: var(--shadow-xl);
}

.instructions-card h3, .result-card h3 {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-green-dark);
  margin-bottom: 10px;
}

.instructions-card p, .result-card p {
  color: var(--color-text);
  margin-bottom: 24px;
  line-height: 1.5;
  font-weight: 500;
}

.result-emoji {
  font-size: 56px;
  margin-bottom: 8px;
  animation: popIn 500ms var(--ease-spring) forwards;
}

.result--success {
  border: 2px solid var(--color-green-light);
  box-shadow: var(--shadow-xl), var(--glow-green);
}
.result--failure {
  border: 2px solid var(--color-orange);
  box-shadow: var(--shadow-xl), var(--glow-yellow);
}

.fade-enter-active { transition: opacity 300ms var(--ease-out); }
.fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
