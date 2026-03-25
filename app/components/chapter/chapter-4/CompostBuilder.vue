<template>
  <MinigameShell
    title="Hacer composta"
    mascot-character-id="vale"
    description="Coloca cada capa en el orden correcto para armar la composta. Selecciona un material y toca la posición donde va."
    :completed="correct"
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
      hint="👆 Selecciona un material y toca el paso donde va"
      tray-title="Materiales para la composta:"
      :slot-labels="['Base', 'Verdes', 'Cafés', 'Tierra', 'Cubierta']"
      error-message="Esa capa no va ahí. 💡 La composta se arma en capas: primero la base, luego verdes, cafés, tierra y cubierta."
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { SequenceStep } from '~/components/minigame/SequenceGame.vue'

defineEmits<{ complete: [] }>()

const steps: SequenceStep[] = [
  { id: 'base', emoji: '🪵', label: 'Ramas y palos', correctPosition: 1, successMessage: '¡Base lista! Las ramas permiten que circule el aire.' },
  { id: 'green', emoji: '🥬', label: 'Restos verdes', correctPosition: 2, successMessage: '¡Verdes! Cáscaras y restos de frutas aportan nitrógeno.' },
  { id: 'brown', emoji: '🍂', label: 'Hojas secas', correctPosition: 3, successMessage: '¡Cafés! Las hojas secas aportan carbono y absorben humedad.' },
  { id: 'soil', emoji: '🌍', label: 'Tierra', correctPosition: 4, successMessage: '¡Tierra! Aporta microorganismos que descomponen todo.' },
  { id: 'cover', emoji: '🧺', label: 'Cubierta', correctPosition: 5, successMessage: '¡Cubierta! Protege la composta del sol y la lluvia.' },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/SequenceGame.vue').default> | null>(null)
const correct = ref(0)
const showResult = ref(false)

function onStart() {
  correct.value = 0
  showResult.value = false
  nextTick(() => gameRef.value?.start())
}

function onUpdate(c: number) { correct.value = c }
function onComplete() { setTimeout(() => { showResult.value = true }, 1000) }
</script>
