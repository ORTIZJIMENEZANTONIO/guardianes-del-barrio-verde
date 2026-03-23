<template>
  <MinigameShell
    title="Resolver imprevistos"
    description="Encuentra las parejas: cada problema del festival tiene una solución sustentable."
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
      back-emoji="🎉"
      back-gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)"
      accent-color="#8b5cf6"
      error-message="Esas cartas no son pareja. 💡 Cada problema del festival tiene una solución sustentable."
      success-message="¡Problema resuelto!"
      street-variant="clean"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { MemoryPair } from '~/components/minigame/MemoryGame.vue'

defineEmits<{ complete: [] }>()

const pairs: MemoryPair[] = [
  { pairId: 1, emoji: '💧', label: 'Se acabó el agua' },
  { pairId: 1, emoji: '🌧️', label: 'Captador de lluvia' },
  { pairId: 2, emoji: '🗑️', label: 'Mucha basura' },
  { pairId: 2, emoji: '♻️', label: 'Estaciones de separación' },
  { pairId: 3, emoji: '☀️', label: 'No hay sombra' },
  { pairId: 3, emoji: '🏕️', label: 'Toldos reciclados' },
  { pairId: 4, emoji: '❓', label: 'Vecinos perdidos' },
  { pairId: 4, emoji: '🙋', label: 'Voluntarios y señales' },
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
