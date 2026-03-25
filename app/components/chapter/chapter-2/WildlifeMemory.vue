<template>
  <MinigameShell
    title="Vida en el parque"
    mascot-character-id="bolillo"
    particle-preset="nature"
    description="Conecta cada animal con lo que necesita para vivir en el parque. Toca un animal a la izquierda y arrastra hasta su necesidad a la derecha."
    :completed="matched"
    :total="4"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <LineMatchGame
      ref="gameRef"
      :pairs="pairs"
      hint="👆 Conecta cada animal con lo que necesita"
      error-message="Esos no son pareja. 💡 Cada animal necesita algo especial para vivir en el parque."
      success-message="¡Conexión correcta!"
      accent-color="#2d9d5e"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { LineMatchPair } from '~/components/minigame/LineMatchGame.vue'

defineEmits<{ complete: [] }>()

const pairs: LineMatchPair[] = [
  { pairId: 1, left: { id: 'l1', emoji: '🦋', label: 'Mariposa' }, right: { id: 'r1', emoji: '🌸', label: 'Flores con néctar' } },
  { pairId: 2, left: { id: 'l2', emoji: '🐦', label: 'Pájaro' }, right: { id: 'r2', emoji: '🌳', label: 'Árbol con sombra' } },
  { pairId: 3, left: { id: 'l3', emoji: '🐝', label: 'Abeja' }, right: { id: 'r3', emoji: '🌻', label: 'Plantas aromáticas' } },
  { pairId: 4, left: { id: 'l4', emoji: '🐕', label: 'Bolillo' }, right: { id: 'r4', emoji: '💧', label: 'Agua y sombra' } },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/LineMatchGame.vue').default> | null>(null)
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
