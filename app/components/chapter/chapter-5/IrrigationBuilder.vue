<template>
  <MinigameShell
    title="Instalar riego"
    description="Arrastra las piezas de tubería para conectar el captador de lluvia con las plantas."
    :completed="piecesPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    :time-limit="90"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="irrigation-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <!-- Background -->
      <SceneSky variant="nice" />
      <SceneStreet variant="normal" />

      <!-- Hint -->
      <div class="irrigation-hint" :class="{ 'hint--active': !!dragging }">
        {{ dragging ? 'Lleva la pieza al punto de conexión' : 'Arrastra una pieza de abajo a su lugar' }}
      </div>

      <!-- Pipe route area -->
      <div class="pipe-route">
        <!-- SVG pipe connections -->
        <svg class="pipe-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <!-- Segment 1: rain collector → slot 1 -->
          <line x1="5" y1="20" x2="18" y2="20" :class="segmentClass(0)" />
          <!-- Segment 2: slot 1 → slot 2 -->
          <line x1="18" y1="20" x2="35" y2="35" :class="segmentClass(1)" />
          <!-- Segment 3: slot 2 → slot 3 -->
          <line x1="35" y1="35" x2="50" y2="50" :class="segmentClass(2)" />
          <!-- Segment 4: slot 3 → slot 4 -->
          <line x1="50" y1="50" x2="65" y2="40" :class="segmentClass(3)" />
          <!-- Segment 5: slot 4 → slot 5 -->
          <line x1="65" y1="40" x2="80" y2="55" :class="segmentClass(4)" />
          <!-- Segment 6: slot 5 → plants -->
          <line x1="80" y1="55" x2="95" y2="55" :class="segmentClass(5)" />
        </svg>

        <!-- Rain collector icon -->
        <div class="route-icon route-icon--start" style="left: 2%; top: 14%;">
          <span>🌧️</span>
          <span class="route-icon__label">Captador</span>
        </div>

        <!-- Plants icon -->
        <div class="route-icon route-icon--end" style="right: 1%; top: 48%;">
          <span>🌿</span>
          <span class="route-icon__label">Plantas</span>
        </div>

        <!-- Water drips from unfixed slots -->
        <div
          v-for="slot in slots"
          :key="'drip-' + slot.id"
          class="water-drip"
          :class="{ 'water-drip--hidden': slot.filled }"
          :style="{ left: slot.x + '%', top: (slot.y + 6) + '%' }"
        >
          <span class="drip-drop">💧</span>
          <span class="drip-drop drip-drop--2">💧</span>
        </div>

        <!-- Slots (drop targets) -->
        <div
          v-for="slot in slots"
          :key="slot.id"
          class="pipe-slot"
          :class="{
            'pipe-slot--empty': !slot.filled,
            'pipe-slot--filled': slot.filled,
            'pipe-slot--hover': hoveredSlot === slot.id,
          }"
          :style="{ left: slot.x + '%', top: slot.y + '%' }"
          :data-slot="slot.id"
        >
          <template v-if="slot.filled">
            <span class="slot-emoji">{{ slot.placedEmoji }}</span>
          </template>
          <template v-else>
            <span class="slot-placeholder">?</span>
          </template>
        </div>

        <!-- Water flow animation when complete -->
        <Transition name="fade">
          <div v-if="isComplete" class="water-flow-overlay">
            <div class="water-flow-pulse" />
          </div>
        </Transition>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="pipe-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Draggable pieces tray -->
      <div class="pieces-tray">
        <div class="tray-label">Piezas de riego:</div>
        <div class="pieces-row">
          <div
            v-for="piece in pieces"
            :key="piece.id"
            class="piece-item"
            :class="{
              'piece-item--used': piece.used,
              'piece-item--dragging': dragging?.id === piece.id,
            }"
            :style="pieceStyle(piece)"
            @pointerdown.prevent="onPointerDown(piece, $event)"
          >
            <span class="piece-emoji">{{ piece.emoji }}</span>
            <span class="piece-name">{{ piece.name }}</span>
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

interface PipeSlot {
  id: string
  accepts: string
  x: number
  y: number
  filled: boolean
  placedEmoji: string | null
  successMsg: string
}

interface PipePiece {
  id: string
  name: string
  emoji: string
  type: string
  used: boolean
  isWrong: boolean
  wrongMsg: string
}

const slotsData: PipeSlot[] = [
  { id: 's1', accepts: 'filter', x: 18, y: 20, filled: false, placedEmoji: null, successMsg: '¡Filtro instalado! Limpia el agua de lluvia antes de que llegue a las plantas.' },
  { id: 's2', accepts: 'elbow', x: 35, y: 35, filled: false, placedEmoji: null, successMsg: '¡Codo conectado! El agua cambia de dirección sin perder presión.' },
  { id: 's3', accepts: 'valve', x: 50, y: 50, filled: false, placedEmoji: null, successMsg: '¡Válvula colocada! Controla cuánta agua pasa a las plantas.' },
  { id: 's4', accepts: 'straight', x: 65, y: 40, filled: false, placedEmoji: null, successMsg: '¡Tubo recto en su lugar! El agua fluye directo.' },
  { id: 's5', accepts: 'splitter', x: 80, y: 55, filled: false, placedEmoji: null, successMsg: '¡Divisor instalado! Distribuye el agua a todas las jardineras.' },
]

