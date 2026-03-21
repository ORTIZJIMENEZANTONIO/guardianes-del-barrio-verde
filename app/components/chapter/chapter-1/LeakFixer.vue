<template>
  <MinigameShell
    title="Reparar la fuga"
    description="Conecta las piezas de tubería para sellar la fuga. Coloca cada pieza en el lugar correcto."
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
      <!-- Pipe grid -->
      <div class="pipe-grid">
        <div
          v-for="cell in grid"
          :key="cell.id"
          class="pipe-cell"
          :class="{
            'pipe-cell--empty': cell.type === 'empty',
            'pipe-cell--fixed': cell.type === 'fixed',
            'pipe-cell--placed': cell.type === 'placed',
            'pipe-cell--leak': cell.type === 'leak',
          }"
          :data-cell="cell.id"
          @click="placepiece(cell)"
        >
          <span v-if="cell.pipeEmoji" class="pipe-emoji">{{ cell.pipeEmoji }}</span>
          <div v-if="cell.type === 'leak'" class="leak-drops">
            <span class="drop">💧</span>
            <span class="drop drop--2">💧</span>
          </div>
        </div>
      </div>

      <!-- Available pieces -->
      <div class="pieces-tray">
        <div class="tray-label">Piezas disponibles:</div>
        <div class="pieces-row">
          <button
            v-for="piece in availablePieces"
            :key="piece.id"
            class="piece-btn"
            :class="{ 'piece-btn--selected': selectedPiece?.id === piece.id, 'piece-btn--used': piece.used }"
            :disabled="piece.used"
            @click="selectPiece(piece)"
          >
            <span>{{ piece.emoji }}</span>
            <span class="piece-name">{{ piece.name }}</span>
          </button>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="leak-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

const emit = defineEmits<{
  complete: []
}>()

const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface GridCell {
  id: string
  row: number
  col: number
  type: 'empty' | 'fixed' | 'leak' | 'placed'
  needsPiece: string | null
  pipeEmoji: string | null
}

interface PipePiece {
  id: string
  name: string
  emoji: string
  pipeType: string
  used: boolean
}

const gridData: GridCell[] = [
  { id: 'g0', row: 0, col: 0, type: 'fixed', needsPiece: null, pipeEmoji: '🔵' },
  { id: 'g1', row: 0, col: 1, type: 'leak', needsPiece: 'straight', pipeEmoji: null },
  { id: 'g2', row: 0, col: 2, type: 'fixed', needsPiece: null, pipeEmoji: '➡️' },
  { id: 'g3', row: 0, col: 3, type: 'leak', needsPiece: 'elbow', pipeEmoji: null },
  { id: 'g4', row: 1, col: 0, type: 'fixed', needsPiece: null, pipeEmoji: '⬇️' },
  { id: 'g5', row: 1, col: 1, type: 'fixed', needsPiece: null, pipeEmoji: '➡️' },
  { id: 'g6', row: 1, col: 2, type: 'leak', needsPiece: 'tee', pipeEmoji: null },
  { id: 'g7', row: 1, col: 3, type: 'fixed', needsPiece: null, pipeEmoji: '⬇️' },
  { id: 'g8', row: 2, col: 0, type: 'leak', needsPiece: 'valve', pipeEmoji: null },
  { id: 'g9', row: 2, col: 1, type: 'fixed', needsPiece: null, pipeEmoji: '➡️' },
  { id: 'g10', row: 2, col: 2, type: 'fixed', needsPiece: null, pipeEmoji: '➡️' },
  { id: 'g11', row: 2, col: 3, type: 'leak', needsPiece: 'cap', pipeEmoji: null },
]

const piecesData: PipePiece[] = [
  { id: 'pc1', name: 'Tubo recto', emoji: '🔧', pipeType: 'straight', used: false },
  { id: 'pc2', name: 'Codo', emoji: '↪️', pipeType: 'elbow', used: false },
  { id: 'pc3', name: 'Conector T', emoji: '🔩', pipeType: 'tee', used: false },
  { id: 'pc4', name: 'Válvula', emoji: '🚰', pipeType: 'valve', used: false },
  { id: 'pc5', name: 'Tapón', emoji: '🔴', pipeType: 'cap', used: false },
]

