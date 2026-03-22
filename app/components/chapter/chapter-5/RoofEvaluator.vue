<template>
  <MinigameShell
    title="Evaluar la azotea"
    description="Toca cada zona de la azotea. Encuentra las 4 condiciones que necesitas verificar."
    :completed="conditionsFound"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="eval-game">
      <SceneSky variant="hot" />
      <SceneStreet variant="normal" />
      <div class="game-hint">
        👆 Toca cada punto para inspeccionar · Verificadas: {{ conditionsFound }}/4
      </div>
      <div class="roof-scene">
        <div
          v-for="spot in spots"
          :key="spot.id"
          class="eval-spot game-zone"
          :class="{
            'eval-spot--tapped': spot.tapped,
            'eval-spot--critical game-zone--filled': spot.tapped && spot.isCritical,
            'eval-spot--ok game-zone--filled': spot.tapped && !spot.isCritical,
          }"
          :style="{ left: spot.x + '%', top: spot.y + '%', width: spot.w + 'px', height: spot.h + 'px' }"
          @click="tapSpot(spot)"
        >
          <span class="eval-spot__icon game-zone__icon">{{ spot.emoji }}</span>
          <span class="eval-spot__label game-zone__label">{{ spot.label }}</span>
          <div v-if="spot.tapped" class="eval-spot__status">
            {{ spot.isCritical ? '⚠️ Revisar' : '✅ OK' }}
          </div>
        </div>
      </div>

      <!-- Progress indicator -->
      <div class="eval-progress">
        <div class="progress-label">Condiciones verificadas</div>
        <div class="progress-dots">
          <span v-for="i in 4" :key="i" class="progress-dot" :class="{ 'progress-dot--filled': i <= conditionsFound }">
            {{ i <= conditionsFound ? '✅' : '⬜' }}
          </span>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="eval-feedback game-feedback" :class="feedback.critical ? 'feedback--critical game-feedback--ok' : 'feedback--ok game-feedback--ok'">
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

const emit = defineEmits<{
  complete: []
}>()

const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface EvalSpot {
  id: string
  label: string
  emoji: string
  isCritical: boolean
  x: number
  y: number
  w: number
  h: number
  tapped: boolean
  message: string
}

const allSpots: EvalSpot[] = [
  { id: 's1', label: 'Carga del techo', emoji: '🏗️', isCritical: true, x: 8, y: 25, w: 80, h: 60, tapped: false, message: 'Hay que verificar que la estructura aguante el peso de tierra, plantas y agua. ¡Entre 60 y 150 kg por m²!' },
  { id: 's2', label: 'Exposición solar', emoji: '☀️', isCritical: true, x: 55, y: 15, w: 75, h: 55, tapped: false, message: 'Esta zona recibe sol directo todo el día. Necesitamos plantas que aguanten el calor y crear zonas de sombra.' },
  { id: 's3', label: 'Acceso al agua', emoji: '🚰', isCritical: true, x: 65, y: 55, w: 70, h: 55, tapped: false, message: 'Hay una toma de agua cerca. Podemos conectar un sistema de captación de lluvia para regar sin desperdiciar.' },
  { id: 's4', label: 'Drenaje', emoji: '🕳️', isCritical: true, x: 30, y: 65, w: 75, h: 55, tapped: false, message: 'El desagüe necesita estar libre. Si se tapa, el agua se acumula y puede dañar la estructura.' },
  { id: 's5', label: 'Muro perimetral', emoji: '🧱', isCritical: false, x: 10, y: 55, w: 65, h: 50, tapped: false, message: 'Esta parte de la azotea se ve bien. 💡 Busca las zonas que necesitan revisión: peso, sol, agua y drenaje.' },
  { id: 's6', label: 'Antena', emoji: '📡', isCritical: false, x: 40, y: 10, w: 60, h: 50, tapped: false, message: 'Esta parte de la azotea se ve bien. 💡 Busca las zonas que necesitan revisión: peso, sol, agua y drenaje.' },
]

const spots = ref<EvalSpot[]>([])
const conditionsFound = ref(0)
const isComplete = computed(() => conditionsFound.value >= 4)
const showResult = ref(false)
const feedback = ref<{ message: string; critical: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function onStart() {
  spots.value = allSpots.map(s => ({ ...s }))
}

function tapSpot(spot: EvalSpot) {
  if (spot.tapped) return
  spot.tapped = true

  if (spot.isCritical) {
    conditionsFound.value++
    showFeedback(spot.message, true)
    const gameEl = document.querySelector('.eval-game')
    if (gameEl) {
      const spotEl = document.querySelector(`[class*="eval-spot--critical"]`)
      if (spotEl) celebrateSuccess(spotEl)
    }
  } else {
    showFeedback(spot.message, false)
  }

  if (isComplete.value) {
    const gameEl = document.querySelector('.eval-game')
    if (gameEl) confettiBurst(gameEl, 16)
    setTimeout(() => { showResult.value = true }, 1000)
  }
}

function showFeedback(message: string, critical: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, critical }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  spots.value = allSpots.map(s => ({ ...s }))
  conditionsFound.value = 0
  showResult.value = false
}
</script>

<style scoped>
.eval-game {
  width: 100%;
  height: 100%;
  display: flex;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.roof-scene {
  flex: 1;
  position: relative;
  z-index: 5;
}

.eval-spot {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(255,255,255,0.6);
  border: 2px dashed rgba(0,0,0,0.25);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.eval-spot:active { transform: scale(0.95); }

.eval-spot--tapped { cursor: default; }

.eval-spot--critical {
  background: rgba(251,191,36,0.3);
  border-color: #f59e0b;
  animation: criticalPulse 2s infinite;
}

.eval-spot--ok {
  background: rgba(82,183,136,0.3);
  border-color: var(--color-green-light);
}

.eval-spot__icon { font-size: 24px; }
.eval-spot__label { font-size: 10px; font-weight: 800; color: var(--color-text); }
.eval-spot__status {
  font-size: 12px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  animation: scaleIn 0.3s ease;
}

@keyframes criticalPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.3); }
  50% { box-shadow: 0 0 12px 4px rgba(245,158,11,0.4); }
}

.eval-progress {
  width: 70px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: rgba(255,255,255,0.9);
  gap: 6px;
  z-index: 5;
  position: relative;
}

.progress-label { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; }

.progress-dots {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.progress-dot { font-size: 18px; transition: all 0.3s ease; }
.progress-dot--filled { animation: scaleIn 0.3s ease; }

/* feedback position handled by .game-feedback */

.feedback--critical { background: rgba(245,158,11,0.95); color: white; }
.feedback--ok { background: rgba(82,183,136,0.9); color: white; }

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
