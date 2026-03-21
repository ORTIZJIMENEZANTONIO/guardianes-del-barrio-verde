<template>
  <MinigameShell
    title="Controlar el desperdicio"
    description="Arrastra los obstáculos fuera del agua para despejar el paso."
    :completed="cleared"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    :time-limit="90"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="flood-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <!-- Background -->
      <SceneSky variant="nice" />
      <SceneStreet variant="dirty" />

      <!-- Game area -->
      <div class="game-area" ref="gameAreaRef">
        <!-- Water overlay -->
        <div class="water-overlay" :style="{ height: waterHeight + '%' }">
          <div class="water-surface" />
        </div>

        <!-- Draggable obstacles -->
        <div
          v-for="item in visibleObstacles"
          :key="item.id"
          class="obstacle"
          :class="{
            'obstacle--dragging': dragging?.id === item.id && dragStarted,
          }"
          :style="obstacleStyle(item)"
          @pointerdown.prevent="onPointerDown(item, $event)"
        >
          <span class="obstacle__emoji">{{ item.emoji }}</span>
          <span class="obstacle__name">{{ item.name }}</span>
        </div>

        <!-- Safe zone -->
        <div class="safe-zone" ref="safeZoneRef">
          <div class="safe-zone__label">Zona segura &rarr;</div>

          <!-- Already-safe items (not draggable) -->
          <div
            v-for="item in safeItems"
            :key="item.id"
            class="safe-item"
          >
            <span class="safe-item__emoji">{{ item.emoji }}</span>
            <span class="safe-item__name">{{ item.name }}</span>
          </div>

          <!-- Cleared items that were dragged here -->
          <div
            v-for="item in clearedItems"
            :key="item.id"
            class="safe-item safe-item--cleared"
          >
            <span class="safe-item__emoji">{{ item.emoji }}</span>
            <span class="safe-item__name">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <!-- Hint -->
      <div class="flood-hint">
        {{ dragging ? '⬅️ Lleva el obstáculo a la zona segura' : '👆 Arrastra los obstáculos fuera del agua' }}
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="feedback" :class="feedback.type === 'success' ? 'feedback--success' : 'feedback--error'">
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

defineEmits<{ complete: [] }>()

const { celebrateSuccess, confettiBurst, shakeWrong } = useGameAnimations()

interface Obstacle {
  id: string
  name: string
  emoji: string
  x: number
  y: number
  cleared: boolean
}

interface SafeItem {
  id: string
  name: string
  emoji: string
}

const obstaclesData: Obstacle[] = [
  { id: 'o1', name: 'Bolsa de basura', emoji: '\uD83D\uDECD\uFE0F', x: 20, y: 40, cleared: false },
  { id: 'o2', name: 'Escombro', emoji: '\uD83E\uDDF1', x: 45, y: 50, cleared: false },
  { id: 'o3', name: 'Llanta vieja', emoji: '\uD83D\uDEDE', x: 30, y: 60, cleared: false },
  { id: 'o4', name: 'Ramas caídas', emoji: '\uD83E\uDEB5', x: 60, y: 35, cleared: false },
  { id: 'o5', name: 'Plásticos', emoji: '\uD83E\uDD64', x: 50, y: 55, cleared: false },
]

const safeItems: SafeItem[] = [
  { id: 's1', name: 'Banca', emoji: '\uD83E\uDE91' },
  { id: 's2', name: 'Poste', emoji: '\uD83C\uDFD7\uFE0F' },
]

const obstacles = ref<Obstacle[]>([])
const cleared = ref(0)
const isComplete = computed(() => cleared.value >= 5)
const showResult = ref(false)

const visibleObstacles = computed(() => obstacles.value.filter(o => !o.cleared))
const clearedItems = computed(() => obstacles.value.filter(o => o.cleared))

// Water level: starts at 80%, drops ~12% per obstacle cleared, minimum 20%
const waterHeight = computed(() => Math.max(20, 80 - cleared.value * 12))

// Drag state
const dragging = ref<Obstacle | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const dragStarted = ref(false)
const gameAreaRef = ref<HTMLElement | null>(null)
const safeZoneRef = ref<HTMLElement | null>(null)

// Feedback
const feedback = ref<{ message: string; type: 'success' | 'error' } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function showFeedback(message: string, type: 'success' | 'error') {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, type }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 1500)
}

function onStart() {
  obstacles.value = obstaclesData.map(o => ({ ...o }))
  cleared.value = 0
  showResult.value = false
}

