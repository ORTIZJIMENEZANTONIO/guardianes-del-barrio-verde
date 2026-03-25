<template>
  <MinigameShell
    title="Proteger el humedal"
    description="Voltea las cartas de dos en dos. Cada animal o planta tiene una pareja que explica su funcion en el humedal. Por ejemplo: Rana + Indica agua sana. Encuentra las 4 parejas."
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
      error-message="Esas cartas no son pareja. 💡 Recuerda que cada parte del humedal tiene una función especial."
      success-message="¡Pareja encontrada!"
      hint="👆 Voltea 2 cartas: une cada ser vivo con su funcion"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { MemoryPair } from '~/components/minigame/MemoryGame.vue'

defineEmits<{ complete: [] }>()

const pairs: MemoryPair[] = [
  { pairId: 1, emoji: '🌾', label: 'Juncos' },
  { pairId: 1, emoji: '🧹', label: 'Filtran el agua' },
  { pairId: 2, emoji: '🐸', label: 'Rana' },
  { pairId: 2, emoji: '🌡️', label: 'Indica agua sana' },
  { pairId: 3, emoji: '💧', label: 'Humedal' },
  { pairId: 3, emoji: '🧽', label: 'Retiene agua como esponja' },
  { pairId: 4, emoji: '🦆', label: 'Aves acuáticas' },
  { pairId: 4, emoji: '🏠', label: 'Necesitan hábitat limpio' },
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
