<template>
  <MinigameShell
    title="Separar residuos"
    description="Cada residuo aparece uno por uno. Desliza a la izquierda si es orgánico o a la derecha si es reciclable. También puedes usar los botones."
    :completed="classified"
    :total="8"
    :is-success="gameRef?.allDone ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <SwipeClassifier
      ref="gameRef"
      :items="items"
      left-label="Orgánico"
      right-label="Reciclable"
      hint="👆 Desliza o toca un botón para clasificar"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { SwipeItem } from '~/components/minigame/SwipeClassifier.vue'

defineEmits<{ complete: [] }>()

const items: SwipeItem[] = [
  { id: 'w1', emoji: '🍌', label: 'Cáscara de plátano', detail: 'Se descompone en 2-10 días', category: 'left', message: '¡Orgánico! Las cáscaras se vuelven composta.' },
  { id: 'w2', emoji: '🧴', label: 'Botella de plástico', detail: 'Tarda 450 años en degradarse', category: 'right', message: '¡Reciclable! Una botella PET puede volverse ropa.' },
  { id: 'w3', emoji: '🥬', label: 'Restos de verdura', detail: 'Se descompone en 5-15 días', category: 'left', message: '¡Orgánico! Perfecto para la composta.' },
  { id: 'w4', emoji: '🥫', label: 'Lata de aluminio', detail: 'Tarda 200 años en degradarse', category: 'right', message: '¡Reciclable! El aluminio se recicla infinitamente.' },
  { id: 'w5', emoji: '🍎', label: 'Corazón de manzana', detail: 'Se descompone en 2 meses', category: 'left', message: '¡Orgánico! La naturaleza lo recicla solita.' },
  { id: 'w6', emoji: '📦', label: 'Caja de cartón', detail: 'Tarda 1 año en degradarse', category: 'right', message: '¡Reciclable! El cartón se recicla hasta 7 veces.' },
  { id: 'w7', emoji: '☕', label: 'Restos de café', detail: 'Se descompone en 2-3 meses', category: 'left', message: '¡Orgánico! El café usado es excelente para plantas.' },
  { id: 'w8', emoji: '🫙', label: 'Frasco de vidrio', detail: 'Tarda 4000 años en degradarse', category: 'right', message: '¡Reciclable! El vidrio se recicla al 100% sin perder calidad.' },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/SwipeClassifier.vue').default> | null>(null)
const classified = ref(0)
const showResult = ref(false)

function onStart() {
  classified.value = 0
  showResult.value = false
  nextTick(() => gameRef.value?.start())
}

function onUpdate(c: number) { classified.value = c }
function onComplete() { setTimeout(() => { showResult.value = true }, 1000) }
</script>
