<template>
  <MinigameShell
    title="Proteger el humedal"
    description="Encuentra las parejas para aprender sobre el humedal y como cuidarlo."
    :completed="matchedCount"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="memory-game">
      <SceneSky variant="nice" />
      <SceneStreet variant="normal" />

      <div class="card-grid">
        <div
          v-for="card in cards"
          :key="card.id"
          class="memory-card"
          :class="{
            'memory-card--flipped': card.flipped || card.matched,
            'memory-card--matched': card.matched,
          }"
          :data-card="card.id"
          @click="flipCard(card)"
        >
          <div class="card-inner">
            <div class="card-back">
              <span class="card-back-emoji">&#x1F4A7;</span>
            </div>
            <div class="card-front">
              <span class="card-front-emoji">{{ card.emoji }}</span>
              <span class="card-front-label">{{ card.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="memory-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

const emit = defineEmits<{
  complete: []
}>()

const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface MemoryCard {
  id: string
  pairId: number
  emoji: string
  label: string
  flipped: boolean
  matched: boolean
}

const pairData: { pairId: number; emoji: string; label: string }[] = [
  { pairId: 1, emoji: '\u{1F33E}', label: 'Juncos' },
  { pairId: 1, emoji: '\u{1F9F9}', label: 'Filtran el agua' },
  { pairId: 2, emoji: '\u{1F438}', label: 'Rana' },
  { pairId: 2, emoji: '\u{1F321}\u{FE0F}', label: 'Indica agua sana' },
  { pairId: 3, emoji: '\u{1F4A7}', label: 'Humedal' },
  { pairId: 3, emoji: '\u{1F9FD}', label: 'Retiene agua como esponja' },
  { pairId: 4, emoji: '\u{1F986}', label: 'Aves acuaticas' },
  { pairId: 4, emoji: '\u{1F3E0}', label: 'Necesitan habitat limpio' },
]

const cards = ref<MemoryCard[]>([])
const matchedCount = ref(0)
const isComplete = computed(() => matchedCount.value >= 4)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

const flippedCards = ref<MemoryCard[]>([])
let lockBoard = false

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function onStart() {
  const shuffled = shuffle(pairData)
  cards.value = shuffled.map((item, index) => ({
    id: `card-${index}`,
    pairId: item.pairId,
    emoji: item.emoji,
    label: item.label,
    flipped: false,
    matched: false,
  }))
  matchedCount.value = 0
  flippedCards.value = []
  lockBoard = false
}

function flipCard(card: MemoryCard) {
  if (lockBoard) return
  if (card.flipped || card.matched) return
  if (flippedCards.value.length >= 2) return

  card.flipped = true
  flippedCards.value.push(card)

  if (flippedCards.value.length === 2) {
    checkMatch()
  }
}

function checkMatch() {
  lockBoard = true
  const [first, second] = flippedCards.value

  if (first.pairId === second.pairId) {
    // Match found
    first.matched = true
    second.matched = true
    matchedCount.value++
    showFB('Pareja encontrada!', true)

    nextTick(() => {
      const firstEl = document.querySelector(`[data-card="${first.id}"]`)
      const secondEl = document.querySelector(`[data-card="${second.id}"]`)
      if (firstEl) celebrateSuccess(firstEl)
      if (secondEl) celebrateSuccess(secondEl)
    })

    flippedCards.value = []
    lockBoard = false

    if (isComplete.value) {
      const gameEl = document.querySelector('.memory-game')
      if (gameEl) confettiBurst(gameEl, 20)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    // No match
    showFB('No es pareja, intenta otra vez', false)

    nextTick(() => {
      const firstEl = document.querySelector(`[data-card="${first.id}"]`)
      const secondEl = document.querySelector(`[data-card="${second.id}"]`)
      if (firstEl) shakeWrong(firstEl)
      if (secondEl) shakeWrong(secondEl)
    })

    setTimeout(() => {
      first.flipped = false
      second.flipped = false
      flippedCards.value = []
      lockBoard = false
    }, 1000)
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 2000)
}

function resetGame() {
  const shuffled = shuffle(pairData)
  cards.value = shuffled.map((item, index) => ({
    id: `card-${index}`,
    pairId: item.pairId,
    emoji: item.emoji,
    label: item.label,
    flipped: false,
    matched: false,
  }))
  matchedCount.value = 0
  flippedCards.value = []
  lockBoard = false
  showResult.value = false
}
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
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  padding: 16px;
  max-width: 380px;
  width: 100%;
  position: relative;
  z-index: 5;
  perspective: 800px;
}

.memory-card {
  width: 100%;
  min-width: 70px;
  min-height: 70px;
  aspect-ratio: 1;
  cursor: pointer;
  perspective: 600px;
}

.memory-card:active {
  transform: scale(0.95);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
  transform-style: preserve-3d;
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
  gap: 4px;
  border-radius: var(--radius-md);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.card-back-emoji {
  font-size: 28px;
  filter: brightness(1.2);
}

.card-front {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: rotateY(180deg);
  padding: 4px;
}

.card-front-emoji {
  font-size: 26px;
}

.card-front-label {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
}

.memory-card--matched .card-front {
  border-color: #3b82f6;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.4), 0 0 24px rgba(59, 130, 246, 0.15);
  background: rgba(239, 246, 255, 0.95);
}

.memory-card--matched {
  cursor: default;
}

.memory-card--matched:active {
  transform: none;
}

.memory-feedback {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 13px;
  max-width: 280px;
  text-align: center;
  animation: slideUp 0.3s ease;
  z-index: 5;
}

.fb--ok {
  background: rgba(82, 183, 136, 0.95);
  color: white;
}

.fb--no {
  background: rgba(249, 65, 68, 0.95);
  color: white;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
