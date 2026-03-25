<template>
  <div class="quiz-game">
    <SceneSky :variant="skyVariant" />
    <SceneStreet :variant="streetVariant" />

    <div class="game-hint">
      Pregunta {{ currentIndex + 1 }}/{{ questions.length }} · Correctas: {{ correctCount }}
    </div>

    <!-- Timer bar -->
    <div class="quiz-timer-bar">
      <div class="quiz-timer-fill" :class="{ 'quiz-timer--warning': timeLeft <= 3 }" :style="{ width: timerPercent + '%' }" />
    </div>

    <!-- Question card -->
    <div class="quiz-area">
      <div v-if="currentQuestion" class="quiz-card" :class="{ 'quiz-card--answered': answered }">
        <div class="quiz-scenario">
          <GameIcon :emoji="currentQuestion.emoji" :size="36" class="quiz-scenario__emoji" />
          <p class="quiz-scenario__text">{{ currentQuestion.scenario }}</p>
        </div>

        <div class="quiz-options">
          <button
            v-for="opt in currentQuestion.options"
            :key="opt.id"
            class="quiz-option"
            :class="{
              'quiz-option--correct': answered && opt.correct,
              'quiz-option--wrong': answeredId === opt.id && !opt.correct,
              'quiz-option--disabled': answered,
            }"
            :disabled="answered"
            @click="selectAnswer(opt)"
          >
            <GameIcon :emoji="opt.emoji" :size="22" class="quiz-option__emoji" />
            <span class="quiz-option__label">{{ opt.label }}</span>
          </button>
        </div>
      </div>

      <!-- Done state -->
      <div v-else-if="allDone" class="quiz-done">
        <span class="quiz-done__emoji">🎉</span>
        <span class="quiz-done__text">{{ correctCount }}/{{ questions.length }} correctas</span>
      </div>
    </div>

    <!-- Streak badge -->
    <div class="quiz-streak">
      <StreakBadge :streak="streakState.streak.value" :label="streakState.streakLabel.value" />
    </div>

    <!-- Celebration flash -->
    <Transition name="fade">
      <div v-if="celebrations.showFlash.value" class="celebration-flash" />
    </Transition>

    <!-- Feedback -->
    <Transition name="fade">
      <div v-if="feedback" class="game-feedback" :class="feedback.ok ? 'game-feedback--ok' : 'game-feedback--no'">
        {{ feedback.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'
import { useGameFeedback } from '~/composables/useGameFeedback'
import { useStreakSystem } from '~/composables/useStreakSystem'
import { useMiniCelebrations } from '~/composables/useMiniCelebrations'

export interface QuizOption {
  id: string
  emoji: string
  label: string
  correct: boolean
  message?: string
}

export interface QuizQuestion {
  id: string
  emoji: string
  scenario: string
  options: QuizOption[]
}

const props = withDefaults(defineProps<{
  questions: QuizQuestion[]
  timePerQuestion?: number
  skyVariant?: string
  streetVariant?: string
}>(), {
  timePerQuestion: 10,
  skyVariant: 'nice',
  streetVariant: 'normal',
})

const emit = defineEmits<{
  complete: []
  update: [correct: number, total: number]
}>()

const { celebrateSuccess, shakeWrong, confettiBurst } = useGameAnimations()
const { feedback, showOk, showNo, clear: clearFeedback } = useGameFeedback()

// Streak + celebrations
const celebrations = useMiniCelebrations(() => document.querySelector('.quiz-game') as HTMLElement)
const streakState = useStreakSystem((milestone) => {
  celebrations.onStreakMilestone(milestone.streak)
})

const queue = ref<QuizQuestion[]>([])
const currentIndex = ref(0)
const correctCount = ref(0)
const answered = ref(false)
const answeredId = ref<string | null>(null)
const timeLeft = ref(props.timePerQuestion)
const allDone = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() => queue.value[currentIndex.value] ?? null)
const timerPercent = computed(() => (timeLeft.value / props.timePerQuestion) * 100)

function start() {
  queue.value = [...props.questions]
  currentIndex.value = 0
  correctCount.value = 0
  answered.value = false
  answeredId.value = null
  allDone.value = false
  streakState.reset()
  clearFeedback()
  startTimer()
  emit('update', 0, props.questions.length)
}

function startTimer() {
  stopTimer()
  timeLeft.value = props.timePerQuestion
  timerInterval = setInterval(() => {
    timeLeft.value -= 0.1
    if (timeLeft.value <= 0) {
      timeLeft.value = 0
      onTimeout()
    }
  }, 100)
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
}

function onTimeout() {
  stopTimer()
  if (answered.value) return
  answered.value = true
  showNo('¡Se acabó el tiempo!')
  setTimeout(advance, 1500)
}

function selectAnswer(opt: QuizOption) {
  if (answered.value) return
  stopTimer()
  answered.value = true
  answeredId.value = opt.id

  if (opt.correct) {
    correctCount.value++
    streakState.hit()
    showOk(opt.message || '¡Correcto!')
    nextTick(() => {
      const el = document.querySelector('.quiz-option--correct')
      if (el) celebrateSuccess(el)
    })
  } else {
    streakState.miss()
    showNo(opt.message || '¡Casi! Esa no era, pero sigue intentando.')
    nextTick(() => {
      const el = document.querySelector('.quiz-option--wrong')
      if (el) shakeWrong(el)
    })
  }

  emit('update', correctCount.value, props.questions.length)
  setTimeout(advance, 1800)
}

function advance() {
  if (currentIndex.value >= queue.value.length - 1) {
    allDone.value = true
    stopTimer()
    const gameEl = document.querySelector('.quiz-game')
    if (gameEl) confettiBurst(gameEl, 16)
    setTimeout(() => emit('complete'), 800)
    return
  }

  currentIndex.value++
  answered.value = false
  answeredId.value = null
  clearFeedback()
  startTimer()
}

function reset() { start() }

onUnmounted(stopTimer)

defineExpose({ start, reset, correctCount, allDone })
</script>

<style scoped>
.quiz-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Timer */
.quiz-timer-bar {
  height: 6px;
  background: rgba(0,0,0,0.1);
  z-index: 10;
  position: relative;
}

.quiz-timer-fill {
  height: 100%;
  background: var(--color-green-mid);
  transition: width 100ms linear;
  border-radius: 0 3px 3px 0;
}

.quiz-timer--warning {
  background: var(--color-coral);
  animation: pulse 0.5s ease-in-out infinite;
}

/* Quiz area */
.quiz-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  position: relative;
  padding: 12px;
}

.quiz-card {
  width: min(90vw, 380px);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 20px 16px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quiz-scenario {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.quiz-scenario__emoji { font-size: 36px; }
.quiz-scenario__text {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.4;
  margin: 0;
}

/* Options */
.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: white;
  border: 2px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 200ms ease;
  text-align: left;
}

.quiz-option:active:not(:disabled) { transform: scale(0.97); }
.quiz-option--disabled { pointer-events: none; }

.quiz-option--correct {
  border-color: var(--color-green-mid);
  background: rgba(34, 197, 94, 0.12);
}

.quiz-option--wrong {
  border-color: var(--color-coral);
  background: rgba(239, 68, 68, 0.1);
}

.quiz-option__emoji { font-size: 22px; flex-shrink: 0; }
.quiz-option__label { font-size: 13px; font-weight: 700; color: var(--color-text); }

/* Done */
.quiz-done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.quiz-done__emoji { font-size: 48px; }
.quiz-done__text { font-size: 18px; font-weight: 900; color: var(--color-green-dark); }

.quiz-streak {
  position: absolute;
  top: 40px;
  right: 8px;
  z-index: 20;
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
