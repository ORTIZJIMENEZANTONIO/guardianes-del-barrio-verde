<template>
  <MinigameShell
    title="Despejar senderos"
    mascot-character-id="bolillo"
    particle-preset="nature"
    description="Arrastra cada obstaculo fuera del camino para abrir los senderos."
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
    <div class="pathclear-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <!-- Background -->
      <SceneSky variant="nice" />
      <SceneStreet variant="dirty" />

      <!-- Game area with paths and obstacles -->
      <div class="scene-area">
        <!-- Park paths (3 horizontal senderos) -->
        <div
          v-for="path in paths"
          :key="path.id"
          class="sendero"
          :style="{ top: path.y + '%' }"
        >
          <div
            v-for="seg in path.segments"
            :key="seg.id"
            class="sendero__segment"
            :class="{ 'sendero__segment--clear': seg.cleared }"
          />
        </div>

        <!-- Obstacles on the paths -->
        <div
          v-for="obs in visibleObstacles"
          :key="obs.id"
          class="obstacle game-item"
          :class="{
            'obstacle--dragging game-item--dragging': dragging?.id === obs.id && dragStarted,
          }"
          :style="obstacleStyle(obs)"
          @pointerdown.prevent="onPointerDown(obs, $event)"
          @click="onObstacleClick(obs)"
        >
          <span class="obstacle__emoji game-item__emoji">{{ obs.emoji }}</span>
          <span class="obstacle__name game-item__label">{{ obs.name }}</span>
        </div>

        <!-- Cleanup zone (right 20%) -->
        <div
          class="cleanup-zone game-zone"
          :class="{ 'cleanup-zone--active game-zone--highlight': !!dragging }"
        >
          <span class="cleanup-zone__label">Zona de limpieza</span>
          <span class="cleanup-zone__arrow">&rarr;</span>
          <div class="cleanup-zone__pile">
            <span
              v-for="item in clearedItems"
              :key="item.id"
              class="cleanup-zone__item"
            >
              {{ item.emoji }}
            </span>
          </div>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div
          v-if="feedback"
          class="pathclear-feedback game-feedback"
          :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'"
        >
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Progress bar at bottom -->
      <div class="pathclear-progress">
        <span class="pathclear-progress__text">
          Senderos despejados: {{ cleared }}/6
        </span>
      </div>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

defineEmits<{ complete: [] }>()

const { celebrateSuccess, shakeWrong, confettiBurst } = useGameAnimations()

interface Obstacle {
  id: string
  name: string
  emoji: string
  x: number
  y: number
  originX: number
  originY: number
  cleared: boolean
  successMessage: string
  pathId: string
  segmentId: string
}

interface PathSegment {
  id: string
  cleared: boolean
}

interface SenderoPath {
  id: string
  y: number
  segments: PathSegment[]
}

const obstaclesData: Obstacle[] = [
  { id: 'o1', name: 'Rama caida', emoji: '\u{1FAB5}', x: 15, y: 30, originX: 15, originY: 30, cleared: false, successMessage: '\u00a1Rama retirada! El sendero se abre.', pathId: 'p1', segmentId: 'p1-s1' },
  { id: 'o2', name: 'Piedra grande', emoji: '\u{1FAA8}', x: 35, y: 55, originX: 35, originY: 55, cleared: false, successMessage: '\u00a1Piedra movida! Ya se puede pasar.', pathId: 'p2', segmentId: 'p2-s1' },
  { id: 'o3', name: 'Arbusto seco', emoji: '\u{1F33F}', x: 50, y: 30, originX: 50, originY: 30, cleared: false, successMessage: '\u00a1Arbusto despejado!', pathId: 'p1', segmentId: 'p1-s2' },
  { id: 'o4', name: 'Escombro viejo', emoji: '\u{1F9F1}', x: 25, y: 65, originX: 25, originY: 65, cleared: false, successMessage: 'Escombro retirado del camino.', pathId: 'p3', segmentId: 'p3-s1' },
  { id: 'o5', name: 'Cerca rota', emoji: '\u{1FAA4}', x: 60, y: 55, originX: 60, originY: 55, cleared: false, successMessage: '\u00a1Cerca retirada!', pathId: 'p2', segmentId: 'p2-s2' },
  { id: 'o6', name: 'Hojas acumuladas', emoji: '\u{1F342}', x: 45, y: 65, originX: 45, originY: 65, cleared: false, successMessage: '\u00a1Hojas barridas!', pathId: 'p3', segmentId: 'p3-s2' },
]

const pathsData: SenderoPath[] = [
  { id: 'p1', y: 30, segments: [{ id: 'p1-s1', cleared: false }, { id: 'p1-s2', cleared: false }] },
  { id: 'p2', y: 55, segments: [{ id: 'p2-s1', cleared: false }, { id: 'p2-s2', cleared: false }] },
  { id: 'p3', y: 65, segments: [{ id: 'p3-s1', cleared: false }, { id: 'p3-s2', cleared: false }] },
]

const obstacles = ref<Obstacle[]>([])
const paths = ref<SenderoPath[]>([])
const visibleObstacles = computed(() => obstacles.value.filter(o => !o.cleared))
const clearedItems = computed(() => obstacles.value.filter(o => o.cleared))
const cleared = ref(0)
const isComplete = computed(() => cleared.value >= 6)
const showResult = ref(false)

