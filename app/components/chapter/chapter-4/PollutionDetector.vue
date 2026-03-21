<template>
  <MinigameShell
    title="Detectar contaminación"
    description="Explora la calle y encuentra los 4 focos de contaminación."
    :completed="pollutionFound"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="pollution-game">
      <SceneSky variant="hot" />
      <SceneStreet variant="dirty" />

      <div class="street-scene">
        <div
          v-for="spot in spots"
          :key="spot.id"
          class="pollution-spot"
          :class="{
            'pollution-spot--tapped': spot.tapped,
            'pollution-spot--bad': spot.tapped && spot.isPollution,
            'pollution-spot--ok': spot.tapped && !spot.isPollution,
          }"
          :style="{ left: spot.x + '%', top: spot.y + '%', width: spot.w + 'px', height: spot.h + 'px' }"
          @click="tapSpot(spot)"
        >
          <span class="pollution-spot__icon">{{ spot.emoji }}</span>
          <span class="pollution-spot__label">{{ spot.label }}</span>
          <div v-if="spot.tapped" class="pollution-spot__badge">
            {{ spot.isPollution ? '⚠️' : '✅' }}
          </div>
        </div>
      </div>

      <!-- Danger gauge -->
      <div class="danger-gauge">
        <div class="gauge-label">Contaminación</div>
        <div class="gauge-bar">
          <div class="gauge-fill" :style="{ height: gaugePercent + '%' }" />
        </div>
        <div class="gauge-value">{{ pollutionFound }}/4</div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="pollution-feedback" :class="feedback.type === 'bad' ? 'feedback--bad' : 'feedback--ok'">
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

interface PollutionSpot {
  id: string
  label: string
  emoji: string
  isPollution: boolean
  x: number
  y: number
  w: number
  h: number
  tapped: boolean
  message: string
}

const allSpots: PollutionSpot[] = [
  { id: 's1', label: 'Suelo manchado', emoji: '🟤', isPollution: true, x: 10, y: 60, w: 80, h: 60, tapped: false,
    message: 'Lixiviado: el suelo absorbe los tóxicos de la basura podrida.' },
  { id: 's2', label: 'Coladera tapada', emoji: '🕳️', isPollution: true, x: 55, y: 55, w: 70, h: 55, tapped: false,
    message: 'La basura tapa las coladeras y provoca inundaciones.' },
  { id: 's3', label: 'Quema de basura', emoji: '🔥', isPollution: true, x: 35, y: 18, w: 65, h: 55, tapped: false,
    message: 'Quemar basura libera gases tóxicos que dañan los pulmones.' },
  { id: 's4', label: 'Tiradero ilegal', emoji: '🗑️', isPollution: true, x: 75, y: 30, w: 70, h: 55, tapped: false,
    message: 'Un tiradero clandestino contamina suelo, agua y aire.' },
  { id: 's5', label: 'Jardín limpio', emoji: '🌺', isPollution: false, x: 5, y: 25, w: 60, h: 50, tapped: false,
    message: 'Este lugar se ve bien, no hay contaminación aquí. 💡 Busca zonas con basura acumulada, agua sucia o tierra dañada.' },
  { id: 's6', label: 'Fuente activa', emoji: '⛲', isPollution: false, x: 45, y: 70, w: 60, h: 50, tapped: false,
    message: 'Este lugar se ve bien, no hay contaminación aquí. 💡 Busca zonas con basura acumulada, agua sucia o tierra dañada.' },
  { id: 's7', label: 'Pared pintada', emoji: '🎨', isPollution: false, x: 60, y: 10, w: 55, h: 50, tapped: false,
    message: 'Este lugar se ve bien, no hay contaminación aquí. 💡 Busca zonas con basura acumulada, agua sucia o tierra dañada.' },
]

const spots = ref<PollutionSpot[]>([])
const pollutionFound = ref(0)
const isComplete = computed(() => pollutionFound.value >= 4)
const showResult = ref(false)
const feedback = ref<{ message: string; type: 'bad' | 'ok' } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

const gaugePercent = computed(() => {
  return (pollutionFound.value / 4) * 100
})

function onStart() {
  spots.value = allSpots.map(s => ({ ...s }))
}

function tapSpot(spot: PollutionSpot) {
  if (spot.tapped) return
  spot.tapped = true

  if (spot.isPollution) {
    pollutionFound.value++
    showFeedback(spot.message, 'bad')
    // Shake screen for pollution effect
    const gameEl = document.querySelector('.pollution-game')
    if (gameEl) shakeWrong(gameEl)
  } else {
    showFeedback(spot.message, 'ok')
  }

  if (isComplete.value) {
    const gameEl = document.querySelector('.pollution-game')
    if (gameEl) confettiBurst(gameEl, 16)
    setTimeout(() => { showResult.value = true }, 1000)
  }
}

function showFeedback(message: string, type: 'bad' | 'ok') {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, type }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 2000)
}

function resetGame() {
  spots.value = allSpots.map(s => ({ ...s }))
  pollutionFound.value = 0
  showResult.value = false
}
</script>

<style scoped>
.pollution-game {
  width: 100%;
  height: 100%;
  display: flex;
  background: transparent;
  position: relative;
}

.street-scene {
  flex: 1;
  position: relative;
  z-index: 5;
}

.pollution-spot {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px dashed rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pollution-spot:active { transform: scale(0.95); }

.pollution-spot--tapped { cursor: default; }

.pollution-spot--bad {
  background: rgba(249, 115, 22, 0.3);
  border-color: #f97316;
  animation: heatWave 2s infinite;
}

.pollution-spot--ok {
  background: rgba(82, 183, 136, 0.3);
  border-color: var(--color-green-light);
}

.pollution-spot__icon { font-size: 24px; }
.pollution-spot__label { font-size: 10px; font-weight: 800; color: var(--color-text); }
.pollution-spot__badge {
  font-size: 18px;
  animation: scaleIn 0.3s ease;
}

/* Danger gauge */
.danger-gauge {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.9);
  gap: 6px;
  z-index: 5;
  position: relative;
}

.gauge-label { font-size: 10px; font-weight: 800; color: var(--color-text); text-align: center; }

.gauge-bar {
  flex: 1;
  width: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
}

.gauge-fill {
  width: 100%;
  border-radius: 10px;
  transition: all 0.5s ease;
  background: linear-gradient(to top, #f97316, #ef4444);
}

.gauge-value { font-size: 14px; font-weight: 800; color: #f97316; }

/* Feedback */
.pollution-feedback {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  max-width: 280px;
  text-align: center;
  animation: slideUp 0.3s ease;
  z-index: 5;
}

.feedback--bad { background: rgba(249, 115, 22, 0.9); color: white; }
.feedback--ok { background: rgba(82, 183, 136, 0.9); color: white; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
