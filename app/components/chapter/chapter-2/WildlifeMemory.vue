<template>
  <MinigameShell
    title="Vida en el parque"
    description="Encuentra las parejas: cada animal necesita algo para volver al parque."
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
        <button
          v-for="card in cards"
          :key="card.id"
          class="memory-card game-card"
          :class="{
            'memory-card--flipped': card.flipped,
            'memory-card--matched game-card--matched': card.matched,
          }"
          :data-card="card.id"
          :disabled="card.matched"
          @click="flipCard(card)"
        >
          <div class="card-inner">
            <div class="card-back">
              <span class="card-back-emoji">&#x1F33F;</span>
            </div>
            <div class="card-front">
              <span class="card-front-emoji">{{ card.emoji }}</span>
              <span class="card-front-label">{{ card.label }}</span>
            </div>
          </div>
        </button>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="memory-feedback game-feedback" :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'">
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

const pairsData: Array<{ pairId: number; cards: [Pick<MemoryCard, 'emoji' | 'label'>, Pick<MemoryCard, 'emoji' | 'label'>] }> = [
  {
    pairId: 1,
    cards: [
      { emoji: '\uD83E\uDD8B', label: 'Mariposa' },
      { emoji: '\uD83C\uDF38', label: 'Flores con n\u00e9ctar' },
    ],
  },
  {
    pairId: 2,
    cards: [
      { emoji: '\uD83D\uDC26', label: 'P\u00e1jaro' },
      { emoji: '\uD83C\uDF33', label: '\u00c1rbol con sombra' },
    ],
  },
  {
    pairId: 3,
    cards: [
      { emoji: '\uD83D\uDC1D', label: 'Abeja' },
      { emoji: '\uD83C\uDF3B', label: 'Plantas arom\u00e1ticas' },
    ],
  },
  {
    pairId: 4,
    cards: [
      { emoji: '\uD83D\uDC15', label: 'Bolillo (perro)' },
      { emoji: '\uD83D\uDCA7', label: 'Agua y sombra' },
    ],
  },
]

const cards = ref<MemoryCard[]>([])
const matchedCount = ref(0)
const isComplete = computed(() => matchedCount.value >= 4)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

let flippedCards: MemoryCard[] = []
let isChecking = false

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(): MemoryCard[] {
  const deck: MemoryCard[] = []
  let idCounter = 0
  for (const pair of pairsData) {
    for (const card of pair.cards) {
      deck.push({
        id: `c${idCounter++}`,
        pairId: pair.pairId,
        emoji: card.emoji,
        label: card.label,
        flipped: false,
        matched: false,
      })
    }
  }
  return shuffle(deck)
}

function onStart() {
  cards.value = buildDeck()
  matchedCount.value = 0
  showResult.value = false
  flippedCards = []
  isChecking = false
}

function flipCard(card: MemoryCard) {
  if (isChecking) return
  if (card.flipped || card.matched) return
  if (flippedCards.length >= 2) return

  card.flipped = true
  flippedCards.push(card)

  if (flippedCards.length === 2) {
    isChecking = true
    const [first, second] = flippedCards

    if (first.pairId === second.pairId) {
      // Match found
      setTimeout(() => {
        first.matched = true
        second.matched = true
        matchedCount.value++

        showFB('\u00a1Pareja encontrada!', true)

        nextTick(() => {
          const firstEl = document.querySelector(`[data-card="${first.id}"]`)
          const secondEl = document.querySelector(`[data-card="${second.id}"]`)
          if (firstEl) celebrateSuccess(firstEl)
          if (secondEl) celebrateSuccess(secondEl)
        })

        if (isComplete.value) {
          const gameEl = document.querySelector('.memory-game')
          if (gameEl) confettiBurst(gameEl, 20)
          setTimeout(() => { showResult.value = true }, 1000)
        }

        flippedCards = []
        isChecking = false
      }, 400)
    } else {
      // No match
      showFB('Esas cartas no hacen pareja. 💡 Cada animal necesita algo especial para vivir en el parque.', false)

      nextTick(() => {
        const firstEl = document.querySelector(`[data-card="${first.id}"]`)
        const secondEl = document.querySelector(`[data-card="${second.id}"]`)
        if (firstEl) shakeWrong(firstEl)
        if (secondEl) shakeWrong(secondEl)
      })

      setTimeout(() => {
        first.flipped = false
        second.flipped = false
        flippedCards = []
        isChecking = false
      }, 1000)
    }
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  cards.value = buildDeck()
  matchedCount.value = 0
  showResult.value = false
  flippedCards = []
  isChecking = false
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
  position: relative;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px 12px;
  max-width: 500px;
  width: 100%;
  position: relative;
  z-index: 5;
}

.memory-card {
  width: 100%;
  aspect-ratio: 1;
  perspective: 600px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.memory-card:active .card-inner {
  transform: scale(0.95);
}

.memory-card:disabled {
  cursor: default;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
  border-radius: var(--radius-md, 12px);
}

.memory-card--flipped .card-inner,
.memory-card--matched .card-inner {
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
  backface-visibility: hidden;
  border-radius: var(--radius-md, 12px);
  border: 2px solid rgba(0, 0, 0, 0.15);
}

.card-back {
  background: linear-gradient(135deg, #2d9d5e 0%, #52b788 50%, #40c977 100%);
  box-shadow: 0 2px 8px rgba(45, 157, 94, 0.3);
}

.card-back-emoji {
  font-size: 32px;
  filter: brightness(1.1);
}

.card-front {
  background: white;
  transform: rotateY(180deg);
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-front-emoji {
  font-size: 28px;
  line-height: 1;
}

.card-front-label {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-text, #111827);
  text-align: center;
  line-height: 1.1;
  max-width: 70px;
}

/* Matched state: green glow */
.memory-card--matched .card-front {
  border-color: var(--color-green-mid, #52b788);
  box-shadow:
    0 0 8px rgba(82, 183, 136, 0.4),
    0 0 16px rgba(82, 183, 136, 0.2);
}

.memory-card--matched .card-inner {
  transform: rotateY(180deg);
}

/* Feedback */
/* feedback handled by .game-feedback */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 380px) {
  .card-grid { gap: 6px; padding: 6px 8px; }

  .card-front-emoji {
    font-size: 24px;
  }

  .card-front-label {
    font-size: 8px;
  }
}
</style>
