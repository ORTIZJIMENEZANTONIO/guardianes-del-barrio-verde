<template>
  <MinigameShell
    title="Detectar desperdicios de agua"
    description="Hay agua desperdiciandose por todo el barrio. Toca cada zona para revisar si hay desperdicio. Encuentra los 4 puntos donde se pierde agua."
    :completed="wastesFound"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="detect-game">
      <SceneSky variant="nice" />
      <SceneStreet variant="dirty" />

      <div class="game-hint">
        👆 Toca cada zona para revisar si hay desperdicio de agua · Encontrados: {{ wastesFound }}/4
      </div>

      <div class="detect-scene">
        <div
          v-for="spot in spots"
          :key="spot.id"
          class="detect-spot game-zone"
          :class="{
            'detect-spot--tapped': spot.tapped,
            'detect-spot--waste game-zone--filled': spot.tapped && spot.isWaste,
            'detect-spot--ok': spot.tapped && !spot.isWaste,
          }"
          :style="{ left: spot.x + '%', top: spot.y + '%', width: spot.w + 'px', height: spot.h + 'px' }"
          @click="tapSpot(spot)"
        >
          <span class="detect-spot__icon game-zone__icon">{{ spot.emoji }}</span>
          <span class="detect-spot__label game-zone__label">{{ spot.label }}</span>
          <div v-if="spot.tapped" class="detect-spot__badge">
            {{ spot.isWaste ? '💧 Desperdicio' : '✅ OK' }}
          </div>
        </div>
      </div>

      <!-- Water waste meter -->
      <div class="waste-meter">
        <div class="meter-label">Desperdicios</div>
        <div class="meter-dots">
          <span v-for="i in 4" :key="i" class="meter-dot" :class="{ 'meter-dot--found': i <= wastesFound }">
            {{ i <= wastesFound ? '💧' : '⬜' }}
          </span>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="detect-feedback game-feedback" :class="feedback.isWaste ? 'game-feedback--ok' : 'game-feedback--no'">
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

const emit = defineEmits<{ complete: [] }>()
const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface DetectSpot {
  id: string
  label: string
  emoji: string
  isWaste: boolean
  x: number
  y: number
  w: number
  h: number
  tapped: boolean
  message: string
}

const allSpots: DetectSpot[] = [
  { id: 'w1', label: 'Llave abierta', emoji: '🚰', isWaste: true, x: 10, y: 20, w: 75, h: 55, tapped: false,
    message: 'Una llave goteando puede desperdiciar hasta 30 litros al dia.' },
  { id: 'w2', label: 'Manguera regando', emoji: '🪴', isWaste: true, x: 55, y: 15, w: 70, h: 55, tapped: false,
    message: 'Regar con manguera al mediodia desperdicia agua. Mejor regar temprano o con cubeta.' },
  { id: 'w3', label: 'Tuberia rota', emoji: '🔧', isWaste: true, x: 35, y: 55, w: 80, h: 55, tapped: false,
    message: 'Una fuga en la tuberia puede perder miles de litros al mes sin que nadie lo note.' },
  { id: 'w4', label: 'Charco en banqueta', emoji: '💧', isWaste: true, x: 70, y: 60, w: 70, h: 50, tapped: false,
    message: 'Un charco constante indica una fuga subterranea. Hay que reportarlo.' },
  { id: 'ok1', label: 'Tinaco', emoji: '🏗️', isWaste: false, x: 75, y: 10, w: 60, h: 50, tapped: false,
    message: 'El tinaco esta bien cerrado. Asi se conserva el agua limpia.' },
  { id: 'ok2', label: 'Captador de lluvia', emoji: '🌧️', isWaste: false, x: 5, y: 55, w: 65, h: 50, tapped: false,
    message: 'Un sistema de captacion de lluvia aprovecha el agua sin desperdiciar.' },
  { id: 'ok3', label: 'Cisterna', emoji: '🧱', isWaste: false, x: 40, y: 30, w: 60, h: 50, tapped: false,
    message: 'La cisterna esta sellada correctamente. El agua se mantiene limpia.' },
]

const spots = ref<DetectSpot[]>([])
const wastesFound = ref(0)
const isComplete = computed(() => wastesFound.value >= 4)
const showResult = ref(false)
const feedback = ref<{ message: string; isWaste: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function onStart() {
  spots.value = allSpots.map(s => ({ ...s }))
  wastesFound.value = 0
}

function tapSpot(spot: DetectSpot) {
  if (spot.tapped) return
  spot.tapped = true

  if (spot.isWaste) {
    wastesFound.value++
    showFeedback(spot.message, true)
    nextTick(() => {
      const el = document.querySelector('.detect-spot--waste:last-of-type')
      if (el) celebrateSuccess(el)
    })
  } else {
    showFeedback(spot.message, false)
  }

  if (isComplete.value) {
    const gameEl = document.querySelector('.detect-game')
    if (gameEl) confettiBurst(gameEl, 16)
    setTimeout(() => { showResult.value = true }, 1000)
  }
}

function showFeedback(message: string, isWaste: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, isWaste }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  spots.value = allSpots.map(s => ({ ...s }))
  wastesFound.value = 0
  showResult.value = false
}
</script>

<style scoped>
.detect-game {
  width: 100%;
  height: 100%;
  display: flex;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.detect-scene {
  flex: 1;
  position: relative;
  z-index: 5;
}

.detect-spot {
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

.detect-spot:active { transform: scale(0.95); }
.detect-spot--tapped { cursor: default; }

.detect-spot--waste {
  background: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
  border-style: solid;
  animation: wastePulse 2s infinite;
}

.detect-spot--ok {
  background: rgba(82, 183, 136, 0.3);
  border-color: var(--color-green-light);
  border-style: solid;
}

.detect-spot__icon { font-size: 24px; }
.detect-spot__label { font-size: 10px; font-weight: 800; color: var(--color-text); }
.detect-spot__badge {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  animation: scaleIn 0.3s ease;
}

@keyframes wastePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
  50% { box-shadow: 0 0 12px 4px rgba(59,130,246,0.4); }
}

/* Waste meter */
.waste-meter {
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

.meter-label { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; }

.meter-dots {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.meter-dot { font-size: 18px; transition: all 0.3s ease; }
.meter-dot--found { animation: scaleIn 0.3s ease; }

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
