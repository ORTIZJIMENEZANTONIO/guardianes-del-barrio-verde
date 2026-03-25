<template>
  <MinigameShell
    title="Decisiones sobre el agua"
    description="Se presentan 5 situaciones reales. Tienes pocos segundos para elegir la mejor acción. ¡Elige rápido!"
    :completed="correct"
    :total="5"
    :is-success="gameRef?.allDone ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <QuickQuiz
      ref="gameRef"
      :questions="questions"
      :time-per-question="12"
      @complete="onComplete"
      @update="onUpdate"
    />
  </MinigameShell>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '~/components/minigame/QuickQuiz.vue'

defineEmits<{ complete: [] }>()

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    emoji: '🚰',
    scenario: 'Ves una llave goteando en la calle. ¿Qué haces?',
    options: [
      { id: 'q1a', emoji: '🔧', label: 'Intentar cerrarla', correct: true, message: '¡Sí! Una llave goteando pierde hasta 30 litros al día.' },
      { id: 'q1b', emoji: '🚶', label: 'Seguir caminando', correct: false, message: 'Cada gota cuenta. Ignorar una fuga es desperdiciar agua.' },
      { id: 'q1c', emoji: '🪣', label: 'Poner una cubeta', correct: false, message: 'La cubeta ayuda, pero lo mejor es cerrar la llave o reportar.' },
    ],
  },
  {
    id: 'q2',
    emoji: '🌧️',
    scenario: 'Está lloviendo mucho. ¿Cómo aprovechar el agua?',
    options: [
      { id: 'q2a', emoji: '🏠', label: 'Cerrar todo', correct: false, message: 'El agua de lluvia es un recurso valioso que se puede captar.' },
      { id: 'q2b', emoji: '🪣', label: 'Captar agua de lluvia', correct: true, message: '¡Exacto! El agua de lluvia sirve para regar, limpiar y más.' },
    ],
  },
  {
    id: 'q3',
    emoji: '🪴',
    scenario: 'Son las 2 de la tarde y las plantas necesitan agua. ¿Cuándo riegas?',
    options: [
      { id: 'q3a', emoji: '☀️', label: 'Ahora mismo', correct: false, message: 'A mediodía el agua se evapora rápido. Se desperdicia hasta el 60%.' },
      { id: 'q3b', emoji: '🌅', label: 'Esperar al atardecer', correct: true, message: '¡Correcto! Regar temprano o al atardecer evita la evaporación.' },
    ],
  },
  {
    id: 'q4',
    emoji: '🧽',
    scenario: 'Vas a lavar los trastes. ¿Cuál es la mejor forma?',
    options: [
      { id: 'q4a', emoji: '🚰', label: 'Con la llave abierta', correct: false, message: 'La llave abierta gasta hasta 100 litros. Mejor usar una tina.' },
      { id: 'q4b', emoji: '🪣', label: 'En una tina con jabón', correct: true, message: '¡Correcto! Lavar en tina ahorra hasta un 70% de agua.' },
      { id: 'q4c', emoji: '🤷', label: 'No lavarlos', correct: false, message: 'La higiene importa. Pero se puede ahorrar agua al lavar.' },
    ],
  },
  {
    id: 'q5',
    emoji: '💧',
    scenario: 'Descubres un charco que nunca se seca en tu calle. ¿Qué haces?',
    options: [
      { id: 'q5a', emoji: '📱', label: 'Reportar al municipio', correct: true, message: '¡Bien! Un charco permanente indica una fuga subterránea que hay que reparar.' },
      { id: 'q5b', emoji: '🏃', label: 'Brincar el charco', correct: false, message: 'Ignorar una fuga subterránea puede desperdiciar miles de litros al mes.' },
    ],
  },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/QuickQuiz.vue').default> | null>(null)
const correct = ref(0)
const showResult = ref(false)

function onStart() {
  correct.value = 0
  showResult.value = false
  nextTick(() => gameRef.value?.start())
}

function onUpdate(c: number) { correct.value = c }
function onComplete() { setTimeout(() => { showResult.value = true }, 1000) }
</script>
