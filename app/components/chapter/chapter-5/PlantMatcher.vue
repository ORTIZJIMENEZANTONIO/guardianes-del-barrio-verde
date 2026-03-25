<template>
  <MinigameShell
    title="Elegir plantas"
    mascot-character-id="xani"
    particle-preset="sparkle"
    description="Encuentra las parejas: cada planta tiene una condición ideal de sol, agua o viento."
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
      back-emoji="🌱"
      back-gradient="linear-gradient(135deg, #22c55e, #15803d)"
      accent-color="#22c55e"
      error-message="Esas cartas no son pareja. 💡 Cada planta tiene una condición favorita de sol, agua o viento."
      success-message="¡Pareja encontrada! Esa planta es perfecta para esa condición."
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { MemoryPair } from '~/components/minigame/MemoryGame.vue'

defineEmits<{ complete: [] }>()

const pairs: MemoryPair[] = [
  { pairId: 1, emoji: '☀️', label: 'Mucho sol' },
  { pairId: 1, emoji: '🪴', label: 'Suculentas' },
  { pairId: 2, emoji: '💧', label: 'Poca agua' },
  { pairId: 2, emoji: '🌵', label: 'Cactus' },
  { pairId: 3, emoji: '💨', label: 'Viento fuerte' },
  { pairId: 3, emoji: '🌸', label: 'Lavanda' },
  { pairId: 4, emoji: '🌑', label: 'Sombra' },
  { pairId: 4, emoji: '🌿', label: 'Helecho' },
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
