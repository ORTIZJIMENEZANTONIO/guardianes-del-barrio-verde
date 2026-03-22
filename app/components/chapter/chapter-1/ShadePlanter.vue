<template>
  <MinigameShell
    title="Plantar sombra"
    description="Arrastra los árboles a los mejores puntos de la calle. ¡Cuidado dónde los pones!"
    :completed="treesPlanted"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="planter-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <SceneSky variant="nice" />
      <SceneStreet variant="normal" />

      <!-- Drop zones (planting spots) -->
      <div class="street-grid">
        <div
          v-for="slot in plantSlots"
          :key="slot.id"
          class="plant-slot game-zone"
          :class="{
            'plant-slot--planted game-zone--filled': slot.planted,
            'plant-slot--wrong game-zone--wrong': slot.wrongAttempt,
            'plant-slot--highlight game-zone--highlight': !!dragging && !slot.planted,
            'plant-slot--hover game-zone--hover': hoveredSlot === slot.id && !slot.planted,
          }"
          :style="{ left: slot.x + '%', top: slot.y + '%' }"
          :data-slot="slot.id"
        >
          <template v-if="slot.planted">
            <span class="planted-tree">🌳</span>
            <div class="shade-circle" />
          </template>
          <template v-else>
            <span class="slot-icon">{{ slot.emoji }}</span>
            <span class="slot-label">{{ slot.label }}</span>
          </template>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="plant-feedback game-feedback" :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'">
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Seed tray at bottom — draggable trees -->
      <div class="seed-tray game-tray">
        <div class="seed-tray__info">
          🌱 Semillas: {{ seedsRemaining }}
        </div>
        <div class="seed-tray__items">
          <div
            v-for="seed in seeds"
            :key="seed.id"
            class="seed-item game-item"
            :class="{
              'seed-item--used game-item--used': seed.used,
              'seed-item--dragging game-item--dragging': dragging?.id === seed.id && dragStarted,
            }"
            :style="dragging?.id === seed.id && dragStarted ? dragStyle : {}"
            @pointerdown.prevent="onPointerDown(seed, $event)"
          >
            <span class="seed-item__emoji">🌳</span>
          </div>
        </div>
        <div class="seed-tray__hint">{{ dragging ? '⬆ Suelta en un buen lugar' : '👆 Arrastra un árbol a la calle' }}</div>
      </div>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

const emit = defineEmits<{ complete: [] }>()
const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface PlantSlot {
  id: string
  label: string
  emoji: string
  isValid: boolean
  x: number
  y: number
  planted: boolean
  wrongAttempt: boolean
  reason: string
}

interface Seed {
  id: string
  used: boolean
}

const slotsData: PlantSlot[] = [
  { id: 'p1', label: 'Junto a banca', emoji: '🪑', isValid: true, x: 15, y: 55, planted: false, wrongAttempt: false, reason: '¡Perfecto! Dará sombra a la banca.' },
  { id: 'p2', label: 'Banqueta', emoji: '🚶', isValid: true, x: 45, y: 40, planted: false, wrongAttempt: false, reason: '¡Los peatones tendrán sombra!' },
  { id: 'p3', label: 'Frente a casa', emoji: '🏠', isValid: true, x: 70, y: 30, planted: false, wrongAttempt: false, reason: '¡Bajará el calor en la fachada!' },
  { id: 'p4', label: 'Esquina', emoji: '📍', isValid: true, x: 30, y: 70, planted: false, wrongAttempt: false, reason: '¡Excelente punto de sombra urbana!' },
  { id: 'p5', label: 'Sobre tubería', emoji: '🔧', isValid: false, x: 55, y: 65, planted: false, wrongAttempt: false, reason: 'Las raíces podrían dañar la tubería.' },
  { id: 'p6', label: 'Cable eléctrico', emoji: '⚡', isValid: false, x: 80, y: 20, planted: false, wrongAttempt: false, reason: 'Hay cables eléctricos cerca. No es seguro.' },
  { id: 'p7', label: 'Entrada garage', emoji: '🚗', isValid: false, x: 20, y: 25, planted: false, wrongAttempt: false, reason: 'Bloquearía la entrada del garage.' },
]

const plantSlots = ref<PlantSlot[]>([])
const seeds = ref<Seed[]>([])
const treesPlanted = ref(0)
const seedsRemaining = computed(() => seeds.value.filter(s => !s.used).length)
const isComplete = computed(() => treesPlanted.value >= 4)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

// Drag state
const dragging = ref<Seed | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const dragStarted = ref(false)
let rafPending = false
const hoveredSlot = ref<string | null>(null)

const dragStyle = computed(() => ({
  position: 'fixed' as const,
  left: (dragPos.value.x - 32) + 'px',
  top: (dragPos.value.y - 32) + 'px',
  zIndex: 200,
}))

