<template>
  <MinigameShell
    title="Antes y después"
    description="Compara las dos escenas: la azotea antes era gris y caliente. Después se transformó. Toca en la escena de 'Después' donde veas algo nuevo. Tienes 2 pistas."
    :completed="found"
    :total="5"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <SpotDifference
      ref="gameRef"
      :differences="diffs"
      :total="5"
      hint="👆 Toca en 'Después' donde veas algo que no estaba antes"
      :max-hints="2"
      before-sky="hot"
      before-street="dirty"
      after-sky="nice"
      after-street="clean"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { DiffSpot } from '~/components/minigame/SpotDifference.vue'

defineEmits<{ complete: [] }>()

const diffs: DiffSpot[] = [
  { id: 'd1', x: 15, y: 25, w: 65, h: 50, emoji: '🌿', label: 'Plantas en la azotea', message: 'Las plantas bajan la temperatura del edificio hasta 5°C.' },
  { id: 'd2', x: 55, y: 15, w: 60, h: 45, emoji: '🌧️', label: 'Captador de lluvia', message: 'El captador recolecta agua para regar sin gastar agua potable.' },
  { id: 'd3', x: 35, y: 55, w: 55, h: 45, emoji: '🦋', label: 'Mariposas', message: 'Las plantas del techo verde atraen polinizadores al barrio.' },
  { id: 'd4', x: 75, y: 45, w: 55, h: 50, emoji: '☀️', label: 'Panel solar', message: 'El techo verde y paneles solares trabajan juntos para un edificio sustentable.' },
  { id: 'd5', x: 10, y: 60, w: 60, h: 45, emoji: '🪴', label: 'Huerto urbano', message: 'Un huerto en la azotea produce alimentos frescos para el edificio.' },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/SpotDifference.vue').default> | null>(null)
const found = ref(0)
const showResult = ref(false)

function onStart() {
  found.value = 0
  showResult.value = false
  nextTick(() => gameRef.value?.start())
}

function onUpdate(f: number) { found.value = f }
function onComplete() { setTimeout(() => { showResult.value = true }, 1000) }
</script>
