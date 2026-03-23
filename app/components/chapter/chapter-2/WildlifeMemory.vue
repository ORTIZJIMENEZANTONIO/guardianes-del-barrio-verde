<template>
  <MinigameShell
    title="Vida en el parque"
    description="Encuentra las parejas: cada animal necesita algo para vivir en el parque."
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
      back-emoji="🌿"
      back-gradient="linear-gradient(135deg, #2d9d5e, #52b788, #40c977)"
      accent-color="#52b788"
      error-message="Esas cartas no hacen pareja. 💡 Cada animal necesita algo especial para vivir en el parque."
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
  { pairId: 1, emoji: '🦋', label: 'Mariposa' },
  { pairId: 1, emoji: '🌸', label: 'Flores con néctar' },
  { pairId: 2, emoji: '🐦', label: 'Pájaro' },
  { pairId: 2, emoji: '🌳', label: 'Árbol con sombra' },
  { pairId: 3, emoji: '🐝', label: 'Abeja' },
  { pairId: 3, emoji: '🌻', label: 'Plantas aromáticas' },
  { pairId: 4, emoji: '🐕', label: 'Bolillo (perro)' },
  { pairId: 4, emoji: '💧', label: 'Agua y sombra' },
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
