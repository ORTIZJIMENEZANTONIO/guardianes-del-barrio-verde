<template>
  <MinigameShell
    title="Detectar puntos de calor"
    description="Toca las superficies de la calle. Encuentra los 3 puntos más calientes."
    :completed="hotSpotsFound"
    :total="3"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="heat-game">
      <SceneSky variant="hot" />
      <SceneStreet variant="dirty" />
      <!-- Hint banner -->
      <div class="game-hint">
        👆 Toca cada zona para medir · Calientes: {{ hotSpotsFound }}/3
      </div>
      <div class="street-scene">
        <div
          v-for="spot in spots"
          :key="spot.id"
          class="heat-spot"
          :class="{
            'heat-spot--tapped': spot.tapped,
            'heat-spot--hot': spot.tapped && spot.isHot,
            'heat-spot--cool': spot.tapped && !spot.isHot,
          }"
          :style="{ left: spot.x + '%', top: spot.y + '%', width: spot.w + 'px', height: spot.h + 'px' }"
          @click="tapSpot(spot)"
        >
          <span class="heat-spot__icon">{{ spot.emoji }}</span>
          <span class="heat-spot__label">{{ spot.label }}</span>
          <div v-if="spot.tapped" class="heat-spot__temp">
            {{ spot.temp }}°C
          </div>
        </div>
      </div>

      <!-- Temperature gauge -->
      <div class="temp-gauge">
        <div class="gauge-label">Termómetro</div>
        <div class="gauge-bar">
          <div class="gauge-fill" :style="{ height: gaugePercent + '%', background: gaugeColor }" />
        </div>
        <div class="gauge-value" :style="{ color: gaugeColor }">{{ currentTemp ? currentTemp + '°C' : '--' }}</div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="heat-feedback" :class="feedback.type === 'hot' ? 'feedback--hot' : 'feedback--cool'">
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

interface HeatSpot {
  id: string
  label: string
  emoji: string
  temp: number
  isHot: boolean
  x: number
  y: number
  w: number
  h: number
  tapped: boolean
  message: string
}

const allSpots: HeatSpot[] = [
  { id: 's1', label: 'Pavimento', emoji: '🟫', temp: 58, isHot: true, x: 10, y: 60, w: 80, h: 60, tapped: false, message: '¡El pavimento sin sombra alcanza 58°C!' },
  { id: 's2', label: 'Techo bajo', emoji: '🏠', temp: 52, isHot: true, x: 60, y: 15, w: 70, h: 55, tapped: false, message: 'Los techos absorben mucho calor.' },
  { id: 's3', label: 'Banca metal', emoji: '🪑', temp: 55, isHot: true, x: 40, y: 50, w: 65, h: 50, tapped: false, message: '¡La banca metálica quema al sol!' },
  { id: 's4', label: 'Sombra', emoji: '🌤️', temp: 32, isHot: false, x: 75, y: 45, w: 65, h: 50, tapped: false, message: 'La sombra baja la temperatura.' },
  { id: 's5', label: 'Pared', emoji: '🧱', temp: 45, isHot: false, x: 5, y: 20, w: 60, h: 55, tapped: false, message: 'Las paredes acumulan algo de calor.' },
  { id: 's6', label: 'Maceta', emoji: '🪴', temp: 28, isHot: false, x: 50, y: 70, w: 55, h: 50, tapped: false, message: 'Las plantas ayudan a enfriar.' },
]

const spots = ref<HeatSpot[]>([])
const hotSpotsFound = ref(0)
const isComplete = computed(() => hotSpotsFound.value >= 3)
const showResult = ref(false)
const currentTemp = ref<number | null>(null)
const feedback = ref<{ message: string; type: 'hot' | 'cool' } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

const gaugePercent = computed(() => {
  if (!currentTemp.value) return 0
  return Math.min(100, ((currentTemp.value - 20) / 45) * 100)
})

const gaugeColor = computed(() => {
  if (!currentTemp.value) return '#ccc'
  if (currentTemp.value >= 50) return '#f94144'
  if (currentTemp.value >= 40) return '#f8961e'
  if (currentTemp.value >= 30) return '#f9c74f'
  return '#52b788'
})

function onStart() {
  spots.value = allSpots.map(s => ({ ...s }))
}

function tapSpot(spot: HeatSpot) {
  if (spot.tapped) return
  spot.tapped = true
  currentTemp.value = spot.temp

  if (spot.isHot) {
    hotSpotsFound.value++
    showFeedback(spot.message, 'hot')
    // Shake screen for heat effect
    const gameEl = document.querySelector('.heat-game')
    if (gameEl) shakeWrong(gameEl)
  } else {
    showFeedback(spot.message, 'cool')
  }

  if (isComplete.value) {
    const gameEl = document.querySelector('.heat-game')
    if (gameEl) confettiBurst(gameEl, 16)
    setTimeout(() => { showResult.value = true }, 1000)
  }
}

function showFeedback(message: string, type: 'hot' | 'cool') {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, type }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  spots.value = allSpots.map(s => ({ ...s }))
  hotSpotsFound.value = 0
  currentTemp.value = null
  showResult.value = false
}
</script>

<style scoped>
.heat-game {
  width: 100%;
  height: 100%;
  display: flex;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.street-scene {
  flex: 1;
  position: relative;
  z-index: 5;
}

.heat-spot {
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
  transition: background var(--transition-fast), border-color var(--transition-fast);
  will-change: transform;
}

.heat-spot:active { transform: scale(0.95); }

.heat-spot--tapped { cursor: default; }

.heat-spot--hot {
  background: rgba(249,65,68,0.3);
  border-color: var(--color-coral);
  animation: heatWave 2s infinite;
}

.heat-spot--cool {
  background: rgba(82,183,136,0.3);
  border-color: var(--color-green-light);
}

.heat-spot__icon { font-size: 24px; }
.heat-spot__label { font-size: 10px; font-weight: 800; color: var(--color-text); }
.heat-spot__temp {
  font-size: 14px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  animation: scaleIn 0.3s ease;
}

.temp-gauge {
  width: 60px;
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

.gauge-label { font-size: 10px; font-weight: 800; color: var(--color-text); }

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
}

.gauge-value { font-size: 14px; font-weight: 800; color: var(--color-text); }

/* feedback position handled by .game-feedback */

.feedback--hot { background: rgba(249,65,68,0.9); color: white; }
.feedback--cool { background: rgba(82,183,136,0.9); color: white; }
</style>