const piecesData: PipePiece[] = [
  { id: 'p1', name: 'Filtro', emoji: '🔵', type: 'filter', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p2', name: 'Codo', emoji: '🔧', type: 'elbow', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p3', name: 'Válvula', emoji: '🔴', type: 'valve', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p4', name: 'Tubo recto', emoji: '📏', type: 'straight', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p5', name: 'Divisor', emoji: '🔀', type: 'splitter', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p6', name: 'Tubo roto', emoji: '❌', type: 'broken', used: false, isWrong: true, wrongMsg: 'Ese tubo está roto. ¡El agua se escaparía!' },
  { id: 'p7', name: 'Manguera vieja', emoji: '🚫', type: 'old-hose', used: false, isWrong: true, wrongMsg: 'Una manguera vieja no sirve para un sistema permanente de riego.' },
]

const slots = ref<PipeSlot[]>([])
const pieces = ref<PipePiece[]>([])
const piecesPlaced = ref(0)
const isComplete = computed(() => piecesPlaced.value >= 5)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

// Drag state
const dragging = ref<PipePiece | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const dragStarted = ref(false)
const hoveredSlot = ref<string | null>(null)

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function onStart() {
  slots.value = slotsData.map(s => ({ ...s }))
  pieces.value = shuffleArray(piecesData.map(p => ({ ...p })))
  piecesPlaced.value = 0
  showResult.value = false
}

// --- Pipe segment class based on placement progress ---
function segmentClass(index: number): string {
  // Segments 0-5: segment i is solid if slot i is filled (for 0-4) or all filled (for 5)
  if (isComplete.value) return 'pipe-line pipe-line--complete'
  if (index <= 4) return slots.value[index]?.filled ? 'pipe-line pipe-line--active' : 'pipe-line pipe-line--dashed'
  // Last segment: solid only if all placed
  return isComplete.value ? 'pipe-line pipe-line--active' : 'pipe-line pipe-line--dashed'
}

// --- Drag handlers ---
function onPointerDown(piece: PipePiece, e: PointerEvent) {
  if (piece.used) return
  dragging.value = piece
  dragStarted.value = false
  dragPos.value = { x: e.clientX, y: e.clientY }
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  dragStarted.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }

  // Detect hovered slot
  const els = document.elementsFromPoint(e.clientX, e.clientY)
  let foundSlot: string | null = null
  for (const el of els) {
    const slotEl = (el as HTMLElement).closest('[data-slot]') as HTMLElement | null
    if (slotEl) {
      foundSlot = slotEl.dataset.slot ?? null
      break
    }
  }
  hoveredSlot.value = foundSlot
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return

  if (dragStarted.value) {
    // Check drop target using elementsFromPoint
    const els = document.elementsFromPoint(e.clientX, e.clientY)
    let targetSlotId: string | null = null
    for (const el of els) {
      const slotEl = (el as HTMLElement).closest('[data-slot]') as HTMLElement | null
      if (slotEl) {
        targetSlotId = slotEl.dataset.slot ?? null
        break
      }
    }

    if (targetSlotId) {
      tryPlace(dragging.value, targetSlotId)
    }
  }

  dragging.value = null
  dragStarted.value = false
  hoveredSlot.value = null
}

function tryPlace(piece: PipePiece, slotId: string) {
  const slot = slots.value.find(s => s.id === slotId)
  if (!slot || slot.filled) return

  // Wrong pieces always fail
  if (piece.isWrong) {
    showFB(piece.wrongMsg, false)
    nextTick(() => {
      const slotEl = document.querySelector(`[data-slot="${slotId}"]`)
      if (slotEl) shakeWrong(slotEl)
    })
    return
  }

  // Check if piece type matches slot
  if (piece.type === slot.accepts) {
    slot.filled = true
    slot.placedEmoji = piece.emoji
    piece.used = true
    piecesPlaced.value++
    showFB(slot.successMsg, true)

    nextTick(() => {
      const slotEl = document.querySelector(`[data-slot="${slotId}"]`)
      if (slotEl) celebrateSuccess(slotEl)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.irrigation-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 800)
    }
  } else {
    showFB('Esa pieza no encaja aquí. Piensa en el camino del agua.', false)
    nextTick(() => {
      const slotEl = document.querySelector(`[data-slot="${slotId}"]`)
      if (slotEl) shakeWrong(slotEl)
    })
  }
}

function pieceStyle(piece: PipePiece) {
  if (dragging.value?.id === piece.id && dragStarted.value) {
    return {
      position: 'fixed' as const,
      left: (dragPos.value.x - 35) + 'px',
      top: (dragPos.value.y - 35) + 'px',
      zIndex: 200,
    }
  }
  return {}
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 1800)
}

