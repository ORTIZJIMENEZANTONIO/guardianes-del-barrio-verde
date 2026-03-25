<template>
  <MinigameShell
    title="Inaugurar el festival"
    mascot-character-id="lila"
    description="Arrastra cada elemento a su lugar para la gran inauguracion."
    :completed="itemsPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="inaug-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <!-- Background -->
      <SceneSky variant="sunset" />
      <SceneStreet variant="clean" />

      <!-- Drop zones -->
      <div class="scene-area">
        <div
          v-for="zone in zones"
          :key="zone.id"
          class="drop-zone game-zone"
          :class="{
            'drop-zone--filled game-zone--filled': zone.filled,
            'drop-zone--highlight game-zone--highlight': (!!dragging || !!selectedItem) && !zone.filled,
            'drop-zone--hover game-zone--hover': hoveredZone === zone.id && !zone.filled,
          }"
          :style="{ left: zone.x, top: zone.y }"
          :data-zone="zone.id"
          @click="onZoneClick(zone)"
        >
          <template v-if="zone.filled">
            <span class="placed-emoji game-zone__placed">{{ zone.placedEmoji }}</span>
          </template>
          <template v-else>
            <span class="zone-placeholder game-zone__icon">✨</span>
            <span class="zone-label game-zone__label">{{ zone.label }}</span>
          </template>
        </div>

        <!-- Visual improvements -->
        <Transition name="fade">
          <div v-if="transformLevel >= 2" class="visual-improvement" style="right: 12%; top: 30%;">🎈</div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 3" class="visual-improvement" style="left: 20%; top: 18%; animation-delay: 0.8s;">🎶</div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 5" class="visual-improvement" style="right: 25%; bottom: 20%; animation-delay: 0.4s;">🎊</div>
        </Transition>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div
          v-if="feedback"
          class="inaug-feedback game-feedback"
          :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'"
        >
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Draggable items tray -->
      <div class="items-tray game-tray">
        <div class="tray-title game-tray__title">Elementos de inauguracion:</div>
        <div class="items-row">
          <div
            v-for="item in items"
            :key="item.id"
            class="drag-item game-item"
            :class="{
              'drag-item--used game-item--used': item.used,
              'drag-item--dragging game-item--dragging': dragging?.id === item.id && dragStarted,
              'drag-item--selected game-item--selected': selectedItem?.id === item.id,
            }"
            :style="dragging?.id === item.id && dragStarted ? dragStyle : {}"
            @pointerdown.prevent="onPointerDown(item, $event)"
            @click="onItemClick(item)"
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
  { id: 'z1', label: 'Pancarta', accepts: 'banner', x: '40%', y: '12%', filled: false, placedEmoji: null,
    successMessage: 'La pancarta del festival da la bienvenida a todos!' },
  { id: 'z2', label: 'Guirnaldas', accepts: 'garlands', x: '15%', y: '30%', filled: false, placedEmoji: null,
    successMessage: 'Guirnaldas de papel reciclado. Bonitas y sustentables!' },
  { id: 'z3', label: 'Antorcha', accepts: 'torch', x: '70%', y: '40%', filled: false, placedEmoji: null,
    successMessage: 'La antorcha solar ilumina sin gastar electricidad.' },
  { id: 'z4', label: 'Mesa firmas', accepts: 'table', x: '50%', y: '58%', filled: false, placedEmoji: null,
    successMessage: 'La mesa de firmas del compromiso verde. Cada firma es una promesa.' },
  { id: 'z5', label: 'Altavoz', accepts: 'speaker', x: '25%', y: '55%', filled: false, placedEmoji: null,
    successMessage: 'El altavoz esta listo para el discurso de inauguracion!' },
]

const itemsData: DragItem[] = [
  { id: 'i1', name: 'Pancarta', emoji: '🪧', type: 'banner', used: false },
  { id: 'i2', name: 'Guirnaldas', emoji: '🎀', type: 'garlands', used: false },
  { id: 'i3', name: 'Antorcha solar', emoji: '🔆', type: 'torch', used: false },
  { id: 'i4', name: 'Mesa de firmas', emoji: '📋', type: 'table', used: false },
  { id: 'i5', name: 'Altavoz', emoji: '📢', type: 'speaker', used: false },
]

const zones = ref<DropZone[]>([])
const items = ref<DragItem[]>([])
const itemsPlaced = ref(0)
const transformLevel = ref(0)
const isComplete = computed(() => itemsPlaced.value >= 5)
const showResult = ref(false)

// Click/tap selection state
const selectedItem = ref<DragItem | null>(null)

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

// --- Click/tap handlers ---
function onItemClick(item: DragItem) {
  if (dragStarted.value || item.used) return
  selectedItem.value = selectedItem.value?.id === item.id ? null : item
}

function onZoneClick(zone: DropZone) {
  if (dragStarted.value || zone.filled || !selectedItem.value) return
  const item = selectedItem.value
  selectedItem.value = null
  attemptPlace(item, zone.id)
}

function attemptPlace(item: DragItem, zoneId: string) {
  const zone = zones.value.find(z => z.id === zoneId)
  if (!zone || zone.filled) return

  if (item.type === zone.accepts) {
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
      const gameEl = document.querySelector('.inaug-game')
      if (gameEl) confettiBurst(gameEl, 30)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    showFB('Ese elemento no corresponde a esta zona. 💡 Observa dónde quedaría mejor para la inauguración.', false)
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
  selectedItem.value = null
  showResult.value = false
  feedback.value = null
}
</script>

<style scoped>
.inaug-game {
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
  border: 2px dashed rgba(139,92,246,0.5);
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.7);
  cursor: default;
  transition: all var(--transition-fast);
  transform: translate(-50%, -50%);
}

.drop-zone--highlight {
  border-color: #8b5cf6;
  background: rgba(139,92,246,0.2);
  animation: pulse 1s infinite;
}

.drop-zone--hover {
  border-color: var(--color-yellow);
  background: rgba(251,191,36,0.3);
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 0 16px rgba(251,191,36,0.5);
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

/* --- Items tray --- */
.items-tray {
  padding: 12px 16px;
  background: rgba(255,255,255,0.80);
  position: relative;
  z-index: 5;
  border-top: 3px solid rgba(0,0,0,0.08);
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
  border: 2px solid #8b5cf6;
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

.drag-item--selected {
  border-color: var(--color-yellow);
  background: rgba(251, 191, 36, 0.2);
  transform: scale(1.12);
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
}

.drag-item--used {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

/* dragging styles handled by .game-item--dragging */

.drag-item__emoji {
  font-size: 24px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
}

.drag-item__name {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  text-align: center;
  max-width: 70px;
}

/* feedback handled by global .game-feedback */



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
