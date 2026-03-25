<template>
  <MinigameShell
    title="Decisiones de conservación"
    description="¿Qué acciones ayudan a conservar la fauna mexicana? Responde rápido."
    :completed="answered"
    :total="5"
    :is-success="gameRef?.isComplete ?? false"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="onStart"
  >
    <QuickQuiz
      ref="gameRef"
      :questions="questions"
      :time-per-question="15"
      accent-color="#ef4444"
      error-message="Piensa en acciones que protejan el hábitat natural y no dañen a los animales."
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
    question: '¿Qué puedes hacer para ayudar al ajolote?',
    options: [
      { id: 'q1a', text: 'No tirar basura en ríos y canales', correct: true },
      { id: 'q1b', text: 'Capturar uno como mascota', correct: false },
      { id: 'q1c', text: 'Ignorar la contaminación del agua', correct: false },
    ],
    explanation: 'Mantener el agua limpia es vital para el ajolote. Solo vive en Xochimilco.',
  },
  {
    id: 'q2',
    question: '¿Cómo ayudamos a la vaquita marina?',
    options: [
      { id: 'q2a', text: 'Usando más redes de pesca', correct: false },
      { id: 'q2b', text: 'Apoyando la pesca sustentable y sin redes ilegales', correct: true },
      { id: 'q2c', text: 'Llevándola a un zoológico', correct: false },
    ],
    explanation: 'Las redes ilegales de totoaba atrapan y matan a las vaquitas. La pesca sustentable las protege.',
  },
  {
    id: 'q3',
    question: '¿Qué protege mejor al jaguar?',
    options: [
      { id: 'q3a', text: 'Talar la selva para sembrar', correct: false },
      { id: 'q3b', text: 'Crear áreas naturales protegidas', correct: true },
      { id: 'q3c', text: 'Construir carreteras en la selva', correct: false },
    ],
    explanation: 'Las reservas naturales protegen el hogar del jaguar y conectan sus territorios.',
  },
  {
    id: 'q4',
    question: '¿Qué ayuda a la mariposa monarca?',
    options: [
      { id: 'q4a', text: 'Sembrar plantas de algodoncillo (asclepias)', correct: true },
      { id: 'q4b', text: 'Usar muchos pesticidas en el jardín', correct: false },
      { id: 'q4c', text: 'Cortar los árboles de oyamel', correct: false },
    ],
    explanation: 'El algodoncillo es la única planta donde la monarca pone sus huevos. Sin ella, no sobreviven.',
  },
  {
    id: 'q5',
    question: '¿Qué acción cotidiana ayuda más a la fauna?',
    options: [
      { id: 'q5a', text: 'Comprar animales exóticos', correct: false },
      { id: 'q5b', text: 'No hacer nada, no es mi problema', correct: false },
      { id: 'q5c', text: 'Cuidar áreas verdes y no comprar fauna silvestre', correct: true },
    ],
    explanation: 'No comprar animales silvestres y cuidar los espacios verdes ayuda a todas las especies.',
  },
]

const gameRef = ref<InstanceType<typeof import('~/components/minigame/QuickQuiz.vue').default> | null>(null)
const answered = ref(0)
const showResult = ref(false)

function onStart() {
  answered.value = 0
  showResult.value = false
  nextTick(() => gameRef.value?.start())
}

function onUpdate(a: number) { answered.value = a }
function onComplete() { setTimeout(() => { showResult.value = true }, 1000) }
</script>
