<template>
  <div class="swipe-game">
    <SceneSky :variant="skyVariant" />
    <SceneStreet :variant="streetVariant" />

    <div class="game-hint">
      {{ hint }} · {{ classified }}/{{ items.length }}
    </div>

    <!-- Category labels -->
    <div class="swipe-labels">
      <div class="swipe-label swipe-label--left" :class="{ 'swipe-label--active': swipeDir === 'left' }">
        ← {{ leftLabel }}
      </div>
      <div class="swipe-label swipe-label--right" :class="{ 'swipe-label--active': swipeDir === 'right' }">
        {{ rightLabel }} →
      </div>
    </div>

    <!-- Card stack -->
    <div class="swipe-stack" ref="stackRef">
      <div
        v-if="currentItem"
        class="swipe-card"
        :class="{
          'swipe-card--left': flyDir === 'left',
          'swipe-card--right': flyDir === 'right',
          'swipe-card--correct': flyResult === 'correct',
          'swipe-card--wrong': flyResult === 'wrong',
        }"
        :style="cardStyle"
        @pointerdown.prevent="onPointerDown"
        @pointermove.prevent="onPointerMove"
        @pointerup.prevent="onPointerUp"
      >
        <span class="swipe-card__emoji">{{ currentItem.emoji }}</span>
        <span class="swipe-card__label">{{ currentItem.label }}</span>
        <span v-if="currentItem.detail" class="swipe-card__detail">{{ currentItem.detail }}</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="allDone" class="swipe-done">
        ✅
      </div>
    </div>

    <!-- Streak / combo -->
    <div v-if="streak >= 3" class="swipe-combo">
      🔥 Racha: {{ streak }}
    </div>

    <!-- Swipe buttons (fallback for no-swipe) -->
    <div class="swipe-buttons">
      <button class="swipe-btn swipe-btn--left" :disabled="!currentItem" @click="classify('left')">
        ← {{ leftLabel }}
      </button>
      <button class="swipe-btn swipe-btn--right" :disabled="!currentItem" @click="classify('right')">
        {{ rightLabel }} →
      </button>
    </div>

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

export interface SwipeItem {
  id: string
  emoji: string
  label: string
  detail?: string
  category: 'left' | 'right'
  message?: string
}

const props = withDefaults(defineProps<{
  items: SwipeItem[]
  leftLabel?: string
  rightLabel?: string
  hint?: string
  skyVariant?: string
  streetVariant?: string
}>(), {
  leftLabel: 'Categoría A',
  rightLabel: 'Categoría B',
  hint: '👆 Desliza o toca un botón para clasificar',
  skyVariant: 'nice',
  streetVariant: 'normal',
})

const emit = defineEmits<{
  complete: []
  update: [classified: number, total: number]
}>()

const { celebrateSuccess, shakeWrong } = useGameAnimations()
const { feedback, showOk, showNo, clear: clearFeedback } = useGameFeedback()

const queue = ref<SwipeItem[]>([])
const classified = ref(0)
const streak = ref(0)
const allDone = computed(() => queue.value.length === 0 && classified.value > 0)
const currentItem = computed(() => queue.value[0] ?? null)

// Swipe state
const dragging = ref(false)
const startX = ref(0)
const offsetX = ref(0)
const swipeDir = computed<'left' | 'right' | null>(() => {
  if (Math.abs(offsetX.value) < 20) return null
  return offsetX.value < 0 ? 'left' : 'right'
})
const flyDir = ref<'left' | 'right' | null>(null)
const flyResult = ref<'correct' | 'wrong' | null>(null)
const stackRef = ref<HTMLElement | null>(null)

const cardStyle = computed(() => {
  if (flyDir.value) return {}
  if (!dragging.value) return {}
  const rotation = offsetX.value * 0.1
  return {
    transform: `translateX(${offsetX.value}px) rotate(${rotation}deg)`,
    transition: 'none',
  }
})

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function start() {
  queue.value = shuffle([...props.items])
  classified.value = 0
  streak.value = 0
  flyDir.value = null
  flyResult.value = null
  clearFeedback()
  emit('update', 0, props.items.length)
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true
  startX.value = e.clientX
  offsetX.value = 0
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  offsetX.value = e.clientX - startX.value
}

