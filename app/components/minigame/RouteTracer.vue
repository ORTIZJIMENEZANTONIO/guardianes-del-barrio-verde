<template>
  <div class="tracer-game">
    <SceneSky :variant="skyVariant" />
    <SceneStreet :variant="streetVariant" />

    <div class="game-hint">
      {{ hint }} · Conectados: {{ connectedCount }}/{{ totalNodes }}
    </div>

    <div class="tracer-area" ref="tracerAreaRef">
      <!-- SVG paths -->
      <svg class="tracer-svg" ref="svgRef">
        <!-- Background connections (dashed) -->
        <line
          v-for="seg in segments"
          :key="'bg-' + seg.from + '-' + seg.to"
          :x1="nodePos(seg.from)?.x ?? 0" :y1="nodePos(seg.from)?.y ?? 0"
          :x2="nodePos(seg.to)?.x ?? 0" :y2="nodePos(seg.to)?.y ?? 0"
          class="tracer-segment tracer-segment--bg"
        />
        <!-- Active connections (solid) -->
        <line
          v-for="seg in activeSegments"
          :key="'active-' + seg.from + '-' + seg.to"
          :x1="nodePos(seg.from)?.x ?? 0" :y1="nodePos(seg.from)?.y ?? 0"
          :x2="nodePos(seg.to)?.x ?? 0" :y2="nodePos(seg.to)?.y ?? 0"
          class="tracer-segment tracer-segment--active"
        />
      </svg>

      <!-- Nodes -->
      <div
        v-for="node in nodes"
        :key="node.id"
        class="tracer-node"
        :class="{
          'tracer-node--next': node.id === nextNodeId,
          'tracer-node--done': node.connected,
          'tracer-node--wrong': node.wrong,
        }"
        :style="{ left: node.x + '%', top: node.y + '%' }"
        :data-tracer-node="node.id"
        @click="tapNode(node)"
      >
        <span class="tracer-node__emoji">{{ node.emoji }}</span>
        <span class="tracer-node__label">{{ node.label }}</span>
        <span v-if="node.connected" class="tracer-node__check">✅</span>
        <span v-else-if="node.id === nextNodeId" class="tracer-node__pulse" />
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

export interface TracerNode {
  id: string
  emoji: string
  label: string
  x: number
  y: number
  correctOrder: number
  message?: string
}

export interface TracerSegment {
  from: string
  to: string
}

const props = withDefaults(defineProps<{
  nodeData: TracerNode[]
  segments: TracerSegment[]
  hint?: string
  errorMessage?: string
  accentColor?: string
  skyVariant?: string
  streetVariant?: string
}>(), {
  hint: '👆 Toca los nodos en el orden correcto para trazar la ruta',
  errorMessage: 'Ese no es el siguiente paso. 💡 Fíjate en el camino lógico.',
  accentColor: '#3b82f6',
  skyVariant: 'nice',
  streetVariant: 'normal',
})

const emit = defineEmits<{
  complete: []
  update: [connected: number, total: number]
}>()

const { celebrateSuccess, confettiBurst, shakeWrong } = useGameAnimations()
const { feedback, showOk, showNo, clear: clearFeedback } = useGameFeedback()

interface NodeState extends TracerNode { connected: boolean; wrong: boolean }

const nodes = ref<NodeState[]>([])
const connectedCount = ref(0)
const currentOrder = ref(1)
const totalNodes = computed(() => props.nodeData.length)
const isComplete = computed(() => connectedCount.value >= totalNodes.value)

const nextNodeId = computed(() => {
  const sorted = [...props.nodeData].sort((a, b) => a.correctOrder - b.correctOrder)
  return sorted.find(n => n.correctOrder === currentOrder.value)?.id ?? null
})

const activeSegments = computed(() => {
  const connected = new Set(nodes.value.filter(n => n.connected).map(n => n.id))
  return props.segments.filter(s => connected.has(s.from) && connected.has(s.to))
})

const tracerAreaRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)

function nodePos(nodeId: string): { x: number; y: number } | null {
  const el = tracerAreaRef.value?.querySelector(`[data-tracer-node="${nodeId}"]`) as HTMLElement | null
  const svg = svgRef.value
  if (!el || !svg) return null
  const rect = el.getBoundingClientRect()
  const svgRect = svg.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2 - svgRect.left,
    y: rect.top + rect.height / 2 - svgRect.top,
  }
}

function start() {
  nodes.value = props.nodeData.map(n => ({ ...n, connected: false, wrong: false }))
  connectedCount.value = 0
  currentOrder.value = 1
  clearFeedback()
  emit('update', 0, totalNodes.value)
}

function tapNode(node: NodeState) {
  if (node.connected) return

  if (node.correctOrder === currentOrder.value) {
    // Correct
    node.connected = true
    connectedCount.value++
    currentOrder.value++
    showOk(node.message || '¡Correcto!')

    nextTick(() => {
      const el = tracerAreaRef.value?.querySelector(`[data-tracer-node="${node.id}"]`)
      if (el) celebrateSuccess(el)
    })

    emit('update', connectedCount.value, totalNodes.value)

    if (isComplete.value) {
      const gameEl = document.querySelector('.tracer-game')
      if (gameEl) confettiBurst(gameEl, 20)
      setTimeout(() => emit('complete'), 1000)
    }
  } else {
    // Wrong
    node.wrong = true
    showNo(props.errorMessage)
    nextTick(() => {
      const el = tracerAreaRef.value?.querySelector(`[data-tracer-node="${node.id}"]`)
      if (el) shakeWrong(el)
    })
    setTimeout(() => { node.wrong = false }, 600)
  }
}

function reset() { start() }

defineExpose({ start, reset, connectedCount, isComplete })
</script>

<style scoped>
.tracer-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.tracer-area {
  flex: 1;
  position: relative;
  z-index: 5;
  overflow: hidden;
}

.tracer-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.tracer-segment {
  stroke-width: 3;
  stroke-linecap: round;
}

.tracer-segment--bg {
  stroke: rgba(0,0,0,0.15);
  stroke-dasharray: 6 4;
}

.tracer-segment--active {
  stroke: v-bind(accentColor);
  stroke-width: 4;
  filter: drop-shadow(0 0 4px v-bind(accentColor));
  transition: all 300ms ease;
}

/* Nodes */
.tracer-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 10px;
  background: rgba(255,255,255,0.85);
  border: 2px solid rgba(0,0,0,0.15);
  border-radius: var(--radius-md);
  cursor: pointer;
  z-index: 3;
  transition: all 200ms ease;
  min-width: 55px;
}

.tracer-node:active { transform: translate(-50%, -50%) scale(0.95); }

.tracer-node--next {
  border-color: v-bind(accentColor);
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
}

.tracer-node--done {
  border-color: var(--color-green-mid);
  background: rgba(34, 197, 94, 0.15);
  cursor: default;
}

.tracer-node--wrong {
  border-color: var(--color-coral);
  background: rgba(239, 68, 68, 0.15);
  animation: shake 300ms ease;
}

.tracer-node__emoji { font-size: 22px; }
.tracer-node__label { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; }
.tracer-node__check { font-size: 14px; position: absolute; top: -6px; right: -6px; }

.tracer-node__pulse {
  position: absolute;
  inset: -4px;
  border: 2px solid v-bind(accentColor);
  border-radius: var(--radius-md);
  animation: nodePulse 1.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes nodePulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0; transform: scale(1.15); }
}

@keyframes shake {
  0%, 100% { transform: translate(-50%, -50%); }
  20% { transform: translate(calc(-50% - 4px), -50%); }
  40% { transform: translate(calc(-50% + 4px), -50%); }
  60% { transform: translate(calc(-50% - 3px), -50%); }
  80% { transform: translate(calc(-50% + 3px), -50%); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
