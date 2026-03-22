<template>
  <MinigameShell
    title="Reactivar el parque"
    description="Arrastra cada elemento al lugar correcto para restaurar el parque."
    :completed="itemsPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="park-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <!-- Background -->
      <SceneSky :variant="transformLevel >= 4 ? 'nice' : 'hot'" />
      <SceneStreet :variant="transformLevel >= 4 ? 'clean' : 'dirty'" />

      <!-- Drop zones -->
      <div class="scene-area" :class="{ 'scene--transformed': transformLevel >= 4 }">
        <div
          v-for="zone in zones"
          :key="zone.id"
          class="drop-zone game-zone"
          :class="{
            'drop-zone--filled game-zone--filled': zone.filled,
            'drop-zone--highlight game-zone--highlight': !!dragging && !zone.filled,
            'drop-zone--hover game-zone--hover': hoveredZone === zone.id && !zone.filled,
          }"
          :style="{ left: zone.x, top: zone.y }"
          :data-zone="zone.id"
        >
          <template v-if="zone.filled">
            <span class="placed-emoji">{{ zone.placedEmoji }}</span>
          </template>
          <template v-else>
            <span class="zone-placeholder">&#11036;</span>
            <span class="zone-label">{{ zone.label }}</span>
          </template>
        </div>

        <!-- Visual improvements that appear as items are placed -->
        <Transition name="fade">
          <div v-if="transformLevel >= 2" class="visual-improvement improvement-1">
            &#127800;
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 3" class="visual-improvement improvement-2">
            &#129419;
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 5" class="visual-improvement improvement-3">
            &#128104;&#8205;&#128105;&#8205;&#128103;
          </div>
        </Transition>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div
          v-if="feedback"
          class="park-feedback game-feedback"
          :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'"
        >
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Draggable items tray -->
      <div class="items-tray game-tray">
        <div class="tray-title game-tray__title">Elementos disponibles:</div>
        <div class="items-row">
          <div
            v-for="item in items"
            :key="item.id"
            class="drag-item game-item"
            :class="{
              'drag-item--used game-item--used': item.used,
              'drag-item--dragging game-item--dragging': dragging?.id === item.id && dragStarted,
            }"
            :style="dragging?.id === item.id && dragStarted ? dragStyle : {}"
            @pointerdown.prevent="onPointerDown(item, $event)"
          >
            <span class="drag-item__emoji game-item__emoji">{{ item.emoji }}</span>
            <span class="drag-item__name game-item__label">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

const emit = defineEmits<{
  complete: []
}>()

const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface DropZone {
  id: string
  label: string
  accepts: string
  x: string
  y: string
  filled: boolean
  placedEmoji: string | null
  successMessage: string
}

interface DragItem {
  id: string
  name: string
  emoji: string
  type: string
  used: boolean
}

const zonesData: DropZone[] = [
  { id: 'z1', label: 'Banca', accepts: 'bench', x: '15%', y: '50%', filled: false, placedEmoji: null, successMessage: '!Banca pintada y lista!' },
  { id: 'z2', label: 'Bote', accepts: 'bin', x: '50%', y: '35%', filled: false, placedEmoji: null, successMessage: '!Bote clasificador instalado!' },
  { id: 'z3', label: 'Letrero', accepts: 'sign', x: '75%', y: '25%', filled: false, placedEmoji: null, successMessage: 'Letrero de cuidado colocado.' },
  { id: 'z4', label: 'Columpio', accepts: 'swing', x: '35%', y: '60%', filled: false, placedEmoji: null, successMessage: '!Columpio arreglado!' },
  { id: 'z5', label: 'Lectura', accepts: 'reading', x: '65%', y: '55%', filled: false, placedEmoji: null, successMessage: '!Rincon de lectura listo!' },
]

const itemsData: DragItem[] = [
  { id: 'i1', name: 'Banca pintada', emoji: '\u{1FA91}', type: 'bench', used: false },
  { id: 'i2', name: 'Bote clasificador', emoji: '\u{1F5D1}\uFE0F', type: 'bin', used: false },
  { id: 'i3', name: 'Letrero', emoji: '\u{1FAA7}', type: 'sign', used: false },
  { id: 'i4', name: 'Columpio', emoji: '\u{1F3A0}', type: 'swing', used: false },
  { id: 'i5', name: 'Rincon de lectura', emoji: '\u{1F4DA}', type: 'reading', used: false },
]

const zones = ref<DropZone[]>([])
const items = ref<DragItem[]>([])
const itemsPlaced = ref(0)
const transformLevel = ref(0)
const isComplete = computed(() => itemsPlaced.value >= 5)
const showResult = ref(false)

// Drag state
const dragging = ref<DragItem | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const dragStarted = ref(false)
let rafPending = false
const hoveredZone = ref<string | null>(null)

const dragStyle = computed(() => ({
  position: 'fixed' as const,
  left: (dragPos.value.x - 32) + 'px',
  top: (dragPos.value.y - 32) + 'px',
  zIndex: 100,
}))

