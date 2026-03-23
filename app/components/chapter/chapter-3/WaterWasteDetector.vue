<template>
  <MinigameShell
    title="Detectar desperdicios de agua"
    description="Hay agua desperdiciandose por todo el barrio. Toca cada zona para revisar si hay desperdicio. Encuentra los 4 puntos donde se pierde agua."
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
      hint="👆 Toca cada zona para revisar si hay desperdicio de agua"
      success-label="Encontrados"
      meter-label="Desperdicios"
      target-badge="💧 Desperdicio"
      ok-badge="✅ OK"
      found-emoji="💧"
      sky-variant="nice"
      street-variant="dirty"
      success-color="#3b82f6"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { TapSpot } from '~/components/minigame/TapDetectGame.vue'

defineEmits<{ complete: [] }>()

const spots: TapSpot[] = [
  { id: 'w1', label: 'Llave abierta', emoji: '🚰', isTarget: true, x: 10, y: 20, w: 75, h: 55, message: 'Una llave goteando puede desperdiciar hasta 30 litros al dia.' },
  { id: 'w2', label: 'Manguera regando', emoji: '🪴', isTarget: true, x: 55, y: 15, w: 70, h: 55, message: 'Regar con manguera al mediodia desperdicia agua. Mejor regar temprano o con cubeta.' },
  { id: 'w3', label: 'Tuberia rota', emoji: '🔧', isTarget: true, x: 35, y: 55, w: 80, h: 55, message: 'Una fuga en la tuberia puede perder miles de litros al mes sin que nadie lo note.' },
  { id: 'w4', label: 'Charco en banqueta', emoji: '💧', isTarget: true, x: 70, y: 60, w: 70, h: 50, message: 'Un charco constante indica una fuga subterranea. Hay que reportarlo.' },
  { id: 'ok1', label: 'Tinaco', emoji: '🏗️', isTarget: false, x: 75, y: 10, w: 60, h: 50, message: 'El tinaco esta bien cerrado. Asi se conserva el agua limpia.' },
  { id: 'ok2', label: 'Captador de lluvia', emoji: '🌧️', isTarget: false, x: 5, y: 55, w: 65, h: 50, message: 'Un sistema de captacion de lluvia aprovecha el agua sin desperdiciar.' },
  { id: 'ok3', label: 'Cisterna', emoji: '🧱', isTarget: false, x: 40, y: 30, w: 60, h: 50, message: 'La cisterna esta sellada correctamente. El agua se mantiene limpia.' },
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