function onStart() {
  plantSlots.value = slotsData.map(s => ({ ...s }))
  seeds.value = Array.from({ length: 6 }, (_, i) => ({ id: `seed-${i}`, used: false }))
  treesPlanted.value = 0
}

// --- Drag handlers ---
function onPointerDown(seed: Seed, e: PointerEvent) {
  if (seed.used) return
  dragging.value = seed
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

  // Detect hovered slot
  const els = document.elementsFromPoint(dragPos.value.x, dragPos.value.y)
  let foundSlot: string | null = null
  for (const el of els) {
    const slotEl = (el as HTMLElement).closest('[data-slot]') as HTMLElement | null
    if (slotEl) { foundSlot = slotEl.dataset.slot ?? null; break }
  }
  hoveredSlot.value = foundSlot
  })
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return

  if (dragStarted.value) {
    const els = document.elementsFromPoint(e.clientX, e.clientY)
    let targetSlotId: string | null = null
    for (const el of els) {
      const slotEl = (el as HTMLElement).closest('[data-slot]') as HTMLElement | null
      if (slotEl) { targetSlotId = slotEl.dataset.slot ?? null; break }
    }

    if (targetSlotId) {
      tryPlant(dragging.value, targetSlotId)
    }
  }

  dragging.value = null
  dragStarted.value = false
  hoveredSlot.value = null
}

function tryPlant(seed: Seed, slotId: string) {
  const slot = plantSlots.value.find(s => s.id === slotId)
  if (!slot || slot.planted) return

  seed.used = true

  if (slot.isValid) {
    slot.planted = true
    treesPlanted.value++
    showFB(slot.reason, true)

    nextTick(() => {
      const planted = document.querySelector(`[data-slot="${slot.id}"] .planted-tree`)
      if (planted) celebrateSuccess(planted)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.planter-game')
      if (gameEl) confettiBurst(gameEl, 20)
      setTimeout(() => { showResult.value = true }, 800)
    }
  } else {
    slot.wrongAttempt = true
    showFB(slot.reason, false)

    nextTick(() => {
      const slotEl = document.querySelector(`[data-slot="${slot.id}"]`)
      if (slotEl) shakeWrong(slotEl)
    })
    setTimeout(() => { slot.wrongAttempt = false }, 1000)

    if (seedsRemaining.value <= 0 && !isComplete.value) {
      setTimeout(() => { showResult.value = true }, 1000)
    }
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  plantSlots.value = slotsData.map(s => ({ ...s }))
  seeds.value = Array.from({ length: 6 }, (_, i) => ({ id: `seed-${i}`, used: false }))
  treesPlanted.value = 0
  showResult.value = false
  dragging.value = null
  dragStarted.value = false
}
</script>

<style scoped>
.planter-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  touch-action: none;
}

.street-grid {
  flex: 1;
  position: relative;
  z-index: 5;
}

.plant-slot {
  position: absolute;
  width: 75px;
  height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 3px dashed rgba(45,106,79,0.4);
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.6);
  transition: all 200ms var(--ease-spring);
  transform: translate(-50%, -50%);
}

/* highlight handled by .game-zone--highlight */

.plant-slot--hover {
  transform: translate(-50%, -50%) scale(1.12);
  border-color: var(--color-yellow);
  background: rgba(251,191,36,0.25);
  box-shadow: 0 0 16px rgba(251,191,36,0.4);
  animation: none;
}

.plant-slot--planted {
  border: none;
  background: rgba(82,183,136,0.2);
  cursor: default;
  animation: none;
}

.plant-slot--wrong {
  border-color: var(--color-coral);
  background: rgba(249,65,68,0.15);
}

.slot-icon { font-size: 22px; }
.slot-label { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; }

.planted-tree {
  font-size: 36px;
  animation: scaleIn 0.5s ease;
}

.shade-circle {
  position: absolute;
  bottom: -5px;
  width: 50px;
  height: 20px;
  background: rgba(45,106,79,0.2);
  border-radius: 50%;
}

/* Seed tray */
.seed-tray {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.80);
  position: relative;
  z-index: 10;
  border-top: 3px solid rgba(0,0,0,0.08);
}

.seed-tray__info {
  font-weight: 800;
  font-size: 13px;
  color: var(--color-green-dark);
  white-space: nowrap;
}

.seed-tray__items {
  display: flex;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

.seed-tray__hint {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.seed-item {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid var(--color-green-mid);
  border-radius: var(--radius-md);
  cursor: grab;
  touch-action: none;
  transition: transform 150ms var(--ease-spring), opacity 200ms;
  user-select: none;
  -webkit-user-select: none;
}

.seed-item:active { cursor: grabbing; }

.seed-item--used {
  opacity: 0.2;
  pointer-events: none;
  transform: scale(0.8);
}

/* dragging styles handled by .game-item--dragging */

.seed-item__emoji { font-size: 24px; }

/* Feedback */
/* feedback positioning handled by .game-feedback global class */


.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