// Drag state
const dragging = ref<Obstacle | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const dragStarted = ref(false)

// Feedback
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function onStart() {
  obstacles.value = obstaclesData.map(o => ({ ...o }))
  paths.value = pathsData.map(p => ({
    ...p,
    segments: p.segments.map(s => ({ ...s })),
  }))
  cleared.value = 0
}

function obstacleStyle(obs: Obstacle) {
  if (dragging.value?.id === obs.id && dragStarted.value) {
    return {
      position: 'fixed' as const,
      left: (dragPos.value.x - 32) + 'px',
      top: (dragPos.value.y - 32) + 'px',
      zIndex: 100,
    }
  }
  return {
    left: obs.x + '%',
    top: obs.y + '%',
  }
}

// --- Pointer / drag handlers ---
function onPointerDown(obs: Obstacle, e: PointerEvent) {
  if (obs.cleared) return
  dragging.value = obs
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
    // Check if dropped in the cleanup zone (rightmost 20% of the game area)
    const gameEl = document.querySelector('.scene-area')
    if (gameEl) {
      const rect = gameEl.getBoundingClientRect()
      const threshold = rect.left + rect.width * 0.80

      if (e.clientX >= threshold) {
        clearObstacle(dragging.value)
      } else {
        // Return to original position — animate via resetting coords
        showFB('No soltaste en la zona correcta. 💡 Arrastra el obstáculo hasta la zona verde del lado derecho.', false)
        const sceneEl = document.querySelector('.scene-area')
        if (sceneEl) shakeWrong(sceneEl)
      }
    }
  }

  dragging.value = null
  dragStarted.value = false
}

// --- Click/tap handler ---
function onObstacleClick(obs: Obstacle) {
  if (dragStarted.value || obs.cleared) return
  clearObstacle(obs)
}

function clearObstacle(obs: Obstacle) {
  obs.cleared = true
  cleared.value++

  // Mark corresponding path segment as cleared
  const path = paths.value.find(p => p.id === obs.pathId)
  if (path) {
    const segment = path.segments.find(s => s.id === obs.segmentId)
    if (segment) segment.cleared = true
  }

  showFB(obs.successMessage, true)

  nextTick(() => {
    const zoneEl = document.querySelector('.cleanup-zone')
    if (zoneEl) celebrateSuccess(zoneEl)
  })

  if (isComplete.value) {
    const gameEl = document.querySelector('.pathclear-game')
    if (gameEl) confettiBurst(gameEl, 24)
    setTimeout(() => { showResult.value = true }, 1000)
  }
}

function onTimeout() {
  showResult.value = true
}

function resetGame() {
  obstacles.value = obstaclesData.map(o => ({ ...o }))
  paths.value = pathsData.map(p => ({
    ...p,
    segments: p.segments.map(s => ({ ...s })),
  }))
  cleared.value = 0
  showResult.value = false
  dragging.value = null
  dragStarted.value = false
  feedback.value = null
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

.scene-area {
  flex: 1;
  position: relative;
  z-index: 5;
  background: transparent;
}

/* --- Park paths (senderos) --- */
.sendero {
  position: absolute;
  left: 5%;
  width: 75%;
  height: 4px;
  display: flex;
  gap: 0;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}

.sendero__segment {
  flex: 1;
  height: 100%;
  border-bottom: 4px dashed rgba(120, 113, 100, 0.5);
  transition: border-color 0.5s ease, border-style 0.5s ease;
}

.sendero__segment--clear {
  border-bottom: 4px solid #22c55e;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

/* --- Obstacles --- */
.obstacle {
  position: absolute;
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: white;
  border: 3px solid #d1d5db;
  border-radius: var(--radius-md);
  cursor: grab;
  touch-action: none;
  transition: transform 150ms var(--ease-spring), box-shadow 150ms ease;
  z-index: 6;
  box-shadow: var(--shadow-md);
  transform: translate(-50%, -50%);
  user-select: none;
  -webkit-user-select: none;
}

.obstacle:active {
  cursor: grabbing;
}

/* dragging styles handled by .game-item--dragging */

.obstacle__emoji {
  font-size: 28px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

.obstacle__name {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  text-align: center;
  max-width: 64px;
}

/* --- Cleanup zone (right 20%) --- */
.cleanup-zone {
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  border-left: 3px dashed #22c55e;
  background: rgba(34, 197, 94, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 16px;
  gap: 8px;
  z-index: 3;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.cleanup-zone--active {
  background: rgba(34, 197, 94, 0.15);
  border-color: #16a34a;
  box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.12);
  animation: pulse 1.2s ease-in-out infinite;
}

.cleanup-zone__label {
  font-size: 11px;
  font-weight: 800;
  color: #15803d;
  text-align: center;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.cleanup-zone__arrow {
  font-size: 20px;
  color: #22c55e;
  font-weight: 800;
  opacity: 0.7;
}

.cleanup-zone__pile {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  padding: 0 4px;
}

.cleanup-zone__item {
  font-size: 22px;
  animation: scaleIn 0.4s var(--ease-spring);
  filter: grayscale(0.3) opacity(0.7);
}

/* feedback handled by global .game-feedback */



/* --- Progress bar --- */
.pathclear-progress {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 3px solid rgba(0, 0, 0, 0.08);
  text-align: center;
  z-index: 5;
  position: relative;
}

.pathclear-progress__text {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text);
}

/* --- Transitions --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
