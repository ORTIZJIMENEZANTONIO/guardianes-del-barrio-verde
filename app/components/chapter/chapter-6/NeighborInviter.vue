<template>
  <MinigameShell
    title="Invitar al barrio"
    description="Encuentra a los 6 vecinos del barrio y tocalos para invitarlos al festival."
    :completed="neighborsInvited"
    :total="6"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="invite-game">
      <SceneSky variant="nice" />
      <SceneStreet variant="clean" />
      <div class="game-hint">
        👆 Toca a cada vecino para invitarlo · Invitados: {{ neighborsInvited }}/6
      </div>
      <div class="street-scene">
        <div
          v-for="neighbor in neighbors"
          :key="neighbor.id"
          class="neighbor-spot game-zone"
          :class="{
            'neighbor-spot--invited game-zone--filled': neighbor.invited,
          }"
          :style="{ left: neighbor.x + '%', top: neighbor.y + '%' }"
          @click="inviteNeighbor(neighbor)"
        >
          <span class="neighbor-spot__emoji game-zone__icon">{{ neighbor.emoji }}</span>
          <span class="neighbor-spot__label game-zone__label">{{ neighbor.label }}</span>
          <div v-if="neighbor.invited" class="neighbor-spot__check">✅</div>
        </div>
      </div>

      <!-- Invite counter -->
      <div class="invite-counter">
        <div class="counter-label">Invitados</div>
        <div class="counter-value">{{ neighborsInvited }} / 6</div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="invite-feedback game-feedback game-feedback--ok">
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

const { celebrateSuccess, confettiBurst } = useGameAnimations()

interface Neighbor {
  id: string
  label: string
  emoji: string
  x: number
  y: number
  invited: boolean
  message: string
}

const allNeighbors: Neighbor[] = [
  { id: 'n1', label: 'Mama con nino', emoji: '👩‍👦', x: 10, y: 55, invited: false,
    message: 'Que bueno que hay algo para los ninos. Ahi estaremos!' },
  { id: 'n2', label: 'Abuelo', emoji: '👴', x: 65, y: 20, invited: false,
    message: 'Un festival verde? Hace falta que los jovenes aprendan a cuidar donde viven.' },
  { id: 'n3', label: 'Joven guitarra', emoji: '🧑‍🎤', x: 40, y: 45, invited: false,
    message: 'Puedo tocar unas canciones en el festival? La musica une a la gente.' },
  { id: 'n4', label: 'Senora tienda', emoji: '👩‍🍳', x: 75, y: 60, invited: false,
    message: 'Llevo mis aguas frescas en jarras de vidrio. Nada de botellas de plastico!' },
  { id: 'n5', label: 'Nino en bici', emoji: '🚴', x: 25, y: 30, invited: false,
    message: 'Yo quiero participar en las carreras! Y vine en bici para no contaminar.' },
  { id: 'n6', label: 'Maestra', emoji: '👩‍🏫', x: 55, y: 70, invited: false,
    message: 'Esto es educacion ambiental real. Cuenten conmigo para las charlas del foro.' },
]

const neighbors = ref<Neighbor[]>([])
const neighborsInvited = ref(0)
const isComplete = computed(() => neighborsInvited.value >= 6)
const showResult = ref(false)
const feedback = ref<{ message: string } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function onStart() {
  neighbors.value = allNeighbors.map(n => ({ ...n }))
  neighborsInvited.value = 0
}

function inviteNeighbor(neighbor: Neighbor) {
  if (neighbor.invited) return
  neighbor.invited = true
  neighborsInvited.value++
  showFeedback(neighbor.message)

  nextTick(() => {
    const spotEl = document.querySelector(`.neighbor-spot:nth-child(${neighbors.value.indexOf(neighbor) + 1})`)
    if (spotEl) celebrateSuccess(spotEl)
  })

  if (isComplete.value) {
    const gameEl = document.querySelector('.invite-game')
    if (gameEl) confettiBurst(gameEl, 20)
    setTimeout(() => { showResult.value = true }, 1000)
  }
}

function showFeedback(message: string) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  neighbors.value = allNeighbors.map(n => ({ ...n }))
  neighborsInvited.value = 0
  showResult.value = false
}
</script>

<style scoped>
.invite-game {
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

.neighbor-spot {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 70px;
  height: 70px;
  background: rgba(255,255,255,0.7);
  border: 2px dashed rgba(139,92,246,0.5);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.neighbor-spot:active { transform: scale(0.95); }

.neighbor-spot--invited {
  background: rgba(139,92,246,0.2);
  border-color: #8b5cf6;
  border-style: solid;
  cursor: default;
  animation: celebrateIn 0.5s ease;
}

.neighbor-spot--invited:active { transform: none; }

.neighbor-spot__emoji { font-size: 24px; }
.neighbor-spot__label { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; }
.neighbor-spot__check {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 16px;
  animation: scaleIn 0.3s ease;
}

.invite-counter {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: rgba(255,255,255,0.9);
  gap: 6px;
  z-index: 5;
  position: relative;
}

.counter-label { font-size: 10px; font-weight: 800; color: var(--color-text); }
.counter-value { font-size: 18px; font-weight: 800; color: #8b5cf6; }

/* feedback position handled by .game-feedback */

@keyframes celebrateIn {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
