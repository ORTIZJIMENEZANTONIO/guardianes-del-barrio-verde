<template>
  <MinigameShell
    title="Clasificar amenazas"
    description="Desliza cada amenaza: ¿es causada por humanos o es natural?"
    :completed="classified"
    :total="8"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <SwipeClassifier
      ref="gameRef"
      :items="items"
      left-label="👤 Humana"
      right-label="🌿 Natural"
      left-color="#ef4444"
      right-color="#22c55e"
      error-message="Fíjate bien: ¿esta amenaza la causan las personas o sucede sola en la naturaleza?"
      success-message="¡Correcto! Entender el origen de cada amenaza nos dice dónde podemos actuar."
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { SwipeItem } from '~/components/minigame/SwipeClassifier.vue'

defineEmits<{ complete: [] }>()

const items: SwipeItem[] = [
  { id: 't1', emoji: '🪓', label: 'Deforestación', category: 'left', fact: 'La tala de bosques destruye el hogar de miles de especies mexicanas.' },
  { id: 't2', emoji: '🌋', label: 'Erupciones volcánicas', category: 'right', fact: 'Los volcanes son fenómenos naturales. Los animales han convivido con ellos por miles de años.' },
  { id: 't3', emoji: '🏭', label: 'Contaminación industrial', category: 'left', fact: 'Las fábricas vierten químicos en ríos y lagos, envenenando a los animales acuáticos.' },
  { id: 't4', emoji: '🌊', label: 'Huracanes', category: 'right', fact: 'Los huracanes son naturales, pero el cambio climático los hace más fuertes y frecuentes.' },
  { id: 't5', emoji: '🪤', label: 'Caza furtiva', category: 'left', fact: 'La caza ilegal ha llevado al lobo mexicano y al jaguar al borde de la extinción.' },
  { id: 't6', emoji: '🏗️', label: 'Urbanización', category: 'left', fact: 'Construir ciudades sobre hábitats naturales desplaza a los animales de su hogar.' },
  { id: 't7', emoji: '🔥', label: 'Incendios forestales', category: 'right', fact: 'Los incendios naturales renuevan los bosques, pero los provocados por humanos son devastadores.' },
  { id: 't8', emoji: '🛍️', label: 'Tráfico de especies', category: 'left', fact: 'Vender animales exóticos como mascotas es ilegal y mata a miles de guacamayas y loros cada año.' },
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