function onPointerUp() {
  if (!dragging.value) return
  dragging.value = false

  const threshold = 60
  if (offsetX.value < -threshold) {
    classify('left')
  } else if (offsetX.value > threshold) {
    classify('right')
  } else {
    offsetX.value = 0
  }
}

function classify(dir: 'left' | 'right') {
  if (!currentItem.value) return
  const item = currentItem.value
  const correct = item.category === dir

  flyDir.value = dir
  flyResult.value = correct ? 'correct' : 'wrong'

  if (correct) {
    streak.value++
    showOk(item.message || '¡Correcto!')
    nextTick(() => {
      const el = document.querySelector('.swipe-card')
      if (el) celebrateSuccess(el)
    })
  } else {
    streak.value = 0
    const correctLabel = item.category === 'left' ? props.leftLabel : props.rightLabel
    showNo(`Ese va en "${correctLabel}". ${item.message || ''}`)
    nextTick(() => {
      const el = document.querySelector('.swipe-card')
      if (el) shakeWrong(el)
    })
  }

  // Advance to next after animation
  setTimeout(() => {
    queue.value.shift()
    classified.value++
    flyDir.value = null
    flyResult.value = null
    offsetX.value = 0

    emit('update', classified.value, props.items.length)

    if (allDone.value) {
      setTimeout(() => emit('complete'), 500)
    }
  }, 400)
}

function reset() { start() }

defineExpose({ start, reset, classified, allDone })
</script>

<style scoped>
.swipe-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.swipe-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 6;
  position: relative;
}

.swipe-label {
  font-size: 12px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.7);
  color: var(--color-text);
  transition: all 200ms ease;
}

.swipe-label--active.swipe-label--left {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.swipe-label--active.swipe-label--right {
  background: #f97316;
  color: white;
  transform: scale(1.1);
}

/* Card stack */
.swipe-stack {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  position: relative;
  padding: 16px;
}

.swipe-card {
  width: min(70vw, 260px);
  padding: 24px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  transition: transform 300ms var(--ease-spring), opacity 300ms ease;
  touch-action: pan-y;
  user-select: none;
}

.swipe-card:active { cursor: grabbing; }

.swipe-card--left {
  transform: translateX(-120vw) rotate(-20deg) !important;
  opacity: 0;
  transition: transform 400ms ease, opacity 400ms ease;
}

.swipe-card--right {
  transform: translateX(120vw) rotate(20deg) !important;
  opacity: 0;
  transition: transform 400ms ease, opacity 400ms ease;
}

.swipe-card--correct {
  border: 3px solid var(--color-green-mid);
}

.swipe-card--wrong {
  border: 3px solid var(--color-coral);
}

.swipe-card__emoji { font-size: 48px; }
.swipe-card__label { font-size: 16px; font-weight: 800; color: var(--color-text); text-align: center; }
.swipe-card__detail { font-size: 12px; color: #64748b; text-align: center; line-height: 1.4; }

.swipe-done { font-size: 48px; }

/* Combo */
.swipe-combo {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  background: rgba(249, 115, 22, 0.9);
  color: white;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 900;
  z-index: 10;
  animation: scaleIn 0.3s ease;
}

/* Buttons */
.swipe-buttons {
  display: flex;
  gap: 12px;
  padding: 8px 16px 12px;
  z-index: 10;
  position: relative;
}

.swipe-btn {
  flex: 1;
  padding: 10px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  border: 2px solid;
  transition: all 150ms;
}

.swipe-btn:active { transform: scale(0.95); }
.swipe-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.swipe-btn--left {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #3b82f6;
}
.swipe-btn--left:hover:not(:disabled) { background: #3b82f6; color: white; }

.swipe-btn--right {
  background: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
  color: #f97316;
}
.swipe-btn--right:hover:not(:disabled) { background: #f97316; color: white; }

@keyframes scaleIn {
  from { transform: translateY(-50%) scale(0); }
  to { transform: translateY(-50%) scale(1); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
