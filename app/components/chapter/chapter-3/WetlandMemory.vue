<template>
  <MinigameShell
    title="Proteger el humedal"
    mascot-character-id="xani"
    particle-preset="water"
    description="Cada animal del humedal ayuda de una forma especial. Voltea las cartas y une cada animal con lo que hace. Por ejemplo: Ranas + Se comen a los mosquitos."
    :completed="matched"
    :total="4"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <MemoryGame
      ref="gameRef"
      :pairs="pairs"
      back-emoji="💧"
      back-gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)"
      accent-color="#3b82f6"
      error-message="Esas no son pareja. 💡 Cada animal ayuda de una forma diferente: ¿quién filtra, quién come insectos, quién esparce semillas?"
      success-message="¡Pareja encontrada!"
      hint="👆 Une cada animal con lo que hace en el humedal"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { MemoryPair } from '~/components/minigame/MemoryGame.vue'

defineEmits<{ complete: [] }>()

const pairs: MemoryPair[] = [
  { pairId: 1, emoji: '🪷', label: 'Plantas de agua (lirios, carrizos)' },
  { pairId: 1, emoji: '🚿', label: 'Filtran la basura del agua' },
  { pairId: 2, emoji: '🐸', label: 'Ranas' },
  { pairId: 2, emoji: '🦟', label: 'Se comen a los mosquitos' },
  { pairId: 3, emoji: '🦆', label: 'Patos' },
  { pairId: 3, emoji: '🌱', label: 'Esparcen semillas de plantas' },
  { pairId: 4, emoji: '🐟', label: 'Peces' },
  { pairId: 4, emoji: '🍃', label: 'Mantienen el agua en movimiento' },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/MemoryGame.vue').default> | null>(null)
const matched = ref(0)
const showResult = ref(false)

function onStart() {
  matched.value = 0
  showResult.value = false
  nextTick(() => gameRef.value?.start())
}

function onUpdate(m: number) { matched.value = m }
function onComplete() { setTimeout(() => { showResult.value = true }, 1000) }
</script>
