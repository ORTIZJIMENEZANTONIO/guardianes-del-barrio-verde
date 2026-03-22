<template>
  <MinigameShell
    title="Centro de reciclaje"
    description="Encuentra las parejas: cada material tiene un producto reciclado."
    :completed="matchedCount"
    :total="5"
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
          class="memory-card game-card"
          :class="{
            'memory-card--flipped': card.flipped || card.matched,
            'memory-card--matched game-card--matched': card.matched,
          }"
          :data-card="card.id"
          @click="flipCard(card)"
        >
          <div class="card-inner">
            <div class="card-back">
              <span class="card-back__emoji">♻️</span>
            </div>
            <div class="card-front">
              <span class="card-front__emoji">{{ card.emoji }}</span>
              <span class="card-front__label">{{ card.label }}</span>
            </div>
          </div>
        </div>
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
  pairId: string
  emoji: string
  label: string
  flipped: boolean
  matched: boolean
}

const pairs = [
  { pairId: 'p1', a: { emoji: '🧴', label: 'Botella PET' }, b: { emoji: '👕', label: 'Playera reciclada' } },
  { pairId: 'p2', a: { emoji: '📦', label: 'Cartón' }, b: { emoji: '🗃️', label: 'Caja nueva' } },
  { pairId: 'p3', a: { emoji: '🥫', label: 'Lata aluminio' }, b: { emoji: '🚲', label: 'Bicicleta' } },
  { pairId: 'p4', a: { emoji: '🫙', label: 'Vidrio' }, b: { emoji: '🏺', label: 'Frasco nuevo' } },
  { pairId: 'p5', a: { emoji: '🍌', label: 'Orgánicos' }, b: { emoji: '🌱', label: 'Composta' } },
]

const cards = ref<MemoryCard[]>([])
const matchedCount = ref(0)
const isComplete = computed(() => matchedCount.value >= 5)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null
let flippedCards: MemoryCard[] = []
let lockBoard = false

function buildDeck(): MemoryCard[] {
  const deck: MemoryCard[] = []
  for (const pair of pairs) {
    deck.push({ id: `${pair.pairId}-a`, pairId: pair.pairId, emoji: pair.a.emoji, label: pair.a.label, flipped: false, matched: false })
    deck.push({ id: `${pair.pairId}-b`, pairId: pair.pairId, emoji: pair.b.emoji, label: pair.b.label, flipped: false, matched: false })
  }
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function onStart() {
  cards.value = buildDeck()
  matchedCount.value = 0
  flippedCards = []
  lockBoard = false
}

function flipCard(card: MemoryCard) {
  if (lockBoard) return
  if (card.flipped || card.matched) return
  if (flippedCards.length >= 2) return

  card.flipped = true
  flippedCards.push(card)

  if (flippedCards.length === 2) {
    checkMatch()
  }
}

function checkMatch() {
  const [first, second] = flippedCards
  lockBoard = true

  if (first.pairId === second.pairId) {
    // Match found
    first.matched = true
    second.matched = true
    matchedCount.value++
    showFB('¡Pareja encontrada!', true)

    // Celebrate each matched card
    nextTick(() => {
      const el1 = document.querySelector(`[data-card="${first.id}"]`)
      const el2 = document.querySelector(`[data-card="${second.id}"]`)
      if (el1) celebrateSuccess(el1)
      if (el2) celebrateSuccess(el2)
    })

    flippedCards = []
    lockBoard = false

    if (isComplete.value) {
      const gameEl = document.querySelector('.memory-game')
      if (gameEl) confettiBurst(gameEl, 20)
      setTimeout(() => { showResult.value = true }, 800)
    }
  } else {
    // No match
    showFB('Esas cartas no son pareja. 💡 Cada material se convierte en algo diferente al reciclarlo.', false)

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

function resetGame() {
  cards.value = buildDeck()
  matchedCount.value = 0
  flippedCards = []
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
  grid-template-columns: repeat(5, 72px);
  grid-template-rows: repeat(2, 80px);
  gap: 8px;
  z-index: 5;
  position: relative;
  perspective: 800px;
}

.memory-card {
  width: 72px;
  height: 80px;
  cursor: pointer;
  perspective: 600px;
  -webkit-tap-highlight-color: transparent;
}

.memory-card:active .card-inner {
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
  border-radius: var(--radius-md);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.card-back__emoji {
  font-size: 28px;
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

.card-front__emoji {
  font-size: 24px;
}

.card-front__label {
  font-size: 8px;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
}

.memory-card--matched .card-front {
  border-color: #f97316;
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.5), 0 0 24px rgba(249, 115, 22, 0.2);
  background: rgba(255, 247, 237, 0.95);
}

.memory-card--matched {
  cursor: default;
}

/* feedback handled by .game-feedback */
@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* Responsive: smaller screens */
@media (max-width: 420px) {
  .card-grid {
    grid-template-columns: repeat(5, 62px);
    grid-template-rows: repeat(2, 72px);
    gap: 5px;
  }

  .memory-card {
    width: 62px;
    height: 72px;
  }

  .card-front__emoji { font-size: 20px; }
  .card-front__label { font-size: 7px; }
  .card-back__emoji { font-size: 22px; }
}

@media (max-width: 360px) {
  .card-grid {
    grid-template-columns: repeat(4, 62px);
    grid-template-rows: auto;
    gap: 5px;
  }
}
</style>