function onTimeout() {
  showResult.value = true
}

function resetGame() {
  slots.value = slotsData.map(s => ({ ...s }))
  pieces.value = shuffleArray(piecesData.map(p => ({ ...p })))
  piecesPlaced.value = 0
  showResult.value = false
  dragging.value = null
  dragStarted.value = false
  hoveredSlot.value = null
  feedback.value = null
}
</script>

<style scoped>
.irrigation-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  touch-action: none;
}

/* --- Hint --- */
.irrigation-hint {
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

.hint--active {
  background: #dcfce7;
  border: 2px solid #22c55e;
}

/* --- Route icons --- */
.route-icon {
  position: absolute;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 28px;
  pointer-events: none;
}

.route-icon__label {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-text);
  background: rgba(255,255,255,0.9);
  padding: 1px 6px;
  border-radius: 6px;
}

/* --- Pipe route area --- */
.pipe-route {
  flex: 1;
  position: relative;
  z-index: 5;
  padding: 40px 10px 10px;
}

/* --- SVG pipe lines --- */
.pipe-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.pipe-line {
  stroke-width: 3;
  fill: none;
  transition: all 400ms ease;
}

.pipe-line--dashed {
  stroke: rgba(107, 114, 128, 0.5);
  stroke-dasharray: 4 3;
}

.pipe-line--active {
  stroke: #22c55e;
  stroke-width: 4;
  stroke-dasharray: none;
  filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.4));
}

.pipe-line--complete {
  stroke: #22c55e;
  stroke-width: 5;
  stroke-dasharray: none;
  filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6));
  animation: pipeGlow 1.5s ease-in-out infinite alternate;
}

@keyframes pipeGlow {
  from { filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.4)); }
  to { filter: drop-shadow(0 0 14px rgba(34, 197, 94, 0.8)); }
}

/* --- Water drips --- */
.water-drip {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  transition: opacity 400ms ease;
}

.water-drip--hidden {
  opacity: 0;
}

.drip-drop {
  font-size: 14px;
  display: inline-block;
  animation: dripFall 1.2s ease-in infinite;
}

.drip-drop--2 {
  animation-delay: 0.5s;
  margin-left: 4px;
}

@keyframes dripFall {
  0% { transform: translateY(0); opacity: 1; }
  80% { opacity: 0.6; }
  100% { transform: translateY(24px); opacity: 0; }
}

/* --- Pipe slots (drop targets) --- */
.pipe-slot {
  position: absolute;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  z-index: 5;
  transform: translate(-50%, -50%);
  transition: all 250ms var(--ease-spring);
}

.pipe-slot--empty {
  border: 3px dashed rgba(34, 197, 94, 0.6);
  background: rgba(220, 252, 231, 0.6);
  cursor: default;
  animation: slotPulse 2s ease-in-out infinite;
}

.pipe-slot--filled {
  border: 3px solid #22c55e;
  background: rgba(220, 252, 231, 0.8);
  cursor: default;
  animation: none;
}

.pipe-slot--hover {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.25);
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
  animation: none;
}

@keyframes slotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.2); }
  50% { box-shadow: 0 0 12px 4px rgba(34, 197, 94, 0.3); }
}

.slot-placeholder {
  font-size: 28px;
  font-weight: 900;
  color: rgba(34, 197, 94, 0.5);
}

.slot-emoji {
  font-size: 32px;
  animation: scaleIn 0.4s var(--ease-spring);
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* --- Water flow when complete --- */
.water-flow-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.water-flow-pulse {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(34, 197, 94, 0.08) 0%, transparent 70%);
  animation: waterPulse 2s ease-in-out infinite;
}

@keyframes waterPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

/* --- Feedback --- */
.pipe-feedback {
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
  max-width: 300px;
}

.fb--ok {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.fb--no {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

/* --- Pieces tray --- */
.pieces-tray {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: relative;
  z-index: 10;
  border-top: 3px solid rgba(0, 0, 0, 0.08);
}

.tray-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.pieces-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.piece-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 10px 6px;
  background: white;
  border: 3px solid #22c55e;
  border-radius: var(--radius-md);
  cursor: grab;
  touch-action: none;
  transition: transform 150ms var(--ease-spring), box-shadow 150ms ease, border-color 150ms ease;
  z-index: 6;
  box-shadow: var(--shadow-md);
  min-width: 70px;
  min-height: 70px;
}

.piece-item:active {
  cursor: grabbing;
}

.piece-item--used {
  opacity: 0.25;
  cursor: not-allowed;
  pointer-events: none;
  filter: grayscale(0.5);
}

.piece-item--dragging {
  transform: scale(1.15) rotate(-3deg);
  box-shadow: var(--shadow-xl);
  border-color: #8b5cf6;
  background: #f5f3ff;
  z-index: 200;
  pointer-events: none;
  animation: none;
}

.piece-emoji {
  font-size: 28px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

.piece-name {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  text-align: center;
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

@keyframes popIn {
  from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
</style>
