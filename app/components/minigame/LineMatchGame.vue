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
        <!-- Completed connections -->
        <line
          v-for="conn in connections"
          :key="conn.id"
          :x1="conn.x1" :y1="conn.y1"
          :x2="conn.x2" :y2="conn.y2"
          class="match-line match-line--done"
        />
        <!-- Active drawing line -->
        <line
          v-if="drawingLine"
          :x1="drawingLine.x1" :y1="drawingLine.y1"
          :x2="drawingLine.x2" :y2="drawingLine.y2"
          class="match-line match-line--active"
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
          <span class="match-node__emoji">{{ item.emoji }}</span>
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
          <span class="match-node__emoji">{{ item.emoji }}</span>
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
  gap: 0;
  z-index: 5;
  position: relative;
  padding: 8px 4px;
}

.match-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.match-line {
  stroke-width: 3;
  stroke-linecap: round;
}

.match-line--done {
  stroke: v-bind(accentColor);
  stroke-width: 3;
  opacity: 0.7;
}

.match-line--active {
  stroke: #94a3b8;
  stroke-width: 2;
  stroke-dasharray: 6 4;
  opacity: 0.6;
}

.match-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  padding: 4px;
  z-index: 3;
}

.match-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 6px;
  background: rgba(255,255,255,0.85);
  border: 2px solid rgba(0,0,0,0.12);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 200ms ease;
  touch-action: none;
  user-select: none;
}

.match-node:active { transform: scale(0.96); }

.match-node--selected {
  border-color: v-bind(accentColor);
  background: rgba(34, 197, 94, 0.12);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
}

.match-node--hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.match-node--matched {
  border-color: v-bind(accentColor);
  background: rgba(34, 197, 94, 0.15);
  opacity: 0.7;
  cursor: default;
}

.match-node__emoji { font-size: 24px; }
.match-node__label {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
