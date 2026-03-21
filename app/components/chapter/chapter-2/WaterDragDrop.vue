<template>
  <MinigameShell
    title="Regar con estrategia"
    description="Arrastra las gotas de agua a las plantas que las necesitan. ¡No la desperdicies!"
    :completed="plantsWatered"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    :time-limit="90"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="water-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <!-- Background -->
      <SceneSky variant="nice" />
      <SceneStreet variant="normal" />

      <!-- Hint -->
      <div class="water-hint">
        {{ dragging ? '⬇️ Suelta sobre una planta' : '👆 Arrastra una gota del pozo a una planta' }}
      </div>

      <!-- Game layout -->
      <div class="game-layout">
        <!-- Well (left side) -->
        <div class="well-area" ref="wellRef">
          <div class="well">
            <div class="well-roof" />
            <div class="well-body">
              <div class="well-label">Pozo</div>
              <div class="well-drops">
                <div
                  v-for="drop in drops"
                  :key="drop.id"
                  class="water-drop"
                  :class="{
                    'water-drop--used': drop.used,
                    'water-drop--dragging': dragging?.id === drop.id,
                  }"
                  :style="dropStyle(drop)"
                  @pointerdown.prevent="onPointerDown(drop, $event)"
                >
                  <span class="water-drop__emoji">💧</span>
                </div>
              </div>
            </div>
          </div>
          <div class="water-counter">
            💧 &times; {{ dropsRemaining }}
          </div>
        </div>

        <!-- Plant zones (right area) -->
        <div class="plants-area" ref="plantsAreaRef">
          <div
            v-for="plant in plants"
            :key="plant.id"
            class="plant-zone"
            :class="{
              'plant-zone--watered': plant.watered,
              'plant-zone--wasted': plant.wasted,
              'plant-zone--hover': hoveredPlant === plant.id,
            }"
            :data-plant-id="plant.id"
          >
            <span class="plant-zone__emoji">{{ plant.watered ? '💦' : plant.emoji }}</span>
            <span class="plant-zone__label">{{ plant.label }}</span>
          </div>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div
          v-if="feedback"
          class="feedback"
          :class="feedback.type === 'correct' ? 'feedback--correct' : 'feedback--wrong'"
        >
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

defineEmits<{ complete: [] }>()

const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface WaterDrop {
  id: string
  used: boolean
}

interface PlantZone {
  id: string
  label: string
  emoji: string
  needsWater: boolean
  watered: boolean
  wasted: boolean
  feedbackOk: string
  feedbackBad: string
}

const plantData: Omit<PlantZone, 'watered' | 'wasted'>[] = [
  { id: 'z1', label: 'Árbol joven', emoji: '🌳', needsWater: true, feedbackOk: '¡El árbol joven necesitaba esa agua!', feedbackBad: '' },
  { id: 'z2', label: 'Jardinera nueva', emoji: '🪴', needsWater: true, feedbackOk: '¡La jardinera revive!', feedbackBad: '' },
  { id: 'z3', label: 'Plantas débiles', emoji: '🌿', needsWater: true, feedbackOk: 'Las plantas débiles ya se ven mejor.', feedbackBad: '' },
  { id: 'z4', label: 'Plato para Bolillo', emoji: '🐕', needsWater: true, feedbackOk: '¡Bolillo tendrá agua fresca!', feedbackBad: '' },
  { id: 'z5', label: 'Piedra', emoji: '🪨', needsWater: false, feedbackOk: '', feedbackBad: 'La piedra no necesita agua.' },
  { id: 'z6', label: 'Banqueta', emoji: '🧱', needsWater: false, feedbackOk: '', feedbackBad: 'La banqueta no la absorbe. ¡Agua desperdiciada!' },
]

const dropData: WaterDrop[] = [
  { id: 'd1', used: false },
  { id: 'd2', used: false },
  { id: 'd3', used: false },
  { id: 'd4', used: false },
  { id: 'd5', used: false },
  { id: 'd6', used: false },
]

// State
const drops = ref<WaterDrop[]>([])
const plants = ref<PlantZone[]>([])
const plantsWatered = ref(0)
const isComplete = computed(() => plantsWatered.value >= 4)
const showResult = ref(false)
const dropsRemaining = computed(() => drops.value.filter(d => !d.used).length)

// Drag state
const dragging = ref<WaterDrop | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const dragStarted = ref(false)
let rafPending = false
const hoveredPlant = ref<string | null>(null)
const wellRef = ref<HTMLElement | null>(null)
const plantsAreaRef = ref<HTMLElement | null>(null)

// Feedback
const feedback = ref<{ message: string; type: 'correct' | 'wrong' } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function onStart() {
  drops.value = dropData.map(d => ({ ...d }))
  plants.value = plantData.map(p => ({ ...p, watered: false, wasted: false }))
  plantsWatered.value = 0
}

