<template>
  <MinigameShell
    title="Reparar la fuga"
    description="La tubería del barrio tiene fugas. Selecciona la pieza correcta y toca el hueco para repararla."
    :completed="piecesPlaced"
    :total="5"
    :time-limit="45"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="showResult = true"
  >
    <div class="leak-game">
      <SceneSky variant="nice" />
      <SceneStreet variant="dirty" />

      <!-- Pipe route area -->
      <div class="pipe-area">
        <!-- Source label -->
        <div class="pipe-label pipe-label--source">
          <span class="label-icon">🔵</span>
          <span class="label-text">Llave</span>
        </div>

        <!-- Destination label -->
        <div class="pipe-label pipe-label--dest">
          <span class="label-icon">🏠</span>
          <span class="label-text">Casa</span>
        </div>

        <!-- SVG pipe route -->
        <svg
          class="pipe-svg"
          viewBox="0 0 340 260"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Fixed pipe segments (solid blue) -->
          <!-- Source to gap1 -->
          <line x1="20" y1="40" x2="60" y2="40" class="pipe-segment" />
          <!-- gap1 to turn -->
          <line x1="120" y1="40" x2="165" y2="40" class="pipe-segment" />
          <!-- Turn down to gap2 -->
          <line x1="165" y1="40" x2="165" y2="60" class="pipe-segment" />
          <!-- gap2 to vertical run -->
          <line x1="165" y1="120" x2="165" y2="140" class="pipe-segment" />
          <!-- Horizontal to gap3 (tee) -->
          <line x1="100" y1="140" x2="135" y2="140" class="pipe-segment" />
          <!-- gap3 to right branch -->
          <line x1="195" y1="140" x2="260" y2="140" class="pipe-segment" />
          <!-- Right branch down to gap5 (cap) -->
          <line x1="260" y1="140" x2="260" y2="170" class="pipe-segment" />
          <!-- Left branch up from tee -->
          <line x1="100" y1="140" x2="100" y2="170" class="pipe-segment" />
          <!-- gap4 to destination -->
          <line x1="100" y1="230" x2="100" y2="255" class="pipe-segment" />

          <!-- Gap dashed outlines (red when unfilled) -->
          <!-- Gap 1: straight (horizontal) -->
          <rect
            v-if="!gaps[0].filled"
            x="60" y="28" width="60" height="24" rx="4"
            class="gap-outline"
          />
          <!-- Gap 2: elbow (vertical to horizontal turn) -->
          <rect
            v-if="!gaps[1].filled"
            x="153" y="60" width="24" height="60" rx="4"
            class="gap-outline"
          />
          <!-- Gap 3: tee (junction) -->
          <rect
            v-if="!gaps[2].filled"
            x="135" y="128" width="60" height="24" rx="4"
            class="gap-outline"
          />
          <!-- Gap 4: valve (vertical) -->
          <rect
            v-if="!gaps[3].filled"
            x="88" y="170" width="24" height="60" rx="4"
            class="gap-outline"
          />
          <!-- Gap 5: cap (end piece) -->
          <rect
            v-if="!gaps[4].filled"
            x="248" y="170" width="24" height="40" rx="4"
            class="gap-outline"
          />

          <!-- Filled pipe segments (solid green when placed) -->
          <!-- Gap 1 filled -->
          <line
            v-if="gaps[0].filled"
            x1="60" y1="40" x2="120" y2="40"
            class="pipe-segment pipe-segment--fixed"
          />
          <!-- Gap 2 filled -->
          <line
            v-if="gaps[1].filled"
            x1="165" y1="60" x2="165" y2="120"
            class="pipe-segment pipe-segment--fixed"
          />
          <!-- Gap 3 filled -->
          <g v-if="gaps[2].filled">
            <line x1="135" y1="140" x2="195" y2="140" class="pipe-segment pipe-segment--fixed" />
            <line x1="165" y1="140" x2="165" y2="140" class="pipe-segment pipe-segment--fixed" />
          </g>
          <!-- Gap 4 filled -->
          <line
            v-if="gaps[3].filled"
            x1="100" y1="170" x2="100" y2="230"
            class="pipe-segment pipe-segment--fixed"
          />
          <!-- Gap 5 filled -->
          <line
            v-if="gaps[4].filled"
            x1="260" y1="170" x2="260" y2="210"
            class="pipe-segment pipe-segment--fixed"
          />

          <!-- Pipe joints / connectors (small circles at junctions) -->
          <circle cx="165" cy="40" r="5" class="pipe-joint" />
          <circle cx="165" cy="140" r="5" class="pipe-joint" />
          <circle cx="100" cy="140" r="5" class="pipe-joint" />
          <circle cx="260" cy="140" r="5" class="pipe-joint" />

          <!-- Water flow animation when complete -->
          <template v-if="allFixed">
            <line x1="20" y1="40" x2="165" y2="40" class="water-flow" />
            <line x1="165" y1="40" x2="165" y2="140" class="water-flow water-flow--delay1" />
            <line x1="100" y1="140" x2="165" y2="140" class="water-flow water-flow--delay2" />
            <line x1="100" y1="140" x2="100" y2="255" class="water-flow water-flow--delay3" />
          </template>
        </svg>

        <!-- Clickable gap zones (positioned over SVG) -->
        <button
          v-for="(gap, i) in gaps"
          :key="gap.id"
          class="gap-zone"
          :class="{
            'gap-zone--empty': !gap.filled,
            'gap-zone--filled': gap.filled,
            'gap-zone--highlight': selectedPiece && !gap.filled,
          }"
          :style="gapPositions[i]"
          :data-gap="gap.id"
          :disabled="gap.filled"
          @click="placeInGap(gap)"
        >
          <template v-if="gap.filled">
            <span class="gap-emoji gap-emoji--placed">{{ gap.placedEmoji }}</span>
          </template>
          <template v-else>
            <span class="gap-hint">{{ gap.hintEmoji }}</span>
            <span class="gap-drip drip-1">💧</span>
            <span class="gap-drip drip-2">💧</span>
            <span class="gap-drip drip-3">💧</span>
          </template>
        </button>

      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="leak-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Pieces tray -->
      <div class="pieces-tray">
        <div class="tray-label">Piezas disponibles:</div>
        <div class="pieces-row">
          <button
            v-for="piece in availablePieces"
            :key="piece.id"
            class="piece-btn"
            :class="{
              'piece-btn--selected': selectedPiece?.id === piece.id,
              'piece-btn--used': piece.used,
            }"
            :disabled="piece.used"
            @click="selectPiece(piece)"
          >
            <span class="piece-emoji">{{ piece.emoji }}</span>
            <span class="piece-name">{{ piece.name }}</span>
          </button>
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

