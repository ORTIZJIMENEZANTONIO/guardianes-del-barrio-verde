<template>
  <div class="memory-game">
    <SceneSky variant="nice" />
    <SceneStreet :variant="streetVariant" />

    <div v-if="hint" class="game-hint">
      {{ hint }} · Parejas: {{ matchedCount }}/{{ pairCount }}
    </div>

    <div class="card-grid" :class="gridClass">
      <div
        v-for="card in cards"
        :key="card.id"
        class="memory-card game-card"
        :class="{
          'memory-card--flipped': card.flipped || card.matched,
          'memory-card--matched game-card--matched': card.matched,
        }"
        :data-card="card.id"
        @click="flipCard(card)"
      >
        <div class="card-inner">
          <div class="card-back" :style="{ background: backGradient }">
            <GameIcon :emoji="backEmoji" :size="28" class="card-back-emoji" />
          </div>
          <div class="card-front" :class="{ 'card-front--matched': card.matched }" :style="matchedStyle(card)">
            <GameIcon :emoji="card.emoji" :size="26" class="card-front-emoji" />
            <span class="card-front-label">{{ card.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Streak badge -->
    <div class="memory-streak">
      <StreakBadge :streak="streakState.streak.value" :label="streakState.streakLabel.value" />
    </div>

    <!-- Celebration flash -->
    <Transition name="fade">
      <div v-if="celebrations.showFlash.value" class="celebration-flash" />
    </Transition>

    <Transition name="fade">
      <div v-if="feedback" class="game-feedback" :class="feedback.ok ? 'game-feedback--ok' : 'game-feedback--no'">
        {{ feedback.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'
import { useStreakSystem } from '~/composables/useStreakSystem'
import { useSceneProgress } from '~/composables/useSceneProgress'
import { useMiniCelebrations } from '~/composables/useMiniCelebrations'

export interface MemoryPair {
  pairId: number
  emoji: string
  label: string
}

const props = withDefaults(defineProps<{
  pairs: MemoryPair[]
  backEmoji?: string
  backGradient?: string
  accentColor?: string
  errorMessage?: string
  successMessage?: string
  hint?: string
  streetVariant?: string
}>(), {
  backEmoji: '🌱',
  backGradient: 'linear-gradient(135deg, #52b788, #2d6a4f)',
  accentColor: '#52b788',
  errorMessage: 'Esas cartas no son pareja.',
  successMessage: '¡Pareja encontrada!',
  hint: '',
  streetVariant: 'normal',
})

const emit = defineEmits<{
  complete: []
  update: [matched: number, total: number]
}>()

const { shakeWrong, celebrateSuccess, confettiBurst, sparkles } = useGameAnimations()

// Streak + celebrations
const celebrations = useMiniCelebrations(() => document.querySelector('.memory-game') as HTMLElement)
const streakState = useStreakSystem((milestone) => {
  celebrations.onStreakMilestone(milestone.streak)
})
const sceneState = useSceneProgress((pct) => {
  celebrations.onProgressMilestone(pct)
})

interface MemoryCard {
  id: string
  pairId: number
  emoji: string
  label: string
  flipped: boolean
  matched: boolean
}

const pairCount = computed(() => {
  const ids = new Set(props.pairs.map(p => p.pairId))
  return ids.size
})

const gridClass = computed(() => pairCount.value >= 5 ? 'card-grid--5' : '')

const cards = ref<MemoryCard[]>([])
const matchedCount = ref(0)
const isComplete = computed(() => matchedCount.value >= pairCount.value)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null
let flippedCards: MemoryCard[] = []
let lockBoard = false

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(): MemoryCard[] {
  return shuffle(props.pairs).map((item, i) => ({
    id: `card-${i}`,
    pairId: item.pairId,
    emoji: item.emoji,
    label: item.label,
    flipped: false,
    matched: false,
  }))
}

function start() {
  cards.value = buildDeck()
  matchedCount.value = 0
  flippedCards = []
  lockBoard = false
  feedback.value = null
  streakState.reset()
  sceneState.reset(pairCount.value)
  emit('update', 0, pairCount.value)
}

function reset() {
  start()
}

function flipCard(card: MemoryCard) {
  if (lockBoard || card.flipped || card.matched) return
  if (flippedCards.length >= 2) return

  card.flipped = true
  flippedCards.push(card)

  if (flippedCards.length === 2) {
    lockBoard = true
    checkMatch()
  }
}

function checkMatch() {
  const [first, second] = flippedCards
  if (!first || !second) return

  if (first.pairId === second.pairId) {
    first.matched = true
    second.matched = true
    matchedCount.value++
    streakState.hit()
    sceneState.increment()

    // Mini confetti on each matched pair (no text message)
    nextTick(() => {
      const el1 = document.querySelector(`[data-card="${first.id}"]`)
      const el2 = document.querySelector(`[data-card="${second.id}"]`)
      if (el1) { celebrateSuccess(el1); sparkles(el1, 6) }
      if (el2) { celebrateSuccess(el2); sparkles(el2, 6) }
    })

    setTimeout(() => {
      flippedCards = []
      lockBoard = false
    }, 400)

    emit('update', matchedCount.value, pairCount.value)

    if (isComplete.value) {
      const gameEl = document.querySelector('.memory-game')
      if (gameEl) confettiBurst(gameEl, 30)
      setTimeout(() => { emit('complete') }, 1000)
    }
  } else {
    streakState.miss()
    showFB(props.errorMessage, false)

    nextTick(() => {
      const el1 = document.querySelector(`[data-card="${first.id}"]`)
      const el2 = document.querySelector(`[data-card="${second.id}"]`)
      if (el1) shakeWrong(el1)
      if (el2) shakeWrong(el2)
    })

    setTimeout(() => {
      first.flipped = false
      second.flipped = false
      flippedCards = []
      lockBoard = false
    }, 1000)
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function matchedStyle(card: MemoryCard) {
  if (!card.matched) return {}
  return {
    borderColor: props.accentColor,
    boxShadow: `0 0 12px ${props.accentColor}66, 0 0 24px ${props.accentColor}33`,
  }
}

defineExpose({ start, reset, matchedCount, isComplete })
</script>

<style scoped>
.memory-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  position: relative;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, min(38vw, 155px));
  justify-content: center;
  gap: 30px;
  z-index: 5;
  position: relative;
  perspective: 800px;
  padding: 4px;
}

/* 5-pair grid (10 cards) */
.card-grid--5 {
  grid-template-columns: repeat(2, min(38vw, 130px));
}

@media (min-width: 560px) {
  .card-grid {
    grid-template-columns: repeat(4, min(20vw, 130px));
    gap: 10px;
  }
  .card-grid--5 {
    grid-template-columns: repeat(5, min(16vw, 110px));
  }
}

.memory-card {
  aspect-ratio: 1.25;
  cursor: pointer;
  perspective: 600px;
  -webkit-tap-highlight-color: transparent;
}

.memory-card:active .card-inner {
  transform: scale(0.95);
}

.memory-card--matched {
  cursor: default;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
  transform-style: preserve-3d;
  border-radius: var(--radius-md);
}

.memory-card--flipped .card-inner {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.card-back-emoji {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.card-front {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: rotateY(180deg);
  gap: 4px;
  padding: 4px;
}

.card-front-emoji {
  /* size controlled by GameIcon :size prop */
}

.card-front-label {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
  max-width: 90%;
}

@media (max-width: 380px) {
  .card-front-label { font-size: 8px; }
}

.memory-streak {
  position: absolute;
  top: 8px;
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