// --- Drag handlers ---
function onPointerDown(drop: WaterDrop, e: PointerEvent) {
  if (drop.used) return
  dragging.value = drop
  dragStarted.value = false
  dragPos.value = { x: e.clientX, y: e.clientY }
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  dragStarted.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(() => {
    rafPending = false

  // Check if hovering over a plant zone
  const el = document.elementFromPoint(e.clientX, e.clientY)
  const plantEl = el?.closest('[data-plant-id]') as HTMLElement | null
  hoveredPlant.value = plantEl?.dataset.plantId ?? null
  })
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return

  if (dragStarted.value) {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const plantEl = el?.closest('[data-plant-id]') as HTMLElement | null
    const plantId = plantEl?.dataset.plantId

    if (plantId) {
      handleDrop(dragging.value, plantId)
    }
    // If dropped on nothing (no plant zone), drop returns to well — not consumed
  }

  dragging.value = null
  dragStarted.value = false
  hoveredPlant.value = null
}

function handleDrop(drop: WaterDrop, plantId: string) {
  const plant = plants.value.find(p => p.id === plantId)
  if (!plant) return

  // Already watered or already wasted — ignore
  if (plant.watered || plant.wasted) return

  // Consume the drop
  drop.used = true

  if (plant.needsWater) {
    // Success
    plant.watered = true
    plantsWatered.value++
    showFeedback(plant.feedbackOk, 'correct')

    nextTick(() => {
      const plantEl = document.querySelector(`[data-plant-id="${plantId}"]`)
      if (plantEl) celebrateSuccess(plantEl)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.water-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 800)
    }
  } else {
    // Wasted — drop is consumed but no progress
    plant.wasted = true
    showFeedback(plant.feedbackBad, 'wrong')

    nextTick(() => {
      const plantEl = document.querySelector(`[data-plant-id="${plantId}"]`)
      if (plantEl) shakeWrong(plantEl)
    })

    // Check if out of drops without completing
    nextTick(() => {
      if (dropsRemaining.value <= 0 && !isComplete.value) {
        setTimeout(() => { showResult.value = true }, 1200)
      }
    })
  }
}

function dropStyle(drop: WaterDrop) {
  if (dragging.value?.id === drop.id && dragStarted.value) {
    return {
      position: 'fixed' as const,
      left: (dragPos.value.x - 22) + 'px',
      top: (dragPos.value.y - 22) + 'px',
      zIndex: 200,
    }
  }
  return {}
}

function showFeedback(message: string, type: 'correct' | 'wrong') {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, type }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 2000)
}

function onTimeout() {
  showResult.value = true
}

function resetGame() {
  drops.value = dropData.map(d => ({ ...d }))
  plants.value = plantData.map(p => ({ ...p, watered: false, wasted: false }))
  plantsWatered.value = 0
  showResult.value = false
  dragging.value = null
  hoveredPlant.value = null
}
</script>

<style scoped>
.water-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  touch-action: none;
}

.water-hint {
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
}

/* Main layout: well on left, plants on right */
.game-layout {
  flex: 1;
  display: flex;
  gap: 8px;
  padding: 40px 8px 8px;
  position: relative;
  z-index: 5;
}

/* Well area */
.well-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 90px;
  flex-shrink: 0;
}

.well {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.well-roof {
  width: 80px;
  height: 14px;
  background: linear-gradient(135deg, #92400e, #78350f);
  border-radius: 4px 4px 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.well-body {
  width: 70px;
  background: linear-gradient(180deg, #60a5fa, #3b82f6, #2563eb);
  border-radius: 0 0 8px 8px;
  border: 3px solid #93c5fd;
  padding: 6px 4px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.2);
}

.well-label {
  font-size: 11px;
  font-weight: 800;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.well-drops {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.water-drop {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: grab;
  touch-action: none;
  transition: transform 150ms var(--ease-spring), opacity 200ms ease;
}

.water-drop:active {
  cursor: grabbing;
}

.water-drop--used {
  opacity: 0;
  pointer-events: none;
  transform: scale(0);
}

.water-drop--dragging {
  transform: scale(1.3);
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.5);
  border-color: white;
  background: rgba(255, 255, 255, 0.5);
  z-index: 200;
  pointer-events: none;
}

.water-drop__emoji {
  font-size: 20px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.water-counter {
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 800;
  color: #1e40af;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
}

/* Plant zones area */
.plants-area {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  padding: 4px;
}

.plant-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 3px dashed rgba(45, 106, 79, 0.5);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.75);
  cursor: default;
  transition: all 250ms var(--ease-spring);
  padding: 8px 4px;
  min-height: 70px;
}

.plant-zone--hover {
  transform: scale(1.06);
  border-color: #3b82f6;
  border-style: solid;
  background: rgba(219, 234, 254, 0.9);
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.3);
}

.plant-zone--watered {
  border: 3px solid #16a34a;
  background: rgba(220, 252, 231, 0.95);
  cursor: default;
}

.plant-zone--watered .plant-zone__emoji {
  font-size: 32px;
  animation: scaleIn 0.5s ease;
}

.plant-zone--wasted {
  border: 3px solid #dc2626;
  background: rgba(254, 226, 226, 0.9);
  opacity: 0.6;
  cursor: default;
}

.plant-zone__emoji {
  font-size: 28px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
  transition: font-size 300ms ease;
}

.plant-zone__label {
  font-size: 11px;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
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

.feedback--correct {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.feedback--wrong {
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

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
</style>