function onPointerDown(item: Obstacle, e: PointerEvent) {
  if (item.cleared) return
  dragging.value = item
  dragStarted.value = false
  dragPos.value = { x: e.clientX, y: e.clientY }
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  dragStarted.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return

  if (dragStarted.value) {
    const inSafeZone = isInSafeZone(e.clientX)
    if (inSafeZone) {
      clearObstacle(dragging.value)
    } else {
      showFeedback('Llévalo a la zona segura', 'error')
      const gameEl = document.querySelector('.game-area')
      if (gameEl) shakeWrong(gameEl)
    }
  }

  dragging.value = null
  dragStarted.value = false
}

function isInSafeZone(clientX: number): boolean {
  if (!gameAreaRef.value) return false
  const rect = gameAreaRef.value.getBoundingClientRect()
  const threshold = rect.left + rect.width * 0.80
  return clientX >= threshold
}

function clearObstacle(item: Obstacle) {
  item.cleared = true
  cleared.value++
  showFeedback('¡Despejado! ' + item.emoji, 'success')

  nextTick(() => {
    const clearedEl = document.querySelector(`.safe-item--cleared:last-child`)
    if (clearedEl) celebrateSuccess(clearedEl)
  })

  if (isComplete.value) {
    const gameEl = document.querySelector('.flood-game')
    if (gameEl) confettiBurst(gameEl, 24)
    setTimeout(() => { showResult.value = true }, 800)
  }
}

function obstacleStyle(item: Obstacle) {
  if (dragging.value?.id === item.id && dragStarted.value) {
    return {
      position: 'fixed' as const,
      left: (dragPos.value.x - 35) + 'px',
      top: (dragPos.value.y - 35) + 'px',
      zIndex: 200,
    }
  }
  return { left: item.x + '%', top: item.y + '%' }
}

function onTimeout() {
  showResult.value = true
}

function resetGame() {
  obstacles.value = obstaclesData.map(o => ({ ...o }))
  cleared.value = 0
  showResult.value = false
  dragging.value = null
  feedback.value = null
}
</script>

<style scoped>
.flood-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  touch-action: none;
}

.game-area {
  flex: 1;
  position: relative;
  z-index: 5;
  overflow: hidden;
}

/* Water overlay */
.water-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 20%;
  background: rgba(59, 130, 246, 0.35);
  transition: height 800ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
  pointer-events: none;
}

.water-surface {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.5),
    rgba(96, 165, 250, 0.7),
    rgba(59, 130, 246, 0.5)
  );
  border-radius: 0 0 0 0;
  animation: waterWave 3s ease-in-out infinite;
}

@keyframes waterWave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Safe zone */
.safe-zone {
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  border-left: 3px dashed #22c55e;
  background: rgba(34, 197, 94, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  gap: 8px;
  z-index: 4;
}

.safe-zone__label {
  font-size: 11px;
  font-weight: 800;
  color: #16a34a;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
}

.safe-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-md);
  opacity: 0.45;
  filter: grayscale(0.5);
  min-width: 56px;
}

.safe-item--cleared {
  opacity: 1;
  filter: none;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #22c55e;
  box-shadow: var(--shadow-md);
}

.safe-item__emoji {
  font-size: 22px;
}

.safe-item__name {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
}

/* Draggable obstacles */
.obstacle {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 10px 6px;
  background: white;
  border: 3px solid #60a5fa;
  border-radius: var(--radius-md);
  cursor: grab;
  touch-action: none;
  transition: transform 150ms var(--ease-spring), box-shadow 150ms ease, border-color 150ms ease;
  z-index: 6;
  box-shadow: var(--shadow-md);
  min-width: 70px;
  min-height: 70px;
  justify-content: center;
}

.obstacle:active {
  cursor: grabbing;
}

.obstacle--dragging {
  transform: scale(1.15) rotate(-3deg);
  box-shadow: var(--shadow-xl);
  border-color: #22c55e;
  background: #f0fdf4;
  z-index: 200;
  pointer-events: none;
  animation: none;
}

.obstacle__emoji {
  font-size: 28px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

.obstacle__name {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  text-align: center;
  max-width: 70px;
}

/* Hint */
.flood-hint {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 18px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text);
  z-index: 10;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
  transition: all 300ms ease;
}

/* Feedback */
.feedback {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 14px 28px;
  border-radius: var(--radius-lg);
  font-weight: 800;
  font-size: 16px;
  z-index: 50;
  animation: popIn 400ms var(--ease-spring);
  box-shadow: var(--shadow-lg);
  text-align: center;
  max-width: 280px;
}

.feedback--success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.feedback--error {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