interface PipeGap {
  id: string
  needsPiece: string
  hintEmoji: string
  filled: boolean
  placedEmoji: string | null
}

interface PipePiece {
  id: string
  name: string
  emoji: string
  pipeType: string
  used: boolean
}

// Gap data: 5 gaps along the pipe route
const gapsData: PipeGap[] = [
  { id: 'gap1', needsPiece: 'straight', hintEmoji: '━', filled: false, placedEmoji: null },
  { id: 'gap2', needsPiece: 'elbow', hintEmoji: '┗', filled: false, placedEmoji: null },
  { id: 'gap3', needsPiece: 'tee', hintEmoji: '┳', filled: false, placedEmoji: null },
  { id: 'gap4', needsPiece: 'valve', hintEmoji: '┃', filled: false, placedEmoji: null },
  { id: 'gap5', needsPiece: 'cap', hintEmoji: '╹', filled: false, placedEmoji: null },
]

// Position each gap zone over the SVG (in percentage of the pipe-area)
const gapPositions = [
  { left: '17.6%', top: '8.5%', width: '17.6%', height: '12%' },    // gap1: straight horizontal
  { left: '43.5%', top: '19%', width: '10%', height: '26%' },        // gap2: elbow vertical
  { left: '39.7%', top: '47%', width: '17.6%', height: '12%' },      // gap3: tee junction
  { left: '25.3%', top: '62%', width: '10%', height: '26%' },        // gap4: valve vertical
  { left: '72.4%', top: '62%', width: '10%', height: '19%' },        // gap5: cap end
]

