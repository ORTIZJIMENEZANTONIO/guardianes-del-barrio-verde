<template>
  <MinigameShell
    title="Construir refugio"
    mascot-character-id="xani"
    description="Ordena los pasos para crear un refugio de vida silvestre en el barrio."
    :completed="placed"
    :total="5"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <SequenceGame
      ref="gameRef"
      :steps="steps"
      :slot-labels="slotLabels"
      accent-color="#ef4444"
      error-message="Ese no es el paso correcto aquí. 💡 Recuerda: primero necesitas un lugar, luego plantas, después agua."
      success-message="¡Paso correcto! El refugio va tomando forma."
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { SequenceStep } from '~/components/minigame/SequenceGame.vue'

defineEmits<{ complete: [] }>()

const steps: SequenceStep[] = [
  { id: 'r1', emoji: '📍', label: 'Elegir un espacio seguro', correctPosition: 1 },
  { id: 'r2', emoji: '🌱', label: 'Sembrar plantas nativas', correctPosition: 2 },
  { id: 'r3', emoji: '💧', label: 'Poner fuente de agua', correctPosition: 3 },
  { id: 'r4', emoji: '🏠', label: 'Instalar casitas y refugios', correctPosition: 4 },
  { id: 'r5', emoji: '📋', label: 'Señalizar y cuidar el espacio', correctPosition: 5 },
]

const slotLabels = ['Paso 1', 'Paso 2', 'Paso 3', 'Paso 4', 'Paso 5']

const gameRef = ref<InstanceType<typeof import('~/components/minigame/SequenceGame.vue').default> | null>(null)
const placed = ref(0)
const showResult = ref(false)

function onStart() {
  placed.value = 0
  showResult.value = false
  nextTick(() => gameRef.value?.start())
}

function onUpdate(p: number) { placed.value = p }
function onComplete() { setTimeout(() => { showResult.value = true }, 1000) }
</script>
