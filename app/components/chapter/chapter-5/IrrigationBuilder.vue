<template>
  <MinigameShell
    title="Instalar riego"
    description="Traza la ruta del agua tocando los nodos en el orden correcto: desde el captador de lluvia hasta las plantas."
    :completed="connected"
    :total="5"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <RouteTracer
      ref="gameRef"
      :node-data="nodes"
      :segments="segments"
      hint="👆 Toca los nodos en orden: del captador a las plantas"
      error-message="Ese no es el siguiente paso. 💡 El agua va del captador → filtro → tubería → válvula → plantas."
      accent-color="#3b82f6"
      sky-variant="nice"
      street-variant="normal"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { TracerNode, TracerSegment } from '~/components/minigame/RouteTracer.vue'

defineEmits<{ complete: [] }>()

const nodes: TracerNode[] = [
  { id: 'n1', emoji: '🌧️', label: 'Captador', x: 10, y: 20, correctOrder: 1, message: '¡Captador de lluvia! Aquí se recolecta el agua.' },
  { id: 'n2', emoji: '🧹', label: 'Filtro', x: 30, y: 40, correctOrder: 2, message: '¡Filtro! Limpia el agua antes de usarla.' },
  { id: 'n3', emoji: '📏', label: 'Tubería', x: 50, y: 30, correctOrder: 3, message: '¡Tubería! Lleva el agua a donde se necesita.' },
  { id: 'n4', emoji: '🔴', label: 'Válvula', x: 70, y: 50, correctOrder: 4, message: '¡Válvula! Controla cuánta agua pasa.' },
  { id: 'n5', emoji: '🌿', label: 'Plantas', x: 88, y: 35, correctOrder: 5, message: '¡Plantas regadas! El sistema de riego está completo.' },
]

const segments: TracerSegment[] = [
  { from: 'n1', to: 'n2' },
  { from: 'n2', to: 'n3' },
  { from: 'n3', to: 'n4' },
  { from: 'n4', to: 'n5' },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/RouteTracer.vue').default> | null>(null)
const connected = ref(0)
const showResult = ref(false)

function onStart() {
  connected.value = 0
  showResult.value = false
  nextTick(() => gameRef.value?.start())
}

function onUpdate(c: number) { connected.value = c }
function onComplete() { setTimeout(() => { showResult.value = true }, 1000) }
</script>