const piecesData: PipePiece[] = [
  { id: 'pc1', name: 'Tubo recto', emoji: '🔧', pipeType: 'straight', used: false },
  { id: 'pc2', name: 'Codo', emoji: '↪️', pipeType: 'elbow', used: false },
  { id: 'pc3', name: 'Conector T', emoji: '🔩', pipeType: 'tee', used: false },
  { id: 'pc4', name: 'Válvula', emoji: '🚰', pipeType: 'valve', used: false },
  { id: 'pc5', name: 'Tapón', emoji: '🔴', pipeType: 'cap', used: false },
]

const gaps = ref<PipeGap[]>(gapsData.map(g => ({ ...g })))
const availablePieces = ref<PipePiece[]>(piecesData.map(p => ({ ...p })))
const selectedPiece = ref<PipePiece | null>(null)
const piecesPlaced = ref(0)
const isComplete = computed(() => piecesPlaced.value >= 5)
const allFixed = computed(() => gaps.value.length > 0 && gaps.value.every(g => g.filled))
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function onStart() {
  gaps.value = gapsData.map(g => ({ ...g }))
  availablePieces.value = piecesData.map(p => ({ ...p }))
  piecesPlaced.value = 0
  selectedPiece.value = null
  showResult.value = false
}

function selectPiece(piece: PipePiece) {
  if (piece.used) return
  selectedPiece.value = piece
}

function placeInGap(gap: PipeGap) {
  if (gap.filled) return

  if (!selectedPiece.value) {
    showFB('Necesitas una pieza primero. 💡 Toca una pieza del tray de abajo y luego toca el hueco.', false)
    return
  }

  const piece = selectedPiece.value

  if (piece.pipeType === gap.needsPiece) {
    // Correct placement
    gap.filled = true
    gap.placedEmoji = piece.emoji
    piece.used = true
    piecesPlaced.value++
    selectedPiece.value = null
    showFB('¡Pieza correcta! La fuga se detuvo.', true)

    nextTick(() => {
      const gapEl = document.querySelector(`[data-gap="${gap.id}"]`)
      if (gapEl) celebrateSuccess(gapEl)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.leak-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1200)
    }
  } else {
    // Wrong piece
    showFB('Esa pieza tiene forma diferente al hueco. 💡 Observa: ¿el hueco es recto, curvo o en T?', false)
    nextTick(() => {
      const gapEl = document.querySelector(`[data-gap="${gap.id}"]`)
      if (gapEl) shakeWrong(gapEl)
    })
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 2000)
}

function resetGame() {
  gaps.value = gapsData.map(g => ({ ...g }))
  availablePieces.value = piecesData.map(p => ({ ...p }))
  piecesPlaced.value = 0
  selectedPiece.value = null
  showResult.value = false
}
</script>

<style scoped>
.leak-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* ── Pipe area ── */
.pipe-area {
  flex: 1;
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.pipe-svg {
  width: 100%;
  max-width: 380px;
  height: auto;
  max-height: 100%;
}

/* ── Pipe segments ── */
.pipe-segment {
  stroke: #3b82f6;
  stroke-width: 6;
  stroke-linecap: round;
  fill: none;
}

.pipe-segment--fixed {
  stroke: #22c55e;
  stroke-width: 6;
  filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.5));
}

.pipe-joint {
  fill: #2563eb;
  stroke: #1e40af;
  stroke-width: 1.5;
}

/* ── Gap dashed outlines ── */
.gap-outline {
  fill: rgba(239, 68, 68, 0.08);
  stroke: #ef4444;
  stroke-width: 2;
  stroke-dasharray: 6 4;
  animation: gapPulse 2s ease-in-out infinite;
}

@keyframes gapPulse {
  0%, 100% { stroke-opacity: 0.5; fill-opacity: 0.05; }
  50% { stroke-opacity: 1; fill-opacity: 0.15; }
}

