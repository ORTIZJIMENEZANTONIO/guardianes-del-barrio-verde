<template>
  <MinigameShell
    title="Detectar puntos de calor"
    description="Toca las superficies de la calle. Encuentra los 3 puntos más calientes."
    :completed="found"
    :total="3"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <TapDetectGame
      ref="gameRef"
      :spot-data="spots"
      :total="3"
      hint="👆 Toca cada zona para medir"
      success-label="Calientes"
      meter-label="Termómetro"
      target-badge="🔥 Caliente"
      ok-badge="✅ Fresco"
      found-emoji="🔥"
      sky-variant="hot"
      street-variant="dirty"
      success-color="#f94144"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { TapSpot } from '~/components/minigame/TapDetectGame.vue'

defineEmits<{ complete: [] }>()

const spots: TapSpot[] = [
  { id: 's1', label: 'Pavimento', emoji: '🟫', isTarget: true, x: 10, y: 60, w: 80, h: 60, message: '¡El pavimento sin sombra alcanza 58°C!' },
  { id: 's2', label: 'Techo bajo', emoji: '🏠', isTarget: true, x: 60, y: 15, w: 70, h: 55, message: 'Los techos absorben mucho calor.' },
  { id: 's3', label: 'Banca metal', emoji: '🪑', isTarget: true, x: 40, y: 50, w: 65, h: 50, message: '¡La banca metálica quema al sol!' },
  { id: 's4', label: 'Sombra', emoji: '🌤️', isTarget: false, x: 75, y: 45, w: 65, h: 50, message: 'La sombra baja la temperatura.' },
  { id: 's5', label: 'Pared', emoji: '🧱', isTarget: false, x: 5, y: 20, w: 60, h: 55, message: 'Las paredes acumulan algo de calor.' },
  { id: 's6', label: 'Maceta', emoji: '🪴', isTarget: false, x: 50, y: 70, w: 55, h: 50, message: 'Las plantas ayudan a enfriar.' },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/TapDetectGame.vue').default> | null>(null)
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