const grid = ref<GridCell[]>([])
const availablePieces = ref<PipePiece[]>([])
const selectedPiece = ref<PipePiece | null>(null)
const piecesPlaced = ref(0)
const isComplete = computed(() => piecesPlaced.value >= 5)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function onStart() {
  grid.value = gridData.map(g => ({ ...g }))
  availablePieces.value = piecesData.map(p => ({ ...p }))
  piecesPlaced.value = 0
  selectedPiece.value = null
}

function selectPiece(piece: PipePiece) {
  if (piece.used) return
  selectedPiece.value = piece
}

function placepiece(cell: GridCell) {
  if (cell.type !== 'leak' || !selectedPiece.value) return

  if (selectedPiece.value.pipeType === cell.needsPiece) {
    cell.type = 'placed'
    cell.pipeEmoji = selectedPiece.value.emoji
    selectedPiece.value.used = true
    piecesPlaced.value++
    selectedPiece.value = null
    showFB('¡Pieza correcta!', true)
    nextTick(() => {
      const placed = document.querySelector(`[data-cell="${cell.id}"]`)
      if (placed) celebrateSuccess(placed)
    })
    if (isComplete.value) {
      const gameEl = document.querySelector('.leak-game')
      if (gameEl) confettiBurst(gameEl, 20)
      setTimeout(() => { showResult.value = true }, 800)
    }
  } else {
    showFB('Esa pieza no encaja aquí.', false)
    nextTick(() => {
      const cellEl = document.querySelector(`[data-cell="${cell.id}"]`)
      if (cellEl) shakeWrong(cellEl)
    })
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 1500)
}

function resetGame() {
  grid.value = gridData.map(g => ({ ...g }))
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
  background: transparent;
  position: relative;
}

.pipe-grid {
  flex: 1;
  display: grid;
  position: relative;
  z-index: 5;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 6px;
  padding: 16px;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.pipe-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  position: relative;
  min-height: 60px;
}

.pipe-cell--fixed {
  background: rgba(255,255,255,0.4);
}

.pipe-cell--empty {
  background: rgba(255,255,255,0.1);
}

.pipe-cell--leak {
  background: rgba(249,65,68,0.2);
  border: 2px dashed var(--color-coral);
  cursor: pointer;
  animation: pulse 1.5s infinite;
}

.pipe-cell--placed {
  background: rgba(82,183,136,0.4);
  border: 2px solid var(--color-green-light);
  animation: scaleIn 0.3s ease;
}

.pipe-emoji { font-size: 28px; }

.leak-drops {
  position: absolute;
  bottom: -8px;
}

.drop {
  font-size: 12px;
  animation: float 1.5s infinite;
}

.drop--2 {
  animation-delay: 0.5s;
}

.pieces-tray {
  padding: 12px 16px;
  background: rgba(255,255,255,0.95);
  position: relative;
  z-index: 5;
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

.piece-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: white;
  border: 2px solid var(--color-blue);
  border-radius: var(--radius-md);
  font-size: 22px;
  transition: all var(--transition-fast);
}

.piece-btn:active { transform: scale(0.95); }

.piece-btn--selected {
  border-color: var(--color-green-light);
  background: var(--color-green-bg);
  box-shadow: 0 0 0 2px var(--color-green-light);
}

.piece-btn--used {
  opacity: 0.3;
  cursor: not-allowed;
}

.piece-name { font-size: 10px; font-weight: 700; color: var(--color-text); }

.leak-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 16px;
  z-index: 5;
  animation: scaleIn 0.3s ease;
}

.fb--ok { background: rgba(82,183,136,0.95); color: white; }
.fb--no { background: rgba(249,65,68,0.95); color: white; }
</style>
