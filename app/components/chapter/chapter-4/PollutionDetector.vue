<template>
  <MinigameShell
    title="Detectar contaminación"
    description="Toca cada zona del barrio para revisar. Encuentra los 4 puntos de contaminación."
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
      hint="👆 Toca cada zona para investigar"
      success-label="Contaminantes"
      meter-label="Peligro"
      target-badge="⚠️ Contaminado"
      ok-badge="✅ Limpio"
      found-emoji="⚠️"
      sky-variant="hot"
      street-variant="dirty"
      success-color="#f97316"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { TapSpot } from '~/components/minigame/TapDetectGame.vue'

defineEmits<{ complete: [] }>()

const spots: TapSpot[] = [
  { id: 'p1', label: 'Drenaje abierto', emoji: '🕳️', isTarget: true, x: 15, y: 55, w: 75, h: 55, message: 'Un drenaje sin tapa contamina el suelo y es peligroso para los peatones.' },
  { id: 'p2', label: 'Aceite en piso', emoji: '🛢️', isTarget: true, x: 50, y: 65, w: 70, h: 50, message: 'El aceite de motor contamina el agua y el suelo. Un litro puede contaminar mil litros de agua.' },
  { id: 'p3', label: 'Humo de taller', emoji: '💨', isTarget: true, x: 60, y: 15, w: 70, h: 55, message: 'El humo de talleres mecánicos contamina el aire del barrio.' },
  { id: 'p4', label: 'Basura quemada', emoji: '🔥', isTarget: true, x: 10, y: 25, w: 65, h: 50, message: 'Quemar basura libera gases tóxicos que dañan la salud de todos.' },
  { id: 'ok1', label: 'Jardinera', emoji: '🌿', isTarget: false, x: 40, y: 40, w: 60, h: 50, message: 'Las jardineras ayudan a filtrar el aire y retener agua.' },
  { id: 'ok2', label: 'Bici estacionada', emoji: '🚲', isTarget: false, x: 75, y: 45, w: 55, h: 45, message: 'El transporte en bicicleta no contamina. ¡Bien por el ciclista!' },
  { id: 'ok3', label: 'Tienda local', emoji: '🏪', isTarget: false, x: 30, y: 10, w: 60, h: 50, message: 'Comprar en tiendas locales reduce el transporte y la contaminación.' },
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
