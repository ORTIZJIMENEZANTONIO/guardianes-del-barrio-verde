<template>
  <div class="linematch-game">
    <SceneSky :variant="skyVariant" />
    <SceneStreet :variant="streetVariant" />

    <div class="game-hint">
      {{ hint }} · Conectados: {{ matchedCount }}/{{ pairCount }}
    </div>

    <div class="match-area" ref="matchAreaRef">
      <!-- SVG lines -->
      <svg class="match-lines" ref="svgRef">
        <defs>
          <!-- Glow filter for active line -->
          <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <!-- Gradient for active line -->
          <linearGradient id="active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="v-bind(accentColor)" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.6" />
          </linearGradient>
        </defs>

        <!-- Completed connections (curved paths with draw animation) -->
        <path
          v-for="conn in connections"
          :key="conn.id"
          :d="curvePath(conn.x1, conn.y1, conn.x2, conn.y2)"
          class="match-line match-line--done"
          :style="{ '--line-length': getPathLength(conn) + 'px' }"
        />

        <!-- Active drawing line (curved, glowing) -->
        <path
          v-if="drawingLine"
          :d="curvePath(drawingLine.x1, drawingLine.y1, drawingLine.x2, drawingLine.y2)"
          class="match-line match-line--active"
          filter="url(#line-glow)"
        />

        <!-- Connection dot at start of active line -->
        <circle
          v-if="drawingLine"
          :cx="drawingLine.x1" :cy="drawingLine.y1"
          r="5"
          :fill="accentColor"
          opacity="0.6"
          class="line-dot"
        />
        <!-- Connection dot following pointer -->
        <circle
          v-if="drawingLine"
          :cx="drawingLine.x2" :cy="drawingLine.y2"
          r="4"
          fill="#3b82f6"
          opacity="0.5"
          class="line-dot line-dot--tip"
        />
      </svg>

      <!-- Left column -->
      <div class="match-col match-col--left">
        <div
          v-for="item in leftItems"
          :key="item.id"
          class="match-node"
          :class="{
            'match-node--selected': selectedLeft?.id === item.id,
            'match-node--matched': item.matched,
          }"
          :data-node="item.id"
          @pointerdown.prevent="startConnect(item, 'left', $event)"
        >
          <GameIcon :emoji="item.emoji" :size="26" class="match-node__emoji" />
          <span class="match-node__label">{{ item.label }}</span>
        </div>
      </div>

      <!-- Right column -->
      <div class="match-col match-col--right">
        <div
          v-for="item in rightItems"
          :key="item.id"
          class="match-node"
          :class="{
            'match-node--hover': hoveredRight?.id === item.id,
            'match-node--matched': item.matched,
          }"
          :data-node="item.id"
          @pointerup.prevent="endConnect(item)"
        >
          <GameIcon :emoji="item.emoji" :size="26" class="match-node__emoji" />
          <span class="match-node__label">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- Feedback -->
    <Transition name="fade">
      <div v-if="feedback" class="game-feedback" :class="feedback.ok ? 'game-feedback--ok' : 'game-feedback--no'">
        {{ feedback.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'
import { useGameFeedback } from '~/composables/useGameFeedback'

export interface LineMatchPair {
  pairId: number
  left: { id: string; emoji: string; label: string }
  right: { id: string; emoji: string; label: string }
}

const props = withDefaults(defineProps<{
  pairs: LineMatchPair[]
  hint?: string
  errorMessage?: string
  successMessage?: string
  accentColor?: string
  skyVariant?: string
  streetVariant?: string
}>(), {
  hint: '👆 Toca un elemento de la izquierda y conecta con su pareja de la derecha',
  errorMessage: 'Esos no son pareja. 💡 Fíjate en la relación entre ellos.',
  successMessage: '¡Conexión correcta!',
  accentColor: '#22c55e',
  skyVariant: 'nice',
  streetVariant: 'normal',
})

const emit = defineEmits<{
  complete: []
  update: [matched: number, total: number]
}>()

const { celebrateSuccess, confettiBurst, shakeWrong } = useGameAnimations()
const { feedback, showOk, showNo, clear: clearFeedback } = useGameFeedback()

interface NodeItem { id: string; emoji: string; label: string; pairId: number; matched: boolean }
interface Connection { id: string; x1: number; y1: number; x2: number; y2: number }

const pairCount = computed(() => props.pairs.length)

/** Generate a smooth cubic bezier curve between two points */
function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1
  const controlOffset = Math.abs(dx) * 0.4
  const cx1 = x1 + controlOffset
  const cx2 = x2 - controlOffset
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`
}

/** Approximate path length for stroke-dasharray animation */
function getPathLength(conn: Connection): number {
  const dx = conn.x2 - conn.x1
  const dy = conn.y2 - conn.y1
  return Math.sqrt(dx * dx + dy * dy) * 1.3 // bezier is ~30% longer than straight
}
const leftItems = ref<NodeItem[]>([])
const rightItems = ref<NodeItem[]>([])
const connections = ref<Connection[]>([])
const matchedCount = ref(0)
const isComplete = computed(() => matchedCount.value >= pairCount.value)

const selectedLeft = ref<NodeItem | null>(null)
const hoveredRight = ref<NodeItem | null>(null)
const drawingLine = ref<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
const matchAreaRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function start() {
  leftItems.value = shuffle(props.pairs.map(p => ({ ...p.left, pairId: p.pairId, matched: false })))
  rightItems.value = shuffle(props.pairs.map(p => ({ ...p.right, pairId: p.pairId, matched: false })))
  connections.value = []
  matchedCount.value = 0
  selectedLeft.value = null
  clearFeedback()
  emit('update', 0, pairCount.value)
}

function getNodeCenter(nodeId: string): { x: number; y: number } | null {
  const el = matchAreaRef.value?.querySelector(`[data-node="${nodeId}"]`) as HTMLElement | null
  const svg = svgRef.value
  if (!el || !svg) return null
  const rect = el.getBoundingClientRect()
  const svgRect = svg.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2 - svgRect.left,
    y: rect.top + rect.height / 2 - svgRect.top,
  }
}

function startConnect(item: NodeItem, _side: 'left', e: PointerEvent) {
  if (item.matched) return
  selectedLeft.value = item

  const svg = svgRef.value
  if (!svg) return
  const svgRect = svg.getBoundingClientRect()
  const center = getNodeCenter(item.id)
  if (center) {
    drawingLine.value = {
      x1: center.x, y1: center.y,
      x2: e.clientX - svgRect.left, y2: e.clientY - svgRect.top,
    }
  }

  // Track pointer for live line drawing
  function onMove(ev: PointerEvent) {
    if (!drawingLine.value || !svg) return
    const r = svg.getBoundingClientRect()
    drawingLine.value.x2 = ev.clientX - r.left
    drawingLine.value.y2 = ev.clientY - r.top

    // Detect hover on right items
    const els = document.elementsFromPoint(ev.clientX, ev.clientY)
    const nodeEl = els.find(el => (el as HTMLElement).closest?.('.match-col--right .match-node'))
    if (nodeEl) {
      const id = (nodeEl as HTMLElement).closest('[data-node]')?.getAttribute('data-node')
      hoveredRight.value = rightItems.value.find(r => r.id === id) ?? null
    } else {
      hoveredRight.value = null
    }
  }

  function onUp(ev: PointerEvent) {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
    drawingLine.value = null

    // Check if released on a right node
    const els = document.elementsFromPoint(ev.clientX, ev.clientY)
    const nodeEl = els.find(el => (el as HTMLElement).closest?.('.match-col--right .match-node'))
    if (nodeEl) {
      const id = (nodeEl as HTMLElement).closest('[data-node]')?.getAttribute('data-node')
      const rightItem = rightItems.value.find(r => r.id === id)
      if (rightItem) endConnect(rightItem)
      else { selectedLeft.value = null; hoveredRight.value = null }
    } else {
      selectedLeft.value = null
      hoveredRight.value = null
    }
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function endConnect(rightItem: NodeItem) {
  hoveredRight.value = null
  if (!selectedLeft.value || rightItem.matched) {
    selectedLeft.value = null
    return
  }

  const left = selectedLeft.value

  if (left.pairId === rightItem.pairId) {
    // Correct match
    left.matched = true
    rightItem.matched = true
    matchedCount.value++

    const leftCenter = getNodeCenter(left.id)
    const rightCenter = getNodeCenter(rightItem.id)
    if (leftCenter && rightCenter) {
      connections.value.push({
        id: `${left.id}-${rightItem.id}`,
        x1: leftCenter.x, y1: leftCenter.y,
        x2: rightCenter.x, y2: rightCenter.y,
      })
    }

    showOk(props.successMessage)
    nextTick(() => {
      const el = document.querySelector(`[data-node="${rightItem.id}"]`)
      if (el) celebrateSuccess(el)
    })

    emit('update', matchedCount.value, pairCount.value)

    if (isComplete.value) {
      const gameEl = document.querySelector('.linematch-game')
      if (gameEl) confettiBurst(gameEl, 20)
      setTimeout(() => emit('complete'), 1000)
    }
  } else {
    showNo(props.errorMessage)
    nextTick(() => {
      const el = document.querySelector(`[data-node="${rightItem.id}"]`)
      if (el) shakeWrong(el)
    })
  }

  selectedLeft.value = null
}

function reset() { start() }

defineExpose({ start, reset, matchedCount, isComplete })
</script>

<style scoped>
.linematch-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.match-area {
  flex: 1;
  display: flex;
  justify-content: space-between;
  z-index: 5;
  position: relative;
  padding: 4px 0;
}

.match-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: visible;
}

.match-line {
  stroke-linecap: round;
  fill: none;
}

/* Completed line: draws itself in with animation */
.match-line--done {
  stroke: v-bind(accentColor);
  stroke-width: 3.5;
  opacity: 0.8;
  stroke-dasharray: var(--line-length, 300px);
  stroke-dashoffset: var(--line-length, 300px);
  animation: drawLine 0.6s ease-out forwards;
}

/* Active line while dragging: glowing, semi-transparent */
.match-line--active {
  stroke: url(#active-gradient);
  stroke-width: 3;
  opacity: 0.7;
}

/* Dots at line endpoints */
.line-dot {
  transition: r 0.15s ease;
}
.line-dot--tip {
  animation: dotPulse 0.8s ease-in-out infinite;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes dotPulse {
  0%, 100% { r: 4; opacity: 0.5; }
  50% { r: 6; opacity: 0.8; }
}

/* Columns: narrow to leave max space for lines in the middle */
.match-col {
  width: 30%;
  max-width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  justify-content: space-evenly;
  padding: 8px 4px;
  z-index: 3;
}

.match-col--left { align-items: flex-end; }
.match-col--right { align-items: flex-start; }

.match-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 6px;
  background: rgba(255,255,255,0.9);
  border: 2.5px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-lg, 12px);
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  touch-action: none;
  user-select: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 100px;
}

.match-node:active { transform: scale(0.93); }

.match-node--selected {
  border-color: v-bind(accentColor);
  background: rgba(34, 197, 94, 0.15);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2), 0 0 16px rgba(34, 197, 94, 0.15);
  transform: scale(1.06);
  animation: nodeSelectedPulse 1.2s ease-in-out infinite;
}

.match-node--hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 0 12px rgba(59, 130, 246, 0.15);
  transform: scale(1.05);
}

.match-node--matched {
  border-color: v-bind(accentColor);
  background: rgba(34, 197, 94, 0.12);
  opacity: 0.75;
  cursor: default;
  transform: scale(0.97);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.2);
}

@keyframes nodeSelectedPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2), 0 0 16px rgba(34, 197, 94, 0.15); }
  50% { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.3), 0 0 24px rgba(34, 197, 94, 0.2); }
}

.match-node__emoji {
  font-size: 26px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.match-node--selected .match-node__emoji,
.match-node--hover .match-node__emoji {
  transform: scale(1.15);
}
.match-node__label {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
  max-width: 80px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