/* ── Water flow animation ── */
.water-flow {
  stroke: #60a5fa;
  stroke-width: 3;
  stroke-linecap: round;
  fill: none;
  stroke-dasharray: 12 8;
  animation: flowAnim 1s linear infinite;
}

.water-flow--delay1 { animation-delay: 0.2s; }
.water-flow--delay2 { animation-delay: 0.4s; }
.water-flow--delay3 { animation-delay: 0.6s; }

@keyframes flowAnim {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -20; }
}

/* ── Clickable gap zones ── */
.gap-zone {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  overflow: visible;
  touch-action: manipulation;
  min-width: 44px;
  min-height: 44px;
}

.gap-zone--empty {
  background: rgba(239, 68, 68, 0.12);
  border: 2.5px dashed #ef4444;
  animation: gapZonePulse 2s ease-in-out infinite;
}

.gap-zone--highlight {
  background: rgba(34, 197, 94, 0.15);
  border-color: #22c55e;
  animation: gapHighlight 0.8s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
}

.gap-zone--filled {
  background: rgba(34, 197, 94, 0.2);
  border: 2px solid #22c55e;
  cursor: default;
  animation: none;
}

@keyframes gapZonePulse {
  0%, 100% { border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.08); }
  50% { border-color: rgba(239, 68, 68, 0.9); background: rgba(239, 68, 68, 0.18); }
}

@keyframes gapHighlight {
  0%, 100% { box-shadow: 0 0 8px rgba(34, 197, 94, 0.2); }
  50% { box-shadow: 0 0 18px rgba(34, 197, 94, 0.5); }
}

.gap-hint {
  font-size: 20px;
  color: rgba(239, 68, 68, 0.5);
  font-weight: 900;
  line-height: 1;
}

.gap-emoji--placed {
  font-size: 24px;
  animation: scaleIn 0.4s ease;
}

/* ── Dripping drops ── */
.gap-drip {
  position: absolute;
  font-size: 10px;
  pointer-events: none;
  animation: dripFall 1.8s ease-in infinite;
  opacity: 0;
}

.drip-1 {
  bottom: -6px;
  left: 30%;
  animation-delay: 0s;
}

.drip-2 {
  bottom: -6px;
  left: 55%;
  animation-delay: 0.6s;
}

.drip-3 {
  bottom: -6px;
  left: 75%;
  animation-delay: 1.2s;
}

@keyframes dripFall {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(20px); opacity: 0; }
}

/* ── Labels ── */
.pipe-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 6;
}

.pipe-label--source {
  left: 1%;
  top: 3%;
}

.pipe-label--dest {
  left: 23%;
  bottom: 0%;
}

.label-icon {
  font-size: 22px;
}

.label-text {
  font-size: 9px;
  font-weight: 800;
  color: #1e3a5f;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.7);
  padding: 1px 6px;
  border-radius: 4px;
}

/* ── Feedback ── */
.leak-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13px;
  z-index: 50;
  animation: scaleIn 0.3s ease;
  text-align: center;
  max-width: 280px;
  box-shadow: var(--shadow-lg);
}

.fb--ok { background: rgba(82, 183, 136, 0.95); color: white; }
.fb--no { background: rgba(249, 65, 68, 0.95); color: white; }

/* ── Pieces tray ── */
.pieces-tray {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 5;
  border-top: 3px solid rgba(0, 0, 0, 0.08);
}

.tray-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 6px;
}

.pieces-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.piece-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 10px;
  background: white;
  border: 2px solid #3b82f6;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-width: 58px;
  cursor: pointer;
}

.piece-btn:active { transform: scale(0.95); }

.piece-btn--selected {
  border-color: #22c55e;
  background: #f0fdf4;
  box-shadow: 0 0 0 2px #22c55e, 0 0 12px rgba(34, 197, 94, 0.3);
  transform: scale(1.05);
}

.piece-btn--used {
  opacity: 0.3;
  cursor: not-allowed;
}

.piece-emoji { font-size: 22px; }
.piece-name { font-size: 9px; font-weight: 700; color: var(--color-text); text-align: center; }

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
