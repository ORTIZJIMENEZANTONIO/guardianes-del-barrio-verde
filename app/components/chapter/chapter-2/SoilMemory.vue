<template>
  <MinigameShell
    title="Cuidar el suelo"
    mascot-character-id="bolillo"
    particle-preset="nature"
    description="Encuentra las parejas: cada problema del suelo tiene una solución."
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
      back-gradient="linear-gradient(135deg, #52b788, #2d6a4f)"
      accent-color="#52b788"
      error-message="Esas dos cartas no son pareja. 💡 Recuerda: cada problema del suelo tiene una solución específica."
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
  { pairId: 1, emoji: '🪨', label: 'Suelo compacto' },
  { pairId: 1, emoji: '🔨', label: 'Aflojar tierra' },
  { pairId: 2, emoji: '🗑️', label: 'Basura enterrada' },
  { pairId: 2, emoji: '🧹', label: 'Limpiar residuos' },
  { pairId: 3, emoji: '🏜️', label: 'Tierra seca' },
  { pairId: 3, emoji: '💧', label: 'Agregar agua' },
  { pairId: 4, emoji: '🪹', label: 'Sin nutrientes' },
  { pairId: 4, emoji: '🌿', label: 'Añadir composta' },
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
