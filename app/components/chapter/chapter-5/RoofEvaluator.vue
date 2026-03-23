<template>
  <MinigameShell
    title="Evaluar la azotea"
    description="Toca cada zona de la azotea. Encuentra las 4 condiciones que necesitas verificar."
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
      hint="👆 Toca cada punto para inspeccionar"
      success-label="Verificadas"
      meter-label="Condiciones"
      target-badge="⚠️ Revisar"
      ok-badge="✅ OK"
      found-emoji="✅"
      sky-variant="hot"
      street-variant="normal"
      success-color="#f59e0b"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { TapSpot } from '~/components/minigame/TapDetectGame.vue'

defineEmits<{ complete: [] }>()

const spots: TapSpot[] = [
  { id: 's1', label: 'Carga del techo', emoji: '🏗️', isTarget: true, x: 8, y: 25, w: 80, h: 60, message: 'Hay que verificar que la estructura aguante el peso de tierra, plantas y agua. ¡Entre 60 y 150 kg por m²!' },
  { id: 's2', label: 'Exposición solar', emoji: '☀️', isTarget: true, x: 55, y: 15, w: 75, h: 55, message: 'Esta zona recibe sol directo todo el día. Necesitamos plantas que aguanten el calor y crear zonas de sombra.' },
  { id: 's3', label: 'Acceso al agua', emoji: '🚰', isTarget: true, x: 65, y: 55, w: 70, h: 55, message: 'Hay una toma de agua cerca. Podemos conectar un sistema de captación de lluvia para regar sin desperdiciar.' },
  { id: 's4', label: 'Drenaje', emoji: '🕳️', isTarget: true, x: 30, y: 65, w: 75, h: 55, message: 'El desagüe necesita estar libre. Si se tapa, el agua se acumula y puede dañar la estructura.' },
  { id: 's5', label: 'Muro perimetral', emoji: '🧱', isTarget: false, x: 10, y: 55, w: 65, h: 50, message: 'Esta parte de la azotea se ve bien. 💡 Busca las zonas que necesitan revisión: peso, sol, agua y drenaje.' },
  { id: 's6', label: 'Antena', emoji: '📡', isTarget: false, x: 40, y: 10, w: 60, h: 50, message: 'Esta parte de la azotea se ve bien. 💡 Busca las zonas que necesitan revisión: peso, sol, agua y drenaje.' },
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
