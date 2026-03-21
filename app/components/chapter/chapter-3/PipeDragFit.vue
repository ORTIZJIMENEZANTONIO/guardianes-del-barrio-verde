<template>
  <MinigameShell
    title="Reparar y redirigir"
    description="Arrastra las piezas de tubería al lugar correcto para reparar la fuga."
    :completed="piecesPlaced"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    :time-limit="90"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="pipe-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <!-- Background -->
      <SceneSky variant="nice" />
      <SceneStreet variant="normal" />

      <!-- Hint -->
      <div class="pipe-hint" :class="{ 'hint--active': !!dragging }">
        {{ dragging ? 'Lleva la pieza al hueco correcto' : 'Arrastra una pieza de abajo al hueco' }}
      </div>

      <!-- Pipe route area -->
      <div class="pipe-route">
        <!-- SVG pipe connections -->
        <svg class="pipe-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <!-- Segment 1: start → slot 1 -->
          <line
            x1="5" y1="30" x2="20" y2="30"
            :class="segmentClass(0)"
          />
          <!-- Segment 2: slot 1 → slot 2 -->
          <line
            x1="20" y1="30" x2="40" y2="45"
            :class="segmentClass(1)"
          />
          <!-- Segment 3: slot 2 → slot 3 -->
          <line
            x1="40" y1="45" x2="60" y2="55"
            :class="segmentClass(2)"
          />
          <!-- Segment 4: slot 3 → slot 4 -->
          <line
            x1="60" y1="55" x2="75" y2="40"
            :class="segmentClass(3)"
          />
          <!-- Segment 5: slot 4 → end -->
          <line
            x1="75" y1="40" x2="95" y2="40"
            :class="segmentClass(4)"
          />
        </svg>

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
        <div class="tray-label">Piezas de tubería:</div>
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
  { id: 's1', accepts: 'elbow', x: 20, y: 30, filled: false, placedEmoji: null, successMsg: '!Codo conectado!' },
  { id: 's2', accepts: 'straight', x: 40, y: 45, filled: false, placedEmoji: null, successMsg: 'Tubo recto en su lugar.' },
  { id: 's3', accepts: 'valve', x: 60, y: 55, filled: false, placedEmoji: null, successMsg: '!Valvula colocada!' },
  { id: 's4', accepts: 'connector', x: 75, y: 40, filled: false, placedEmoji: null, successMsg: '!Union reparada!' },
]

const piecesData: PipePiece[] = [
  { id: 'p1', name: 'Codo', emoji: '\uD83D\uDD27', type: 'elbow', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p2', name: 'Tubo recto', emoji: '\uD83D\uDCCF', type: 'straight', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p3', name: 'Tubo roto', emoji: '\u274C', type: 'broken', used: false, isWrong: true, wrongMsg: 'Esa pieza esta rota, no sirve.' },
  { id: 'p4', name: 'Valvula', emoji: '\uD83D\uDD34', type: 'valve', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p5', name: 'Conector', emoji: '\uD83D\uDD17', type: 'connector', used: false, isWrong: false, wrongMsg: '' },
  { id: 'p6', name: 'Tapon', emoji: '\u2B55', type: 'cap', used: false, isWrong: true, wrongMsg: 'Un tapon no resuelve la fuga.' },
]

const slots = ref<PipeSlot[]>([])
const pieces = ref<PipePiece[]>([])
const piecesPlaced = ref(0)
const isComplete = computed(() => piecesPlaced.value >= 4)
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
  // Segments 0-4: segment i is solid if slot i is filled (for 0-3) or all filled (for 4)
  if (isComplete.value) return 'pipe-line pipe-line--complete'
  if (index === 0) return slots.value[0]?.filled ? 'pipe-line pipe-line--active' : 'pipe-line pipe-line--dashed'
  if (index <= 3) return slots.value[index]?.filled ? 'pipe-line pipe-line--active' : 'pipe-line pipe-line--dashed'
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
      const gameEl = document.querySelector('.pipe-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 800)
    }
  } else {
    showFB('Esa pieza no encaja aqui.', false)
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
.pipe-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  touch-action: none;
}

/* --- Hint --- */
.pipe-hint {
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
  background: #dbeafe;
  border: 2px solid #3b82f6;
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
  stroke: #3b82f6;
  stroke-width: 4;
  stroke-dasharray: none;
  filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));
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
  border: 3px dashed rgba(59, 130, 246, 0.6);
  background: rgba(219, 234, 254, 0.6);
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
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.25);
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  animation: none;
}

@keyframes slotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
  50% { box-shadow: 0 0 12px 4px rgba(59, 130, 246, 0.3); }
}

.slot-placeholder {
  font-size: 28px;
  font-weight: 900;
  color: rgba(59, 130, 246, 0.5);
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
  background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
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
  max-width: 280px;
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
  border: 3px solid #3b82f6;
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
</style>
