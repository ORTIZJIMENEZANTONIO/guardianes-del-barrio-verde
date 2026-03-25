<template>
  <MinigameShell
    title="Conocer las especies"
    description="Encuentra las parejas: cada animal en peligro tiene una amenaza principal."
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
      back-emoji="🦎"
      back-gradient="linear-gradient(135deg, #ef4444, #b91c1c)"
      accent-color="#ef4444"
      error-message="Esas cartas no son pareja. 💡 Cada animal tiene una amenaza específica que lo pone en peligro."
      success-message="¡Pareja encontrada! Ahora sabes qué amenaza a esa especie."
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { MemoryPair } from '~/components/minigame/MemoryGame.vue'

defineEmits<{ complete: [] }>()

const pairs: MemoryPair[] = [
  { pairId: 1, emoji: '🦎', label: 'Ajolote' },
  { pairId: 1, emoji: '🏭', label: 'Contaminación del agua' },
  { pairId: 2, emoji: '🐬', label: 'Vaquita marina' },
  { pairId: 2, emoji: '🪤', label: 'Redes de pesca' },
  { pairId: 3, emoji: '🐆', label: 'Jaguar' },
  { pairId: 3, emoji: '🪓', label: 'Deforestación' },
  { pairId: 4, emoji: '🦋', label: 'Mariposa monarca' },
  { pairId: 4, emoji: '🌡️', label: 'Cambio climático' },
  { pairId: 5, emoji: '🐺', label: 'Lobo mexicano' },
  { pairId: 5, emoji: '🔫', label: 'Caza furtiva' },
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
