<template>
  <MinigameShell
    title="Centro de reciclaje"
    description="Encuentra las parejas: cada material se transforma en un producto nuevo al reciclarlo."
    :completed="matched"
    :total="5"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <MemoryGame
      ref="gameRef"
      :pairs="pairs"
      back-emoji="♻️"
      back-gradient="linear-gradient(135deg, #f97316, #ea580c)"
      accent-color="#f97316"
      error-message="Esas cartas no son pareja. 💡 Cada material se convierte en algo diferente al reciclarlo."
      success-message="¡Pareja encontrada!"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { MemoryPair } from '~/components/minigame/MemoryGame.vue'

defineEmits<{ complete: [] }>()

const pairs: MemoryPair[] = [
  { pairId: 1, emoji: '🧴', label: 'Botella PET' },
  { pairId: 1, emoji: '👕', label: 'Playera reciclada' },
  { pairId: 2, emoji: '📦', label: 'Cartón' },
  { pairId: 2, emoji: '🗃️', label: 'Caja nueva' },
  { pairId: 3, emoji: '🥫', label: 'Lata de aluminio' },
  { pairId: 3, emoji: '🚲', label: 'Bicicleta' },
  { pairId: 4, emoji: '🫙', label: 'Vidrio' },
  { pairId: 4, emoji: '🏺', label: 'Frasco nuevo' },
  { pairId: 5, emoji: '🍌', label: 'Orgánicos' },
  { pairId: 5, emoji: '🌱', label: 'Composta' },
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
