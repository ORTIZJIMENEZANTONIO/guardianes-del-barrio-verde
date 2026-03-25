<template>
  <MinigameShell
    title="Identificar especies en peligro"
    description="Toca los animales en peligro de extinción en México. ¡Algunos están fuera de riesgo!"
    :completed="found"
    :total="4"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <TapDetectGame
      ref="gameRef"
      :spot-data="spots"
      :total="4"
      hint="👆 Toca los animales en peligro"
      success-label="Identificados"
      meter-label="Especies"
      target-badge="⚠️ En peligro"
      ok-badge="✅ Fuera de riesgo"
      found-emoji="🔴"
      sky-variant="nice"
      street-variant="clean"
      success-color="#ef4444"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { TapSpot } from '~/components/minigame/TapDetectGame.vue'

defineEmits<{ complete: [] }>()

const spots: TapSpot[] = [
  { id: 's1', label: 'Ajolote', emoji: '🦎', isTarget: true, x: 15, y: 30, w: 75, h: 55, message: '¡El ajolote! Solo vive en Xochimilco, CDMX. Quedan menos de 1,000 en libertad. La contaminación del agua lo amenaza.' },
  { id: 's2', label: 'Vaquita marina', emoji: '🐬', isTarget: true, x: 55, y: 20, w: 75, h: 55, message: '¡La vaquita marina! Es el mamífero marino más raro del mundo. Quedan menos de 10 en el Golfo de California.' },
  { id: 's3', label: 'Jaguar', emoji: '🐆', isTarget: true, x: 70, y: 55, w: 75, h: 55, message: '¡El jaguar! Necesita grandes selvas para vivir. La deforestación en el sureste de México destruye su hogar.' },
  { id: 's4', label: 'Lobo mexicano', emoji: '🐺', isTarget: true, x: 30, y: 60, w: 75, h: 55, message: '¡El lobo mexicano! Casi se extinguió. Hoy hay unos 200 en la Sierra Madre gracias a programas de conservación.' },
  { id: 's5', label: 'Paloma', emoji: '🐦', isTarget: false, x: 45, y: 15, w: 60, h: 50, message: 'La paloma no está en peligro. Busca a los animales que realmente necesitan ayuda en México.' },
  { id: 's6', label: 'Gorrión', emoji: '🐤', isTarget: false, x: 10, y: 55, w: 60, h: 50, message: 'Los gorriones están bien. Enfócate en las especies que están desapareciendo de nuestro país.' },
  { id: 's7', label: 'Perro callejero', emoji: '🐕', isTarget: false, x: 80, y: 35, w: 60, h: 50, message: 'Los perritos callejeros necesitan ayuda, pero no están en peligro de extinción. Busca fauna silvestre amenazada.' },
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