// Feedback
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function onStart() {
  zones.value = zonesData.map(z => ({ ...z }))
  items.value = itemsData.map(i => ({ ...i }))
  itemsPlaced.value = 0
  transformLevel.value = 0
}

// --- Pointer / drag handlers ---
function onPointerDown(item: DragItem, e: PointerEvent) {
  if (item.used) return
  dragging.value = item
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

  // Detect which zone is being hovered
  const els = document.elementsFromPoint(dragPos.value.x, dragPos.value.y)
  let foundZone: string | null = null
  for (const el of els) {
    const zoneEl = (el as HTMLElement).closest('[data-zone]') as HTMLElement | null
    if (zoneEl) {
      foundZone = zoneEl.dataset.zone ?? null
      break
    }
  }
  hoveredZone.value = foundZone
  })
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return

  if (dragStarted.value) {
    // Find zone under pointer using elementsFromPoint
    const els = document.elementsFromPoint(e.clientX, e.clientY)
    let targetZoneId: string | null = null
    for (const el of els) {
      const zoneEl = (el as HTMLElement).closest('[data-zone]') as HTMLElement | null
      if (zoneEl) {
        targetZoneId = zoneEl.dataset.zone ?? null
        break
      }
    }

    if (targetZoneId) {
      attemptPlace(dragging.value, targetZoneId)
    }
  }

  dragging.value = null
  dragStarted.value = false
  hoveredZone.value = null
}

function attemptPlace(item: DragItem, zoneId: string) {
  const zone = zones.value.find(z => z.id === zoneId)
  if (!zone || zone.filled) return

  if (item.type === zone.accepts) {
    // Correct placement
    zone.filled = true
    zone.placedEmoji = item.emoji
    item.used = true
    itemsPlaced.value++
    transformLevel.value++
    showFB(zone.successMessage, true)

    nextTick(() => {
      const zoneEl = document.querySelector(`[data-zone="${zone.id}"] .placed-emoji`)
      if (zoneEl) celebrateSuccess(zoneEl)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.park-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    // Wrong placement — shake zone, item returns to tray
    showFB('Ese elemento no corresponde a esta zona. 💡 Fíjate en lo que dice cada zona: ¿qué falta ahí?', false)
    const zoneEl = document.querySelector(`[data-zone="${zoneId}"]`)
    if (zoneEl) shakeWrong(zoneEl)
  }
}

function resetGame() {
  zones.value = zonesData.map(z => ({ ...z }))
  items.value = itemsData.map(i => ({ ...i }))
  itemsPlaced.value = 0
  transformLevel.value = 0
  dragging.value = null
  dragStarted.value = false
  hoveredZone.value = null
  showResult.value = false
  feedback.value = null
}
</script>

<style scoped>
.park-game {
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

/* --- Drop zones --- */
.drop-zone {
  position: absolute;
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 2px dashed rgba(0, 0, 0, 0.35);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.7);
  cursor: default;
  transition: all var(--transition-fast);
  transform: translate(-50%, -50%);
}

.drop-zone--highlight {
  border-color: var(--color-green-mid);
  background: rgba(82, 183, 136, 0.2);
  animation: pulse 1s infinite;
}

.drop-zone--hover {
  border-color: var(--color-yellow);
  background: rgba(251, 191, 36, 0.3);
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.5);
  animation: none;
}

.drop-zone--filled {
  border: none;
  background: none;
  cursor: default;
  animation: none;
}

.zone-placeholder {
  font-size: 24px;
  opacity: 0.5;
}

.zone-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text);
}

.placed-emoji {
  font-size: 36px;
  animation: scaleIn 0.5s ease;
}

/* --- Visual improvements --- */
.visual-improvement {
  position: absolute;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
  pointer-events: none;
}

.improvement-1 {
  right: 15%;
  top: 40%;
}

.improvement-2 {
  left: 40%;
  top: 15%;
  animation-delay: 1s;
}

.improvement-3 {
  right: 25%;
  bottom: 25%;
  animation-delay: 0.5s;
}

/* --- Items tray --- */
.items-tray {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 5;
  border-top: 3px solid rgba(0, 0, 0, 0.08);
}

.tray-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.items-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

/* --- Draggable items --- */
.drag-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: white;
  border: 2px solid var(--color-green-mid);
  border-radius: var(--radius-md);
  cursor: grab;
  touch-action: none;
  transition: transform 150ms var(--ease-spring), box-shadow 150ms ease, border-color 150ms ease;
  box-shadow: var(--shadow-md);
  min-width: 62px;
  user-select: none;
  -webkit-user-select: none;
}

.drag-item:active {
  cursor: grabbing;
}

.drag-item--used {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

/* dragging styles handled by .game-item--dragging */

.drag-item__emoji {
  font-size: 24px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

.drag-item__name {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  text-align: center;
  max-width: 70px;
}

/* --- Feedback --- */
.park-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 14px;
  z-index: 50;
  animation: scaleIn 0.3s ease;
  text-align: center;
  max-width: 280px;
  box-shadow: var(--shadow-lg);
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
